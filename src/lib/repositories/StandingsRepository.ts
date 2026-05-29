import type { IStandingsRepository } from './interfaces'
import type { ICache } from '../cache/ICache'
import { cacheKey, TTL } from '../cache/ICache'
import type { ProviderBundle } from '../providers/interfaces'
import { RepositoryError } from '../providers/interfaces'
import { getProviderIds } from '@/lib/config'
import type { GroupRow, GroupStage } from '@/lib/mock/types'

export class StandingsRepository implements IStandingsRepository {
  constructor(
    private readonly bundles: ProviderBundle[],
    private readonly cache:   ICache,
  ) {}

  async findAllGroups(): Promise<GroupStage[]> {
    const ck = cacheKey.standings('wc2026')
    const cached = await this.cache.get<GroupStage[]>(ck)
    if (cached) return cached

    const rows = await this.fetchAllRows()
    const groups = buildGroupStages(rows)

    await this.cache.set(ck, groups, TTL.STANDINGS)
    return groups
  }

  async findGroup(groupId: string): Promise<GroupStage | null> {
    const all = await this.findAllGroups()
    return all.find(g => g.id.toUpperCase() === groupId.toUpperCase()) ?? null
  }

  async findAllRows(): Promise<GroupRow[]> {
    const groups = await this.findAllGroups()
    return groups.flatMap(g => g.teams).sort(
      (a, b) => a.team.group.localeCompare(b.team.group) || a.position - b.position,
    )
  }

  private async fetchAllRows(): Promise<GroupRow[]> {
    return this.withBundleFallback(async ({ provider, adapter }) => {
      const params = getProviderIds(provider.name) ?? {}
      const raw    = await provider.getGroupStandings(params)
      return raw.map(r => adapter.toGroupRow(r))
    })
  }

  private async withBundleFallback<T>(fn: (bundle: ProviderBundle) => Promise<T>): Promise<T> {
    const errors: Error[] = []
    for (const bundle of this.bundles) {
      try { return await fn(bundle) }
      catch (err) {
        const e = err instanceof Error ? err : new Error(String(err))
        errors.push(e)
        console.warn(`[StandingsRepository] ${bundle.provider.name} failed: ${e.message}`)
      }
    }
    throw new RepositoryError('standings', `All providers failed: ${errors.map(e => e.message).join(' | ')}`)
  }
}

// ── Build group stages from flat rows ─────────────────────────────────────────

function buildGroupStages(rows: GroupRow[]): GroupStage[] {
  const map = new Map<string, GroupRow[]>()

  for (const row of rows) {
    const g = row.team.group || 'A'  // fallback if provider doesn't set group
    const list = map.get(g) ?? []
    list.push(row)
    map.set(g, list)
  }

  const stages: GroupStage[] = []
  for (const [id, teams] of map) {
    stages.push({
      id,
      name: `Group ${id}`,
      teams: teams.sort((a, b) => a.position - b.position),
    })
  }

  return stages.sort((a, b) => a.id.localeCompare(b.id))
}
