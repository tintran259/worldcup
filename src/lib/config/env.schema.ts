/**
 * Zod v4 environment variable schemas.
 *
 * Two schemas:
 *   serverEnvSchema — all vars; only evaluated on the server
 *   clientEnvSchema — only NEXT_PUBLIC_* vars; safe to evaluate anywhere
 *
 * Zod coerces all values from string (as they arrive from process.env).
 */

import { z } from 'zod'

// ── Constants ──────────────────────────────────────────────────────────────────

export const PROVIDER_NAMES = ['api-football', 'sportmonks', 'sportradar'] as const
export const COMPETITION_KEYS = [
  'wc2026',
  'wc2022',
  'euro2024',
  'copa-america-2024',
  'ucl',
  'premier-league',
  'la-liga',
] as const
export const ENVIRONMENTS = ['development', 'test', 'staging', 'production'] as const

// ── Helper: boolean env var ────────────────────────────────────────────────────
// "false" and "0" are false; everything else (including "true", "1", "yes") is true.

function boolFlag(defaultVal: boolean) {
  return z.string()
    .default(defaultVal ? 'true' : 'false')
    .transform(v => v !== 'false' && v !== '0')
}

// ── Helper: positive integer with default ──────────────────────────────────────

function posInt(def: number) {
  return z.coerce.number().int().positive().default(def)
}

// ── Server-only schema ─────────────────────────────────────────────────────────
// Never import this on the client (no NEXT_PUBLIC_ prefix vars here).

export const serverEnvSchema = z.object({
  // ── App ────────────────────────────────────────────────────────────────────
  NODE_ENV: z.enum(ENVIRONMENTS).default('development'),

  // ── Competition ────────────────────────────────────────────────────────────
  FOOTBALL_COMPETITION: z.enum(COMPETITION_KEYS).default('wc2026'),

  // ── Provider chain ─────────────────────────────────────────────────────────
  FOOTBALL_PROVIDER: z.enum(PROVIDER_NAMES).default('api-football'),
  FOOTBALL_FALLBACK: z.string().default(''),

  // ── API-Football credentials ───────────────────────────────────────────────
  API_FOOTBALL_KEY: z.string().optional(),
  API_FOOTBALL_HOST: z.string().default('v3.football.api-sports.io'),
  API_FOOTBALL_RATE_LIMIT_MINUTE: posInt(30),
  API_FOOTBALL_RATE_LIMIT_DAY: posInt(100),

  // ── SportMonks credentials ─────────────────────────────────────────────────
  SPORTMONKS_TOKEN: z.string().optional(),
  SPORTMONKS_RATE_LIMIT_MINUTE: posInt(100),
  SPORTMONKS_RATE_LIMIT_DAY: posInt(3_000),

  // ── Sportradar credentials ─────────────────────────────────────────────────
  SPORTRADAR_KEY: z.string().optional(),
  SPORTRADAR_ACCESS_LEVEL: z.enum(['trial', 'production']).default('trial'),
  SPORTRADAR_RATE_LIMIT_MINUTE: posInt(1),
  SPORTRADAR_RATE_LIMIT_DAY: posInt(1_000),

  // ── Cache ──────────────────────────────────────────────────────────────────
  CACHE_LIVE_MATCH_TTL: posInt(15),
  CACHE_MATCH_DETAIL_TTL: posInt(60),
  CACHE_FIXTURES_TTL: posInt(300),
  CACHE_STANDINGS_TTL: posInt(300),
  CACHE_TEAM_TTL: posInt(3_600),
  CACHE_MAX_ENTRIES: posInt(1_024),

  // ── Redis (Upstash) — Phase 2: shared cache cho multi-instance ─────────────
  // Nếu cả 2 var được set → dùng RedisCache. Nếu không → fallback MemoryCache.
  // Lấy ở: https://console.upstash.com/redis → Create Database → REST API tab.
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  /** Prefix để namespace key (tránh đụng app khác cùng Redis instance) */
  REDIS_KEY_PREFIX: z.string().default('wc'),
  /** Timeout cho mỗi Redis request — fallback nhanh nếu Redis slow */
  REDIS_TIMEOUT_MS: posInt(2_000),

  // ── Feature flags ──────────────────────────────────────────────────────────
  FEATURE_LIVE_UPDATES: boolFlag(true),
  FEATURE_REALTIME_SIM: boolFlag(true),
  FEATURE_STANDINGS: boolFlag(true),
  FEATURE_STATS: boolFlag(true),

  // ── BFF API ────────────────────────────────────────────────────────────────
  API_RATE_LIMIT_PER_MINUTE: posInt(60),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
})

// ── Client-safe schema ─────────────────────────────────────────────────────────
// NEXT_PUBLIC_* vars are baked into the browser bundle at build time.

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(ENVIRONMENTS).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Football Platform'),
  NEXT_PUBLIC_COMPETITION: z.enum(COMPETITION_KEYS).default('wc2026'),
})

// ── Inferred types ─────────────────────────────────────────────────────────────

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
