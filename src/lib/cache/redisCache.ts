/**
 * Redis cache implementation — dùng Upstash REST API.
 *
 * Tại sao Upstash REST không phải redis client (ioredis):
 *   - Vercel/Cloudflare serverless: cold start mới mỗi N phút → connection pool
 *     không persist → mỗi cold start phải reconnect (~30-100ms).
 *   - REST API stateless: chỉ là HTTP fetch → 0 cold start penalty.
 *   - Edge runtime: ioredis dùng net.Socket → KHÔNG support edge.
 *
 * Cách hoạt động:
 *   GET  https://xxx.upstash.io/get/{key}
 *   POST https://xxx.upstash.io/set/{key}/{base64-value}/ex/{ttl}
 *   POST https://xxx.upstash.io/del/{key}
 *
 * Header: Authorization: Bearer {UPSTASH_REDIS_REST_TOKEN}
 *
 * Cross-instance dedup (Phase 3): có thể thêm SETNX-based distributed lock
 * cho thundering herd protection. Hiện tại Phase 2 dedup per-instance only.
 */

import type { Cache } from './index'

export interface UpstashConfig {
  /** URL Upstash REST API — vd: https://us1-active-tiger-12345.upstash.io */
  url: string
  /** Bearer token */
  token: string
  /** Timeout cho mỗi HTTP request (ms) — fallback nhanh nếu Redis chậm */
  timeoutMs?: number
  /** Prefix key để namespace (tránh đụng key với app khác cùng Redis) */
  keyPrefix?: string
}

interface UpstashResponse<T> {
  result: T
  error?: string
}

const DEFAULT_TIMEOUT_MS = 2_000

/**
 * Gọi Upstash REST với timeout + JSON parse.
 * Throw nếu HTTP error hoặc timeout — caller (cache) sẽ tự fallback.
 */
async function upstashFetch<T>(
  config: UpstashConfig,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${config.url.replace(/\/$/, '')}${path}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${config.token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body:   body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      // Next.js: KHÔNG cache fetch này — luôn fresh
      cache:  'no-store',
    })

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(`Upstash ${res.status}: ${text}`)
    }

    const json = (await res.json()) as UpstashResponse<T>
    if (json.error) throw new Error(`Upstash error: ${json.error}`)
    return json.result
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Encode value cho Redis SET command.
 * JSON.stringify → URL-safe base64 (tránh special chars trong URL path).
 */
function encodeValue(value: unknown): string {
  const json = JSON.stringify(value)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json, 'utf8').toString('base64')
  }
  // Edge runtime fallback
  return btoa(unescape(encodeURIComponent(json)))
}

function decodeValue<T>(b64: string): T {
  let json: string
  if (typeof Buffer !== 'undefined') {
    json = Buffer.from(b64, 'base64').toString('utf8')
  } else {
    json = decodeURIComponent(escape(atob(b64)))
  }
  return JSON.parse(json) as T
}

/**
 * Tạo Redis-backed cache với cùng interface như memory cache.
 *
 * Behavior khác memory cache:
 *   - Persistent across instances (shared state)
 *   - Network latency (10-50ms typical to Upstash regional endpoint)
 *   - Stateful TTL ở server side (không phụ thuộc Node process)
 *
 * Inflight dedup vẫn per-instance (Map trong RAM) — đủ tốt cho 99% case.
 * Cross-instance dedup cần Redis lock — để Phase 3.
 */
