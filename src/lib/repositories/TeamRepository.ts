import type { ITeamRepository } from './interfaces'
import type { ICache } from '../cache/ICache'
import { cacheKey, TTL } from '../cache/ICache'
import type { ProviderBundle } from '../providers/interfaces'
import { RepositoryError } from '../providers/interfaces'
import { getCompetition, getProviderIds } from '@/lib/config'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'

export class TeamRepository implements ITeamRepository {
  constructor(
    private readonly bundles: ProviderBundle[],
    private readonly cache:   ICache,
  ) {}

  async findById(id: string): Promise<ExtendedTeam | null> {
    const ck = cacheKey.teamProfile(id)
    const cached = await this.cache.get<ExtendedTeam>(ck)
    if (cached) return cached

    const result = await this.withBundleFallback(async ({ provider, adapter }) => {
      const externalId = toExternalId(id, provider.name)
      const raw = await provider.getTeamById(externalId)
      if (!raw) return null
      return adapter.toExtendedTeam(raw)
    })

    if (result) await this.cache.set(ck, result, TTL.TEAM_PROFILE)
    return result
  }

  async findAll(): Promise<ExtendedTeam[]> {
    const ck = 'teams:all'
    const cached = await this.cache.get<ExtendedTeam[]>(ck)
    if (cached) return cached

    const result = await this.withBundleFallback(async ({ provider, adapter }) => {
      const params = getProviderIds(provider.name) ?? {}
      const raw    = await provider.getTeamsByTournament(params)
      return raw.map(r => adapter.toExtendedTeam(r))
    })

    await this.cache.set(ck, result, TTL.TEAM_PROFILE)
    return result
  }

  async findSquad(teamId: string): Promise<StarPlayer[]> {
    const ck = cacheKey.squad(teamId)
    const cached = await this.cache.get<StarPlayer[]>(ck)
    if (cached) return cached

    const result = await this.withBundleFallback(async ({ provider, adapter }) => {
      const externalId = toExternalId(teamId, provider.name)
      const raw = await provider.getSquad(externalId)
      return raw.map(r => {
        const p = adapter.toPlayer(r)
        return { ...p, teamId }
      })
    })

    await this.cache.set(ck, result, TTL.SQUAD)
    return result
  }

  private async withBundleFallback<T>(
    fn: (bundle: ProviderBundle) => Promise<T>,
  ): Promise<T> {
    const errors: Error[] = []
    for (const bundle of this.bundles) {
      try { return await fn(bundle) }
      catch (err) {
        const e = err instanceof Error ? err : new Error(String(err))
        errors.push(e)
        console.warn(`[TeamRepository] ${bundle.provider.name} failed: ${e.message}`)
      }
    }
    throw new RepositoryError('team', `All providers failed: ${errors.map(e => e.message).join(' | ')}`)
  }
}

function toExternalId(id: string, providerName: string): string {
  const prefix = providerName === 'api-football' ? 'af:'
               : providerName === 'sportmonks'   ? 'sm:'
               : 'sr:'
  return id.startsWith(prefix) ? id.slice(prefix.length) : id
}
