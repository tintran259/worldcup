/**
 * Zod v4 environment variable schemas.
 *
 * Two schemas:
 *   serverEnvSchema — all vars; only evaluated on the server
 *   clientEnvSchema — only NEXT_PUBLIC_* vars; safe to evaluate anywhere
 *
 * Zod coerces all values from string (as they arrive from process.env).
 *
 * Triết lý: chỉ giữ vars thực sự được consume downstream. Nếu thêm var mới
 * nhưng chưa wire vào code path, KHÔNG đưa vào schema để tránh dead state.
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
  API_FOOTBALL_KEY:  z.string().optional(),
  API_FOOTBALL_HOST: z.string().default('v3.football.api-sports.io'),

  // ── SportMonks credentials ─────────────────────────────────────────────────
  SPORTMONKS_TOKEN: z.string().optional(),

  // ── Sportradar credentials ─────────────────────────────────────────────────
  SPORTRADAR_KEY:          z.string().optional(),
  SPORTRADAR_ACCESS_LEVEL: z.enum(['trial', 'production']).default('trial'),

  // ── Cache ──────────────────────────────────────────────────────────────────
  // TTL constants được hardcode ở lib/cache/index.ts (TTL.* presets) — không
  // cần env vars riêng. Chỉ MAX_ENTRIES dùng tham số cho MemoryCache.
  CACHE_MAX_ENTRIES: posInt(1_024),

  // ── Redis (Upstash) — shared cache cho multi-instance ─────────────────────
  // Nếu cả 2 set → dùng RedisCache. Không có → fallback MemoryCache.
  // Nếu dùng Vercel KV: copy KV_REST_API_URL/TOKEN → UPSTASH_REDIS_REST_URL/TOKEN.
  UPSTASH_REDIS_REST_URL:   z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  /** Prefix để namespace key (tránh đụng app khác cùng Redis instance) */
  REDIS_KEY_PREFIX:         z.string().default('wc'),
  /** Timeout cho mỗi Redis request — fallback nhanh nếu Redis slow */
  REDIS_TIMEOUT_MS:         posInt(2_000),
})

// ── Client-safe schema ─────────────────────────────────────────────────────────
// NEXT_PUBLIC_* vars are baked into the browser bundle at build time.

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV:     z.enum(ENVIRONMENTS).default('development'),
  NEXT_PUBLIC_APP_NAME:    z.string().default('Football Platform'),
  NEXT_PUBLIC_COMPETITION: z.enum(COMPETITION_KEYS).default('wc2026'),
})

// ── Inferred types ─────────────────────────────────────────────────────────────

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
