import { cacheKey, TTL }   from '@/lib/cache'
import { getCurrentCompetition, getCurrentProviderIds } from '@/lib/config/competitionContext'
import { RepositoryError } from '../providers/errors'
import type { Cache }      from '@/lib/cache'
import type { ProviderBundle } from '../providers/types'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'

/**
 * Merge stats từ /players (có goals/assists/rating) vào squad (có photo + number).
 * Key match: playerId. Stats player thắng nếu cả 2 có (giữ photo từ squad nếu stats không có).
 */
function mergeSquadWithStats(squad: StarPlayer[], stats: StarPlayer[]): StarPlayer[] {
  const statsMap = new Map(stats.map((s) => [s.id, s]))
  return squad.map((s) => {
    const st = statsMap.get(s.id)
    if (!st) return s
    return {
      ...s,
      // Stats từ /players endpoint (chi tiết hơn)
      tournamentGoals:       st.tournamentGoals,
      tournamentAssists:     st.tournamentAssists,
      tournamentYellowCards: st.tournamentYellowCards,
      tournamentRedCards:    st.tournamentRedCards,
      matchesPlayed:         st.matchesPlayed,
      minutesPlayed:         st.minutesPlayed,
      rating:                st.rating,
      goals:                 st.goals,
      assists:               st.assists,
      yellowCards:           st.yellowCards,
      redCards:              st.redCards,
      isCaptain:             st.isCaptain || s.isCaptain,
      // Photo từ squad ưu tiên (squad endpoint trả photo chuẩn hơn /players)
      photoUrl:              s.photoUrl ?? st.photoUrl,
    }
  })
}

const PROVIDER_PREFIX: Record<string, string> = {
  'api-football': 'af:', 'sportmonks': 'sm:', 'sportradar': 'sr:',
}
function toExternalId(id: string, name: string) {
  const prefix = PROVIDER_PREFIX[name] ?? ''
  return id.startsWith(prefix) ? id.slice(prefix.length) : id
}

export function createTeamRepository(bundles: ProviderBundle[], cache: Cache) {

  async function withFallback<T>(fn: (b: ProviderBundle) => Promise<T>): Promise<T> {
    if (bundles.length === 0) {
      throw new RepositoryError(
        'team',
        'No API provider configured. Add API_FOOTBALL_KEY to .env.local to fetch live data.',
      )
    }

    const errors: string[] = []
    for (const bundle of bundles) {
      try { return await fn(bundle) }
      catch (err) {
        errors.push(`${bundle.provider.name}: ${(err as Error).message}`)
        console.warn(`[TeamRepository] ${bundle.provider.name} failed`)
      }
    }
    throw new RepositoryError('team', `All providers failed. ${errors.join(' | ')}`)
  }

  return {
    async findById(id: string): Promise<ExtendedTeam | null> {
      return cache.getOrCompute(
        cacheKey.teamProfile(id),
        TTL.TEAM_PROFILE,
        () => withFallback(async ({ provider, adapter }) => {
          const raw = await provider.getTeamById(toExternalId(id, provider.name))
          return raw ? adapter.toExtendedTeam(raw) : null
        }),
      )
    },

    async findAll(): Promise<ExtendedTeam[]> {
      // Cache key PHẢI include competition.key — nếu không sẽ giữ teams cũ
      // khi user switch sang giải khác.
      return cache.getOrCompute(
        `teams:all:${getCurrentCompetition().key}`,
        TTL.TEAM_PROFILE,
        () => withFallback(async ({ provider, adapter }) => {
          const params = getCurrentProviderIds(provider.name) ?? {}
          return (await provider.getTeamsByTournament(params)).map(r => adapter.toExtendedTeam(r))
        }),
      )
    },

    async findSquad(teamId: string): Promise<StarPlayer[]> {
      return cache.getOrCompute(
        cacheKey.squad(teamId),
        TTL.SQUAD,
        () => withFallback(async ({ provider, adapter }) => {
          const extId = toExternalId(teamId, provider.name)

          // Parallel: squad (photo, number, position) + stats (goals, assists, rating)
          const params = getCurrentProviderIds(provider.name) ?? {}
          const [squadRaw, statsRaw] = await Promise.all([
            provider.getSquad(extId),
            // Stats endpoint có thể fail/empty cho national team không có league data
            // → catch để không phá squad. Squad endpoint là source-of-truth chính.
            provider.getTeamPlayersWithStats(extId, params).catch((err) => {
              console.warn(`[TeamRepository] stats fetch failed for "${teamId}":`, err.message)
              return []
            }),
          ])

          const squad = squadRaw.map((r) => ({ ...adapter.toPlayer(r), teamId }))
          const stats = statsRaw.map((r) => ({ ...adapter.toPlayer(r), teamId }))

          // Nếu có stats → merge. Không có thì trả squad raw.
          return stats.length > 0 ? mergeSquadWithStats(squad, stats) : squad
        }),
      )
    },
  }
}

export type TeamRepository = ReturnType<typeof createTeamRepository>
