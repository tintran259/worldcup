/**
 * Runtime Config Service
 *
 * Singleton wrapper around loadConfig().
 * First call validates all env vars and caches the result.
 * Subsequent calls return the cached config — O(1), no re-parsing.
 *
 * SERVER ONLY — never import this in client components.
 * For client components, import getClientConfig() from './index'.
 *
 * Usage:
 *   import { getConfig, getCompetitionIds, isEnabled } from '@/lib/config'
 */

import { loadConfig } from './loader'
import { clientEnvSchema } from './env.schema'
import type {
  AppConfig,
  CacheConfig,
  CompetitionConfig,
  FeatureFlags,
  ProviderCompetitionIds,
  ProviderConfig,
  ProviderName,
  ClientConfig,
} from './types'

// ── Singleton ─────────────────────────────────────────────────────────────────

let _config: AppConfig | null = null

/**
 * Returns the validated AppConfig, loading it on first call.
 * Throws on first call if env vars are invalid (fail-fast).
 */
export function getConfig(): AppConfig {
  if (!_config) {
    _config = loadConfig()
  }
  return _config
}

/** Force config re-evaluation — use ONLY in tests. */
export function resetConfig(): void {
  _config = null
}

// ── Shortcut helpers ──────────────────────────────────────────────────────────

/** Current active competition configuration */
export function getCompetition(): CompetitionConfig {
  return getConfig().competition
}

/**
 * Provider-specific tournament identifiers for the active competition.
 * Use these in repository calls instead of hardcoded IDs.
 *
 * @returns IDs bag for the provider, or null if the competition
 *          doesn't have IDs configured for that provider.
 */
export function getProviderIds(
  providerName: ProviderName,
): ProviderCompetitionIds | null {
  const ids = getConfig().competition.providerIds[providerName]
  return ids ?? null
}

/**
 * Ordered provider chain: primary first, then fallbacks.
 * Only includes providers that have credentials.
 */
export function getProviderChain(): ProviderName[] {
  return getConfig().providers.chain
}

/**
 * Config for a specific provider. Returns null if the provider
 * is not configured (no credentials).
 */
export function getProviderConfig(name: ProviderName): ProviderConfig | null {
  return getConfig().providers.all[name] ?? null
}

/** Cache TTL configuration object */
export function getCacheConfig(): CacheConfig {
  return getConfig().cache
}

/** Check whether a feature flag is enabled */
export function isEnabled(flag: keyof FeatureFlags): boolean {
  return getConfig().features[flag]
}

// ── Client-safe config ────────────────────────────────────────────────────────

/**
 * Returns a safe subset of config for use in React client components.
 * Does NOT call getConfig() — it reads only NEXT_PUBLIC_* vars which are
 * available in the browser.
 *
 * Can be called on both server and client.
 */
export function getClientConfig(): ClientConfig {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_COMPETITION: process.env.NEXT_PUBLIC_COMPETITION,
  })

  if (!result.success) {
    // Client env vars have safe defaults — never hard-fail
    console.warn('[Config] Client env parse warnings:', result.error.message)
  }

  const env = result.success ? result.data : {
    NEXT_PUBLIC_APP_ENV: 'development' as const,
    NEXT_PUBLIC_APP_NAME: 'Football Platform',
    NEXT_PUBLIC_COMPETITION: 'wc2026' as const,
  }

  // Import competition metadata for the display fields
  const { COMPETITIONS } = require('./competitions') as typeof import('./competitions')
  const comp = COMPETITIONS[env.NEXT_PUBLIC_COMPETITION]

  return {
    appEnv: env.NEXT_PUBLIC_APP_ENV,
    appName: env.NEXT_PUBLIC_APP_NAME,
    competition: {
      key: comp.key,
      name: comp.name,
      shortName: comp.shortName,
      type: comp.type,
      hasGroupStage: comp.hasGroupStage,
    },
    features: {
      // Feature flags aren't NEXT_PUBLIC, so they default to enabled on client
      liveUpdates: true,
      realtimeSim: true,
      standings: true,
      stats: true,
    },
  }
}
