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

import { createCache } from './cache'
import { createProviderChain } from './providers/chain'
import { createMatchRepository } from './repositories/matches'
import { createStandingsRepository } from './repositories/standings'
import { createTeamRepository } from './repositories/teams'
import { getConfig } from './config'
import type { Cache } from './cache'
import type { ProviderBundle } from './providers/types'
import type { MatchRepository } from './repositories/matches'
import type { StandingsRepository } from './repositories/standings'
import type { TeamRepository } from './repositories/teams'

// ── Lazy singletons (khởi tạo lần đầu khi cần, dùng lại sau đó) ──────────────

let _cache: Cache | null = null
let _bundles: ProviderBundle[] | null = null
let _matches: MatchRepository | null = null
let _standings: StandingsRepository | null = null
let _teams: TeamRepository | null = null

function getCache(): Cache {
  return (_cache ??= createCache(getConfig().cache.maxEntries))
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

/** Reset tất cả singletons — dùng trong tests */
export function resetServer(): void {
  _cache = _bundles = _matches = _standings = _teams = null
}
