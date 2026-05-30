/**
 * Match repository — createMatchRepository()
 *
 * Không biết provider nào đang được dùng.
 * Chỉ biết: "Tao cần Match[]" và delegate cho provider xử lý.
 */

import { cacheKey, TTL } from '@/lib/cache'
import { getCompetition, getProviderIds } from '@/lib/config'
import { RepositoryError } from '../providers/errors'
import type { Cache } from '@/lib/cache'
import type { ProviderBundle, FixtureParams } from '../providers/types'
import type { Match } from '@/types/domain.types'

// Prefix để nhận ra external ID của từng provider
const PROVIDER_PREFIX: Record<string, string> = {
  'api-football': 'af:',
  'sportmonks': 'sm:',
  'sportradar': 'sr:',
}

function toExternalId(id: string, providerName: string): string {
  const prefix = PROVIDER_PREFIX[providerName] ?? ''
  return id.startsWith(prefix) ? id.slice(prefix.length) : id
}

export function createMatchRepository(bundles: ProviderBundle[], cache: Cache) {

  // Thử từng provider theo thứ tự, dừng khi thành công
  async function withFallback<T>(fn: (b: ProviderBundle) => Promise<T>): Promise<T> {
    const errors: string[] = []
    for (const bundle of bundles) {
      try { return await fn(bundle) }
      catch (err) {
        const msg = (err as Error).message
        errors.push(`${bundle.provider.name}: ${msg}`)
        console.warn(`[MatchRepository] ${bundle.provider.name} thất bại — ${msg}`)
      }
    }
    throw new RepositoryError('match', `Tất cả providers thất bại: ${errors.join(' | ')}`)
  }

  // Cache wrapper: đọc cache trước, nếu miss thì gọi provider
  async function withCache<T>(key: string, ttl: number, fn: (b: ProviderBundle) => Promise<T>): Promise<T> {
    const hit = await cache.get<T>(key)
    if (hit !== null) return hit
    const result = await withFallback(fn)
    await cache.set(key, result, ttl)
    return result
  }

  return {
    async findLive(): Promise<Match[]> {
      const comp = getCompetition()
      return withCache(cacheKey.liveMatches(comp.key), TTL.LIVE_MATCH, async ({ provider, adapter }) => {
        const params = getProviderIds(provider.name) ?? {}
        return (await provider.getLiveMatches(params)).map(r => adapter.toMatch(r))
      })
    },

    async findAll(): Promise<Match[]> {
      const comp = getCompetition()
      const firstId = Object.values(comp.providerIds)[0]
      const from = firstId?.dateFrom ?? ''
      const to = firstId?.dateTo ?? ''

      return withCache(cacheKey.fixtures(comp.key, from, to), TTL.FIXTURES, async ({ provider, adapter }) => {
        const ids = getProviderIds(provider.name)
        const params: FixtureParams = { ...(ids ?? {}), from: ids?.dateFrom ?? from, to: ids?.dateTo ?? to }
        return (await provider.getFixtures(params)).map(r => adapter.toMatch(r))
      })
    },

    async findById(id: string): Promise<Match | null> {
      const ck = cacheKey.matchDetail(id)
      const cached = await cache.get<Match>(ck)
      if (cached) return cached

      return withFallback(async ({ provider, adapter }) => {
        const extId = toExternalId(id, provider.name)
        const raw = await provider.getMatchById(extId)
        if (!raw) return null

        const match = adapter.toMatch(raw)
        const events = (await provider.getMatchEvents(extId)).map(e => adapter.toMatchEvent(e))
        const full: Match = { ...match, events }

        await cache.set(ck, full, match.status === 'live' ? TTL.MATCH_EVENTS : TTL.MATCH_DETAIL)
        return full
      })
    },

    async findByTeam(teamId: string): Promise<Match[]> {
      const all = await this.findAll()
      return all.filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
    },

    async findByDateRange(from: Date, to: Date): Promise<Match[]> {
      const comp = getCompetition()
      const fromStr = from.toISOString().slice(0, 10)
      const toStr = to.toISOString().slice(0, 10)

      return withCache(cacheKey.fixtures(comp.key, fromStr, toStr), TTL.FIXTURES, async ({ provider, adapter }) => {
        const ids = getProviderIds(provider.name) ?? {}
        const params: FixtureParams = { ...ids, from: fromStr, to: toStr }
        return (await provider.getFixtures(params)).map(r => adapter.toMatch(r))
      })
    },

    async invalidate(id: string): Promise<void> {
      const comp = getCompetition()
      await Promise.all([
        cache.del(cacheKey.matchDetail(id)),
        cache.del(cacheKey.matchEvents(id)),
        cache.del(cacheKey.liveMatches(comp.key)),
      ])
    },
  }
}

export type MatchRepository = ReturnType<typeof createMatchRepository>
