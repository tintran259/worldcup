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
  getCompetition,
  getProviderChain,
  getClientConfig,
} from './service'

// ── Competition registry ───────────────────────────────────────────────────────
export { COMPETITIONS, getCompetitionByKey, ALL_COMPETITION_KEYS } from './competitions'

// ── Runtime competition context (SERVER-ONLY) ─────────────────────────────────
// KHÔNG re-export từ đây vì competitionContext dùng node:async_hooks
// (sẽ break client bundle). Server-side import trực tiếp:
//   import { withCompetition, getCurrentCompetition }
//   from '@/lib/config/competitionContext'

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
