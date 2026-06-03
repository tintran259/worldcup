/**
 * Stats repository — top scorers, team goals, tournament summary.
 *
 * Aggregates data từ matches + provider top scorer endpoint.
 */

import { TTL } from '@/lib/cache'
import { getCurrentCompetition, getCurrentProviderIds } from '@/lib/config/competitionContext'
import { RepositoryError } from '../providers/errors'
import type { Cache } from '@/lib/cache'
import type { ProviderBundle } from '../providers/types'
import type { TopScorer } from '@/lib/mock/types'
import type { Match } from '@/types/domain.types'

export interface TeamGoals {
  /** Team ID (dùng cho filter favorites) */
  id:      string
  /** Mã quốc gia 3 ký tự (BRA, FRA, ARG...) */
  name:    string
  /** Mã quốc gia ISO2 (br, fr, ar...) cho cờ */
  code:    string
  /** URL flag từ API — Flag component sẽ ưu tiên dùng URL này */
  flagUrl: string
  /** Tổng số bàn ghi được */
  goals:   number
}

export interface StatsSummary {
  goalsScored:     number
  matchesPlayed:   number
  goalsPerMatch:   number
  teamsRemaining:  number
}

export function createStatsRepository(bundles: ProviderBundle[], cache: Cache) {

  async function withFallback<T>(fn: (b: ProviderBundle) => Promise<T>): Promise<T> {
    if (bundles.length === 0) {
      throw new RepositoryError(
        'stats',
        'No API provider configured. Add API_FOOTBALL_KEY to .env.local to fetch live data.',
      )
    }

    const errors: string[] = []
    for (const bundle of bundles) {
      try { return await fn(bundle) }
      catch (err) {
        errors.push(`${bundle.provider.name}: ${(err as Error).message}`)
      }
    }
    throw new RepositoryError('stats', `All providers failed. ${errors.join(' | ')}`)
  }

  return {
    async findTopScorers(limit = 5): Promise<TopScorer[]> {
      // Cache key include competition.key để không serve topscorers giải cũ.
      // getOrCompute: dedup concurrent requests.
      return cache.getOrCompute(
        `topscorers:${getCurrentCompetition().key}:${limit}`,
        TTL.STANDINGS,
        () => withFallback(async ({ provider, adapter }) => {
          const params = getCurrentProviderIds(provider.name) ?? {}
          const raw    = await provider.getTopScorers(params)
          return raw.slice(0, limit).map((r, i) => adapter.toTopScorer(r, i + 1))
        }),
      )
    },

    /**
     * Tính tổng bàn thắng theo đội từ completed matches.
     * Trả về top N đội ghi nhiều bàn nhất.
     */
    computeTeamGoals(matches: Match[], limit = 5): TeamGoals[] {
      const map = new Map<string, TeamGoals>()

      for (const m of matches) {
        if (m.status !== 'completed' || !m.score) continue
        if (m.homeTeam) {
          const t = map.get(m.homeTeam.id) ?? {
            id:      m.homeTeam.id,
            name:    m.homeTeam.shortName,
            code:    m.homeTeam.code,
            flagUrl: m.homeTeam.flagUrl,
            goals:   0,
          }
          t.goals += m.score.home
          map.set(m.homeTeam.id, t)
        }
        if (m.awayTeam) {
          const t = map.get(m.awayTeam.id) ?? {
            id:      m.awayTeam.id,
            name:    m.awayTeam.shortName,
            code:    m.awayTeam.code,
            flagUrl: m.awayTeam.flagUrl,
            goals:   0,
          }
          t.goals += m.score.away
          map.set(m.awayTeam.id, t)
        }
      }

      return [...map.values()].sort((a, b) => b.goals - a.goals).slice(0, limit)
    },

    /**
     * Tính tổng quan giải đấu: số bàn, số trận, GP/trận, số đội còn lại.
     */
    computeSummary(matches: Match[]): StatsSummary {
      const completed = matches.filter(m => m.status === 'completed' && m.score)
      const goalsScored = completed.reduce((sum, m) => sum + (m.score!.home + m.score!.away), 0)

      // Số đội còn lại = số đội xuất hiện trong upcoming/live matches
      const remainingTeamIds = new Set<string>()
      for (const m of matches) {
        if (m.status === 'completed') continue
        if (m.homeTeam) remainingTeamIds.add(m.homeTeam.id)
        if (m.awayTeam) remainingTeamIds.add(m.awayTeam.id)
      }

      return {
        goalsScored,
        matchesPlayed:  completed.length,
        goalsPerMatch:  completed.length > 0 ? Number((goalsScored / completed.length).toFixed(1)) : 0,
        teamsRemaining: remainingTeamIds.size,
      }
    },
  }
}

export type StatsRepository = ReturnType<typeof createStatsRepository>
