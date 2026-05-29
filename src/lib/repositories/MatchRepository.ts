import type { IMatchRepository } from './interfaces'
import type { ICache } from '../cache/ICache'
import { cacheKey, TTL } from '../cache/ICache'
import type { ProviderBundle } from '../providers/interfaces'
import { RepositoryError } from '../providers/interfaces'
import { getCompetition, getProviderIds } from '@/lib/config'
import type { Match } from '@/types/domain.types'
import type { FixtureParams } from '../providers/interfaces'

export class MatchRepository implements IMatchRepository {
  constructor(
    private readonly bundles: ProviderBundle[],
    private readonly cache:   ICache,
  ) {}

  // ── Public API ───────────────────────────────────────────────────────────────

  async findLive(): Promise<Match[]> {
    const comp = getCompetition()
    return this.withCache(
      cacheKey.liveMatches(comp.key),
      TTL.LIVE_MATCH,
      async ({ provider, adapter }) => {
        const params = getProviderIds(provider.name) ?? {}
        const raw    = await provider.getLiveMatches(params)
        return raw.map(r => adapter.toMatch(r))
      },
    )
  }

  async findById(id: string): Promise<Match | null> {
    const ck = cacheKey.matchDetail(id)
    const cached = await this.cache.get<Match>(ck)
    if (cached) return cached

    return this.withBundleFallback(async ({ provider, adapter }) => {
      const externalId = toExternalId(id, provider.name)
      const raw        = await provider.getMatchById(externalId)
      if (!raw) return null

      const match    = adapter.toMatch(raw)
      const rawEvents = await provider.getMatchEvents(externalId)
      const events   = rawEvents.map(e => adapter.toMatchEvent(e))

      const enriched: Match = { ...match, events }
      const ttl = match.status === 'live' ? TTL.MATCH_EVENTS : TTL.MATCH_DETAIL
      await this.cache.set(ck, enriched, ttl)
      return enriched
    })
  }

  async findAll(): Promise<Match[]> {
    const comp    = getCompetition()
    // Use the first provider's dates as the canonical date range for the cache key
    const firstIds  = Object.values(comp.providerIds)[0]
    const dateFrom  = firstIds?.dateFrom ?? ''
    const dateTo    = firstIds?.dateTo   ?? ''

    return this.withCache(
      cacheKey.fixtures(comp.key, dateFrom, dateTo),
      TTL.FIXTURES,
      async ({ provider, adapter }) => {
        const ids = getProviderIds(provider.name)
        const params: FixtureParams = {
          ...(ids ?? {}),
          from: ids?.dateFrom ?? dateFrom,
          to:   ids?.dateTo   ?? dateTo,
        }
        const raw = await provider.getFixtures(params)
        return raw.map(r => adapter.toMatch(r))
      },
    )
  }

  async findByTeam(teamId: string): Promise<Match[]> {
    const all = await this.findAll()
    return all.filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
  }

  async findByDateRange(from: Date, to: Date): Promise<Match[]> {
    const comp    = getCompetition()
    const fromStr = from.toISOString().slice(0, 10)
    const toStr   = to.toISOString().slice(0, 10)

    return this.withCache(
      cacheKey.fixtures(comp.key, fromStr, toStr),
      TTL.FIXTURES,
      async ({ provider, adapter }) => {
        const ids    = getProviderIds(provider.name) ?? {}
        const params: FixtureParams = { ...ids, from: fromStr, to: toStr }
        const raw    = await provider.getFixtures(params)
        return raw.map(r => adapter.toMatch(r))
      },
    )
  }

  async invalidate(id: string): Promise<void> {
    const comp = getCompetition()
    await this.cache.del(cacheKey.matchDetail(id))
    await this.cache.del(cacheKey.matchEvents(id))
    await this.cache.del(cacheKey.liveMatches(comp.key))
  }

  // ── Private ───────────────────────────────────────────────────────────────────

  private async withCache<T>(
    key: string,
    ttl: number,
    fn:  (bundle: ProviderBundle) => Promise<T>,
  ): Promise<T> {
    const cached = await this.cache.get<T>(key)
    if (cached !== null) return cached

    const result = await this.withBundleFallback(fn)
    await this.cache.set(key, result, ttl)
    return result
  }

  private async withBundleFallback<T>(fn: (bundle: ProviderBundle) => Promise<T>): Promise<T> {
    const errors: Error[] = []
    for (const bundle of this.bundles) {
      try { return await fn(bundle) }
      catch (err) {
        const e = err instanceof Error ? err : new Error(String(err))
        errors.push(e)
        console.warn(`[MatchRepository] ${bundle.provider.name} failed: ${e.message}`)
      }
    }
    throw new RepositoryError('match', `All providers failed: ${errors.map(e => e.message).join(' | ')}`)
  }
}

function toExternalId(id: string, provider: string): string {
  const prefix = provider === 'api-football' ? 'af:' : provider === 'sportmonks' ? 'sm:' : 'sr:'
  return id.startsWith(prefix) ? id.slice(prefix.length) : id
}
