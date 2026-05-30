import { cacheKey, TTL }   from '@/lib/cache'
import { getCompetition, getProviderIds } from '@/lib/config'
import { RepositoryError } from '../providers/errors'
import type { Cache }      from '@/lib/cache'
import type { ProviderBundle } from '../providers/types'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'

const PROVIDER_PREFIX: Record<string, string> = {
  'api-football': 'af:', 'sportmonks': 'sm:', 'sportradar': 'sr:',
}
function toExternalId(id: string, name: string) {
  const prefix = PROVIDER_PREFIX[name] ?? ''
  return id.startsWith(prefix) ? id.slice(prefix.length) : id
}

export function createTeamRepository(bundles: ProviderBundle[], cache: Cache) {

  async function withFallback<T>(fn: (b: ProviderBundle) => Promise<T>): Promise<T> {
    const errors: string[] = []
    for (const bundle of bundles) {
      try { return await fn(bundle) }
      catch (err) {
        errors.push(`${bundle.provider.name}: ${(err as Error).message}`)
        console.warn(`[TeamRepository] ${bundle.provider.name} thất bại`)
      }
    }
    throw new RepositoryError('team', `Tất cả providers thất bại: ${errors.join(' | ')}`)
  }

  return {
    async findById(id: string): Promise<ExtendedTeam | null> {
      const ck     = cacheKey.teamProfile(id)
      const cached = await cache.get<ExtendedTeam>(ck)
      if (cached) return cached

      const result = await withFallback(async ({ provider, adapter }) => {
        const raw = await provider.getTeamById(toExternalId(id, provider.name))
        return raw ? adapter.toExtendedTeam(raw) : null
      })

      if (result) await cache.set(ck, result, TTL.TEAM_PROFILE)
      return result
    },

    async findAll(): Promise<ExtendedTeam[]> {
      const ck     = 'teams:all'
      const cached = await cache.get<ExtendedTeam[]>(ck)
      if (cached) return cached

      const result = await withFallback(async ({ provider, adapter }) => {
        const params = getProviderIds(provider.name) ?? {}
        return (await provider.getTeamsByTournament(params)).map(r => adapter.toExtendedTeam(r))
      })

      await cache.set(ck, result, TTL.TEAM_PROFILE)
      return result
    },

    async findSquad(teamId: string): Promise<StarPlayer[]> {
      const ck     = cacheKey.squad(teamId)
      const cached = await cache.get<StarPlayer[]>(ck)
      if (cached) return cached

      const result = await withFallback(async ({ provider, adapter }) => {
        const extId = toExternalId(teamId, provider.name)
        return (await provider.getSquad(extId)).map(r => ({ ...adapter.toPlayer(r), teamId }))
      })

      await cache.set(ck, result, TTL.SQUAD)
      return result
    },
  }
}

export type TeamRepository = ReturnType<typeof createTeamRepository>
