/**
 * server.ts — Entry point cho BFF Route Handlers
 *
 * Thay thế container/container.ts.
 * Dùng lazy singleton đơn giản, không cần class.
 *
 * Cách dùng trong Route Handler:
 *   import { getMatchRepository } from '@/lib/server'
 *   const repo = getMatchRepository()
 */

import { createCache, createRedisCache } from './cache'
import { createProviderChain } from './providers/chain'
import { createMatchRepository } from './repositories/matches'
import { createStandingsRepository } from './repositories/standings'
import { createTeamRepository } from './repositories/teams'
import { createStatsRepository } from './repositories/stats'
import { getConfig } from './config'
import type { Cache } from './cache'
import type { ProviderBundle } from './providers/types'
import type { MatchRepository } from './repositories/matches'
import type { StandingsRepository } from './repositories/standings'
import type { TeamRepository } from './repositories/teams'
import type { StatsRepository } from './repositories/stats'

// ── Lazy singletons (khởi tạo lần đầu khi cần, dùng lại sau đó) ──────────────

let _cache: Cache | null = null
let _bundles: ProviderBundle[] | null = null
let _matches: MatchRepository | null = null
let _standings: StandingsRepository | null = null
let _teams: TeamRepository | null = null
let _stats: StatsRepository | null = null

/**
 * Tạo cache singleton. Pick implementation theo env:
 *   - Cả UPSTASH_REDIS_REST_URL + TOKEN có   → RedisCache (shared across instances)
 *   - Không có                                 → MemoryCache (per-instance)
 *
 * Production multi-instance: PHẢI dùng Redis để share cache.
 * Local dev / single instance: memory ổn.
 */
function getCache(): Cache {
  if (_cache) return _cache

  const cfg = getConfig().cache

  if (cfg.redis) {
    console.log(
      `[server] Using RedisCache (Upstash) — url=${cfg.redis.url.replace(/^https?:\/\//, '').slice(0, 30)}...`,
    )
    _cache = createRedisCache({
      url:       cfg.redis.url,
      token:     cfg.redis.token,
      keyPrefix: cfg.redis.keyPrefix,
      timeoutMs: cfg.redis.timeoutMs,
    })
  } else {
    console.log(`[server] Using MemoryCache (maxEntries=${cfg.maxEntries}) — set UPSTASH_REDIS_REST_URL + TOKEN to enable Redis`)
    _cache = createCache(cfg.maxEntries)
  }

  return _cache
}

function getBundles(): ProviderBundle[] {
  if (_bundles) return _bundles
  _bundles = createProviderChain()

  if (_bundles.length === 0) {
    console.warn(
      '[server] Không có provider nào được cấu hình. ' +
      'Thêm FOOTBALL_PROVIDER + API key vào .env.local để dùng dữ liệu thật.',
    )
  }

  return _bundles
}

// ── Public API (dùng trong app/api/* Route Handlers) ─────────────────────────

export function getMatchRepository(): MatchRepository {
  return (_matches ??= createMatchRepository(getBundles(), getCache()))
}

export function getStandingsRepository(): StandingsRepository {
  return (_standings ??= createStandingsRepository(getBundles(), getCache()))
}

export function getTeamRepository(): TeamRepository {
  return (_teams ??= createTeamRepository(getBundles(), getCache()))
}

export function getStatsRepository(): StatsRepository {
  return (_stats ??= createStatsRepository(getBundles(), getCache()))
}

/** Reset tất cả singletons — dùng trong tests */
export function resetServer(): void {
  _cache = _bundles = _matches = _standings = _teams = _stats = null
}
