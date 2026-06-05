/**
 * Config type definitions.
 *
 * Everything in AppConfig is derived from environment variables.
 * No raw process.env values survive outside the config loader —
 * the rest of the application only ever sees these typed shapes.
 */

// ── Primitive enumerations ─────────────────────────────────────────────────────

export type ProviderName =
  | 'api-football'
  | 'sportmonks'
  | 'sportradar'

export type CompetitionKey =
  | 'wc2026'
  | 'wc2022'
  | 'euro2024'
  | 'copa-america-2024'
  | 'ucl'
  | 'premier-league'
  | 'la-liga'

export type CompetitionType = 'cup' | 'league'

export type Environment = 'development' | 'test' | 'staging' | 'production'

export type SportradarAccessLevel = 'trial' | 'production'

// ── Provider-specific identifier bags ─────────────────────────────────────────
// These are passed directly to IFootballProvider method parameters.

export interface ProviderCompetitionIds {
  // API-Football uses leagueId + season
  leagueId?: string
  season?: string
  // SportMonks uses stageId + seasonId
  stageId?: string
  seasonId?: string
  // Sportradar uses tournamentId + seasonId
  tournamentId?: string
  // date range for fixture queries
  dateFrom: string   // ISO date "YYYY-MM-DD"
  dateTo: string
}

// ── Competition ────────────────────────────────────────────────────────────────

export interface CompetitionConfig {
  key:           CompetitionKey
  name:          string                                       // display name
  shortName:     string
  type:          CompetitionType
  hasGroupStage: boolean
  /** IDs keyed by provider name — only known providers are listed */
  providerIds:   Partial<Record<ProviderName, ProviderCompetitionIds>>
}

// ── Provider ───────────────────────────────────────────────────────────────────

export interface ApiFootballCredentials {
  apiKey: string
  host:   string
}

export interface SportMonksCredentials {
  token: string
}

export interface SportradarCredentials {
  apiKey:      string
  accessLevel: SportradarAccessLevel
}

export interface ProviderConfig {
  name:        ProviderName
  credentials: ApiFootballCredentials | SportMonksCredentials | SportradarCredentials
}

export interface ProvidersConfig {
  /** Ordered list: primary first, then fallbacks */
  chain: ProviderName[]
  /** Per-provider settings indexed by name */
  all:   Partial<Record<ProviderName, ProviderConfig>>
}

// ── Cache ──────────────────────────────────────────────────────────────────────

export interface CacheConfig {
  /** MemoryCache LRU max entries (số entry tối đa trong RAM) */
  maxEntries: number
  /** Upstash/Vercel KV REST config — nếu set thì dùng Redis thay memory */
  redis?: {
    url:       string
    token:     string
    keyPrefix: string
    timeoutMs: number
  }
}

// ── Client-safe config (subset exposed to the browser) ────────────────────────

export interface ClientConfig {
  appEnv:      Environment
  appName:     string
  competition: Pick<CompetitionConfig, 'key' | 'name' | 'shortName' | 'type' | 'hasGroupStage'>
}

// ── Full AppConfig (server-only) ───────────────────────────────────────────────

export interface AppConfig {
  env:         Environment
  competition: CompetitionConfig
  providers:   ProvidersConfig
  cache:       CacheConfig
}
