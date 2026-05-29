/**
 * Public API of the config module.
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  Server components / Route Handlers                      │
 * │    import { getConfig, getProviderIds, isEnabled }       │
 * │           from '@/lib/config'                            │
 * ├──────────────────────────────────────────────────────────┤
 * │  Client components                                       │
 * │    import { getClientConfig } from '@/lib/config'        │
 * └──────────────────────────────────────────────────────────┘
 */

// ── Runtime service (server + client for getClientConfig) ─────────────────────
export {
  getConfig,
  resetConfig,
  getCompetition,
  getProviderIds,
  getProviderChain,
  getProviderConfig,
  getCacheConfig,
  isEnabled,
  getClientConfig,
} from './service'

// ── Competition registry ───────────────────────────────────────────────────────
export { COMPETITIONS, getCompetitionByKey, ALL_COMPETITION_KEYS } from './competitions'

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  AppConfig,
  ClientConfig,
  CompetitionConfig,
  CompetitionKey,
  CompetitionType,
  Environment,
  FeatureFlags,
  ProviderCompetitionIds,
  ProviderConfig,
  ProviderName,
  CacheConfig,
  ApiConfig,
  ProvidersConfig,
  // Provider credential shapes — used by factory.ts
  ApiFootballCredentials,
  SportMonksCredentials,
  SportradarCredentials,
} from './types'

// ── Schema constants (safe to use in UI validation) ───────────────────────────
export { PROVIDER_NAMES, COMPETITION_KEYS, ENVIRONMENTS } from './env.schema'
