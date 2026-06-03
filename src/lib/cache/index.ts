/**
 * Cache module
 *
 * Dùng trong BFF route handlers để giảm số lần gọi external API.
 * Tạo cache bằng createCache() — mỗi server worker dùng 1 instance.
 *
 * Tương lai: đổi MemoryCache → RedisCache mà không cần sửa gì bên ngoài.
 */

export {
  CACHE_PROFILES,
  buildCacheControl,
  cacheHeaders,
  matchProfile,
  type CacheProfile,
  type CacheProfileKey,
} from './profiles'

export { createRedisCache, type UpstashConfig } from './redisCache'

// ── Interface ─────────────────────────────────────────────────────────────────

export interface Cache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
  del(key: string): Promise<void>
  flush(pattern?: string): Promise<void>
  has(key: string): Promise<boolean>

  /**
   * Get-or-compute với inflight deduplication.
   *
   * Khi N concurrent requests cùng key đều miss cache:
   *   - Request đầu tiên gọi `compute()`, register promise vào inflight map
   *   - Request 2..N nhận lại CÙNG promise đó (không gọi compute thêm)
   *   - Khi promise resolve → set cache → tất cả N requests cùng nhận data
   *   - Khi promise reject → KHÔNG cache → tất cả N requests cùng throw
   *
   * → Thundering herd: 1000 user cùng request /api/standings khi cache miss
   *   chỉ gọi external API 1 lần thay vì 1000 lần.
   */
  getOrCompute<T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T>
}

// ── TTL presets (seconds) ─────────────────────────────────────────────────────

export const TTL = {
  LIVE_MATCH: 15,      // tỉ số đang live — refresh nhanh
  MATCH_DETAIL: 60,      // chi tiết 1 trận
  MATCH_EVENTS: 20,      // timeline bàn thắng/thẻ
  FIXTURES: 300,     // lịch thi đấu (5 phút)
  STANDINGS: 300,     // bảng xếp hạng (5 phút)
  TEAM_PROFILE: 3_600,   // thông tin đội (1 tiếng)
  SQUAD: 7_200,   // đội hình (2 tiếng)
} as const

// ── Cache key helpers ─────────────────────────────────────────────────────────

export const cacheKey = {
  liveMatches: (tournament: string) => `matches:live:${tournament}`,
  matchDetail: (id: string) => `match:${id}`,
  matchEvents: (id: string) => `match:${id}:events`,
  fixtures: (tournament: string, from: string, to: string) => `fixtures:${tournament}:${from}:${to}`,
  standings: (tournament: string) => `standings:${tournament}`,
  teamProfile: (id: string) => `team:${id}`,
  squad: (teamId: string) => `team:${teamId}:squad`,
} as const

// ── In-memory implementation ──────────────────────────────────────────────────

interface Entry {
  value: unknown
  expiresAt: number  // Date.now() + ttl*1000, 0 = không hết hạn
  lru: number  // monotonic counter để evict entry ít dùng nhất
}

export function createCache(maxEntries = 512): Cache {
  const store    = new Map<string, Entry>()
  // Inflight map: key → Promise đang chạy. Tránh thundering herd khi N concurrent
  // requests cùng key đều miss cache.
  const inflight = new Map<string, Promise<unknown>>()
  let lruClock = 0

  function isExpired(e: Entry) {
    return e.expiresAt !== 0 && Date.now() > e.expiresAt
  }

  function evictOldest() {
    // Xóa 10% entry cũ nhất khi đầy
    const count = Math.max(1, Math.floor(maxEntries * 0.1))
    const sorted = [...store.entries()].sort((a, b) => a[1].lru - b[1].lru)
    for (let i = 0; i < count && i < sorted.length; i++) {
      store.delete(sorted[i][0])
    }
  }

  const cache: Cache = {
    async get<T>(key: string) {
      const entry = store.get(key)
      if (!entry) return null
      if (isExpired(entry)) { store.delete(key); return null }
      entry.lru = ++lruClock
      return entry.value as T
    },

    async set<T>(key: string, value: T, ttlSeconds: number) {
      if (store.size >= maxEntries) evictOldest()
      store.set(key, {
        value,
        expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1_000 : 0,
        lru: ++lruClock,
      })
    },

    async del(key) { store.delete(key); inflight.delete(key) },

    async flush(pattern) {
      if (!pattern) { store.clear(); inflight.clear(); return }
      const re = new RegExp(
        '^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$',
      )
      for (const key of store.keys())    if (re.test(key)) store.delete(key)
      for (const key of inflight.keys()) if (re.test(key)) inflight.delete(key)
    },

    async has(key) {
      const entry = store.get(key)
      if (!entry) return false
      if (isExpired(entry)) { store.delete(key); return false }
      return true
    },

    async getOrCompute<T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T> {
      // 1. Cache hit → trả ngay
      const cached = await cache.get<T>(key)
      if (cached !== null) return cached

      // 2. Đang có request inflight cho key này → join vào cùng promise
      const existing = inflight.get(key)
      if (existing) return existing as Promise<T>

      // 3. Là người đầu tiên miss → compute + register promise
      const promise = (async () => {
        try {
          const value = await compute()
          await cache.set(key, value, ttlSeconds)
          return value
        } finally {
          // Cleanup inflight slot dù success hay fail.
          // Lưu ý: nếu fail, KHÔNG cache → request tiếp theo sẽ thử lại.
          inflight.delete(key)
        }
      })()

      inflight.set(key, promise)
      return promise
    },
  }

  return cache
}