export function createRedisCache(config: UpstashConfig): Cache {
  const inflight = new Map<string, Promise<unknown>>()
  const prefix   = config.keyPrefix ? `${config.keyPrefix}:` : ''

  function fullKey(key: string): string {
    return `${prefix}${key}`
  }

  const cache: Cache = {
    async get<T>(key: string) {
      try {
        const result = await upstashFetch<string | null>(
          config,
          'GET',
          `/get/${encodeURIComponent(fullKey(key))}`,
        )
        if (result == null) return null
        return decodeValue<T>(result)
      } catch (err) {
        console.warn(`[RedisCache] GET ${key} failed:`, (err as Error).message)
        return null
      }
    },

    async set<T>(key: string, value: T, ttlSeconds: number) {
      try {
        const encoded = encodeValue(value)
        // Path: /set/{key}/{value}/ex/{ttl}  → SET key value EX ttl
        const path = ttlSeconds > 0
          ? `/set/${encodeURIComponent(fullKey(key))}/${encoded}/ex/${ttlSeconds}`
          : `/set/${encodeURIComponent(fullKey(key))}/${encoded}`
        await upstashFetch<string>(config, 'POST', path)
      } catch (err) {
        // Set fail KHÔNG nên throw — caller đã có value, chỉ là không cache được.
        console.warn(`[RedisCache] SET ${key} failed:`, (err as Error).message)
      }
    },

    async del(key) {
      inflight.delete(key)
      try {
        await upstashFetch<number>(config, 'POST', `/del/${encodeURIComponent(fullKey(key))}`)
      } catch (err) {
        console.warn(`[RedisCache] DEL ${key} failed:`, (err as Error).message)
      }
    },

    async flush(pattern) {
      // Upstash REST không support SCAN ergonomic — pattern flush expensive.
      // Phase 2: clear inflight only. Pattern delete cần FLUSHDB hoặc SCAN+DEL.
      if (!pattern) {
        inflight.clear()
        try {
          await upstashFetch<string>(config, 'POST', '/flushdb')
        } catch (err) {
          console.warn(`[RedisCache] FLUSHDB failed:`, (err as Error).message)
        }
        return
      }
      // Pattern: dùng SCAN + DEL (multi-round). Skip ở Phase 2 để giữ simple.
      console.warn(`[RedisCache] flush(pattern="${pattern}") not implemented — clearing inflight only`)
      const re = new RegExp(
        '^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$',
      )
      for (const key of inflight.keys()) if (re.test(key)) inflight.delete(key)
    },

    async has(key) {
      try {
        const result = await upstashFetch<number>(
          config,
          'GET',
          `/exists/${encodeURIComponent(fullKey(key))}`,
        )
        return result === 1
      } catch {
        return false
      }
    },

    async getOrCompute<T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T> {
      const cached = await cache.get<T>(key)
      if (cached !== null) return cached

      // ── Layer 1: Per-instance inflight dedup ────────────────────────────────
      // N concurrent ON THIS instance chỉ gọi compute 1 lần (Map trong RAM).
      const existing = inflight.get(key)
      if (existing) return existing as Promise<T>

      const promise = computeWithDistributedLock(key, ttlSeconds, compute)
      inflight.set(key, promise)
      promise.finally(() => inflight.delete(key))
      return promise
    },
  }

  // ── Layer 2: Cross-instance distributed lock (Phase 3a) ─────────────────────
  // 10 instances cùng miss key → chỉ 1 instance compute, 9 còn lại đợi rồi
  // đọc cache. Implement bằng SETNX (atomic set-if-not-exists) trên Redis.
  //
  // Flow:
  //   1. Try acquire lock: SET lock:{key} 1 NX EX 10  → atomic
  //   2. Nếu thành công → compute → set cache → release lock
  //   3. Nếu fail (instance khác giữ lock) → poll cache cho đến khi có giá trị
  //      hoặc timeout → nếu timeout vẫn miss, tự compute (failsafe).
  async function computeWithDistributedLock<T>(
    key: string,
    ttlSeconds: number,
    compute: () => Promise<T>,
  ): Promise<T> {
    const lockKey = `lock:${key}`
    const lockTtl = 10 // seconds — lock tự expire để tránh deadlock nếu instance crash

    const acquired = await tryAcquireLock(lockKey, lockTtl)

    if (acquired) {
      // Người giữ lock → compute
      try {
        const value = await compute()
        await cache.set(key, value, ttlSeconds)
        return value
      } finally {
        await releaseLock(lockKey)
      }
    }

    // Không giữ lock → poll cache đợi instance khác xong
    const value = await pollForCache<T>(key, lockTtl * 1000)
    if (value !== null) return value

    // Timeout → instance giữ lock chắc đã crash → tự compute (failsafe)
    console.warn(`[RedisCache] Lock timeout for "${key}" — falling back to local compute`)
    const fallback = await compute()
    await cache.set(key, fallback, ttlSeconds)
    return fallback
  }

  /**
   * Atomic SET key value NX EX ttl — chỉ set nếu key chưa tồn tại.
   * Upstash REST: /set/{key}/{value}/nx/ex/{ttl}
   * Trả true nếu acquire được, false nếu key đã exists.
   */
  async function tryAcquireLock(lockKey: string, ttlSeconds: number): Promise<boolean> {
    try {
      const lockValue = `${Date.now()}:${Math.random().toString(36).slice(2, 10)}`
      const result = await upstashFetch<string | null>(
        config,
        'POST',
        `/set/${encodeURIComponent(fullKey(lockKey))}/${encodeURIComponent(lockValue)}/nx/ex/${ttlSeconds}`,
      )
      // SET với NX trả "OK" nếu acquire được, null nếu đã tồn tại
      return result === 'OK'
    } catch (err) {
      // Lock fail → coi như không acquire được (sẽ poll)
      console.warn(`[RedisCache] Lock acquire failed:`, (err as Error).message)
      return false
    }
  }

  async function releaseLock(lockKey: string): Promise<void> {
    try {
      await upstashFetch<number>(config, 'POST', `/del/${encodeURIComponent(fullKey(lockKey))}`)
    } catch {
      // Lock sẽ tự expire qua TTL — ignore release error
    }
  }

  /**
   * Poll cache với exponential backoff. Trả value khi có, null nếu timeout.
   * Dùng để wait cho instance khác (đang giữ lock) compute xong.
   */
  async function pollForCache<T>(key: string, maxWaitMs: number): Promise<T | null> {
    const start = Date.now()
    let delay = 50  // ms, double mỗi lần đến max 500ms
    while (Date.now() - start < maxWaitMs) {
      await new Promise(r => setTimeout(r, delay))
      const value = await cache.get<T>(key)
      if (value !== null) return value
      delay = Math.min(delay * 2, 500)
    }
    return null
  }

  return cache
}
