import { cacheKey, TTL } from '@/lib/cache'
import { getCurrentCompetition, getCurrentProviderIds } from '@/lib/config/competitionContext'
import { RepositoryError } from '../providers/errors'
import type { Cache } from '@/lib/cache'
import type { ProviderBundle } from '../providers/types'
import type { GroupRow, GroupStage } from '@/lib/mock/types'

export function createStandingsRepository(bundles: ProviderBundle[], cache: Cache) {

  async function withFallback<T>(fn: (b: ProviderBundle) => Promise<T>): Promise<T> {
    if (bundles.length === 0) {
      throw new RepositoryError(
        'standings',
        'No API provider configured. Add API_FOOTBALL_KEY to .env.local to fetch live data.',
      )
    }

    const errors: string[] = []
    for (const bundle of bundles) {
      try { return await fn(bundle) }
      catch (err) {
        errors.push(`${bundle.provider.name}: ${(err as Error).message}`)
        console.warn(`[StandingsRepository] ${bundle.provider.name} failed`)
      }
    }
    throw new RepositoryError('standings', `All providers failed. ${errors.join(' | ')}`)
  }

  // Build GroupStage[] từ flat GroupRow[]
  function buildGroupStages(rows: GroupRow[]): GroupStage[] {
    const map = new Map<string, GroupRow[]>()
    for (const row of rows) {
      const g = row.team.group || 'A'
      map.set(g, [...(map.get(g) ?? []), row])
    }
    return [...map.entries()]
      .map(([id, teams]) => ({ id, name: `Group ${id}`, teams: teams.sort((a, b) => a.position - b.position) }))
      .sort((a, b) => a.id.localeCompare(b.id))
  }

  return {
    async findAllGroups(): Promise<GroupStage[]> {
      const ck = cacheKey.standings(getCurrentCompetition().key)

      // getOrCompute: 100 concurrent requests miss cùng key → chỉ 1 call API.
      return cache.getOrCompute(ck, TTL.STANDINGS, async () => {
        const rows = await withFallback(async ({ provider, adapter }) => {
          const params = getCurrentProviderIds(provider.name) ?? {}
          return (await provider.getGroupStandings(params)).map(r => adapter.toGroupRow(r))
        })
        return buildGroupStages(rows)
      })
    },

    async findGroup(groupId: string): Promise<GroupStage | null> {
      const all = await this.findAllGroups()
      return all.find(g => g.id.toUpperCase() === groupId.toUpperCase()) ?? null
    },

    async findAllRows(): Promise<GroupRow[]> {
      const groups = await this.findAllGroups()
      return groups.flatMap(g => g.teams).sort(
        (a, b) => a.team.group.localeCompare(b.team.group) || a.position - b.position,
      )
    },
  }
}

export type StandingsRepository = ReturnType<typeof createStandingsRepository>
