/**
 * Match repository — createMatchRepository()
 *
 * Không biết provider nào đang được dùng.
 * Chỉ biết: "Tao cần Match[]" và delegate cho provider xử lý.
 */

import { cacheKey, TTL } from '@/lib/cache'
import { getCurrentCompetition, getCurrentProviderIds } from '@/lib/config/competitionContext'
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
    // Khi không có provider — báo lỗi rõ thay vì throw chung chung
    if (bundles.length === 0) {
      throw new RepositoryError(
        'match',
        'No API provider configured. Add API_FOOTBALL_KEY to .env.local to fetch live data.',
      )
    }

    const errors: string[] = []
    for (const bundle of bundles) {
      try { return await fn(bundle) }
      catch (err) {
        const msg = (err as Error).message
        errors.push(`${bundle.provider.name}: ${msg}`)
        console.warn(`[MatchRepository] ${bundle.provider.name} failed — ${msg}`)
      }
    }
    throw new RepositoryError('match', `All providers failed. ${errors.join(' | ')}`)
  }

  return {
    async findLive(): Promise<Match[]> {
      const comp = getCurrentCompetition()
      // getOrCompute: dedup concurrent requests cùng key
      return cache.getOrCompute(
        cacheKey.liveMatches(comp.key),
        TTL.LIVE_MATCH,
        () => withFallback(async ({ provider, adapter }) => {
          const params = getCurrentProviderIds(provider.name) ?? {}
          return (await provider.getLiveMatches(params)).map(r => adapter.toMatch(r))
        }),
      )
    },

    /**
     * Cache-only read — KHÔNG trigger API call.
     * Dùng cho /api/stream/live SSE: chỉ đọc cache có sẵn, broadcast events tới
     * tất cả connected clients mà không tăng quota.
     *
     * Cache được populate bởi /api/matches?status=live khi user load app (hook
     * useLiveMatches). SSE chỉ là consumer thụ động → zero direct API impact.
     *
     * @returns Match[] nếu cache hit, null nếu cache miss (caller xử lý empty).
     */
    async findLiveFromCache(): Promise<Match[] | null> {
      const comp = getCurrentCompetition()
      return cache.get<Match[]>(cacheKey.liveMatches(comp.key))
    },

    async findAll(): Promise<Match[]> {
      const comp = getCurrentCompetition()
      const firstId = Object.values(comp.providerIds)[0]
      const from = firstId?.dateFrom ?? ''
      const to = firstId?.dateTo ?? ''

      return cache.getOrCompute(
        cacheKey.fixtures(comp.key, from, to),
        TTL.FIXTURES,
        () => withFallback(async ({ provider, adapter }) => {
          const ids = getCurrentProviderIds(provider.name)
          const params: FixtureParams = { ...(ids ?? {}), from: ids?.dateFrom ?? from, to: ids?.dateTo ?? to }
          const raw = await provider.getFixtures(params)
          return raw.map(r => adapter.toMatch(r))
        }),
      )
    },

    async findById(id: string): Promise<Match | null> {
      return cache.getOrCompute(
        cacheKey.matchDetail(id),
        // TTL được set theo match status, nhưng lúc getOrCompute chưa biết status.
        // Dùng MATCH_DETAIL làm default, repository sẽ del + reset khi cần.
        TTL.MATCH_DETAIL,
        () => withFallback(async ({ provider, adapter }) => {
          const extId = toExternalId(id, provider.name)
          const raw = await provider.getMatchById(extId)
          if (!raw) return null

          const match = adapter.toMatch(raw)
          const events = (await provider.getMatchEvents(extId)).map(e => adapter.toMatchEvent(e))
          return { ...match, events } as Match
        }),
      )
    },

    async findByTeam(teamId: string): Promise<Match[]> {
      const all = await this.findAll()
      return all.filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
    },

    async findByDateRange(from: Date, to: Date): Promise<Match[]> {
      const comp = getCurrentCompetition()
      const fromStr = from.toISOString().slice(0, 10)
      const toStr = to.toISOString().slice(0, 10)

      return cache.getOrCompute(
        cacheKey.fixtures(comp.key, fromStr, toStr),
        TTL.FIXTURES,
        () => withFallback(async ({ provider, adapter }) => {
          const ids = getCurrentProviderIds(provider.name) ?? {}
          const params: FixtureParams = { ...ids, from: fromStr, to: toStr }
          return (await provider.getFixtures(params)).map(r => adapter.toMatch(r))
        }),
      )
    },

    async invalidate(id: string): Promise<void> {
      const comp = getCurrentCompetition()
      await Promise.all([
        cache.del(cacheKey.matchDetail(id)),
        cache.del(cacheKey.matchEvents(id)),
        cache.del(cacheKey.liveMatches(comp.key)),
      ])
    },
  }
}

export type MatchRepository = ReturnType<typeof createMatchRepository>
