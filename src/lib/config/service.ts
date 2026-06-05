/**
 * Runtime Config Service
 *
 * Singleton wrapper around loadConfig().
 * First call validates all env vars and caches the result.
 * Subsequent calls return the cached config — O(1), no re-parsing.
 *
 * SERVER ONLY — never import this in client components.
 * For client components, import getClientConfig() from './index'.
 */

import { loadConfig } from './loader'
import { clientEnvSchema } from './env.schema'
import type { AppConfig, CompetitionConfig, ProviderName, ClientConfig } from './types'

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

// ── Shortcut helpers ──────────────────────────────────────────────────────────

/** Current active competition configuration */
export function getCompetition(): CompetitionConfig {
  return getConfig().competition
}

/**
 * Ordered provider chain: primary first, then fallbacks.
 * Only includes providers that have credentials.
 */
export function getProviderChain(): ProviderName[] {
  return getConfig().providers.chain
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
    appEnv:  env.NEXT_PUBLIC_APP_ENV,
    appName: env.NEXT_PUBLIC_APP_NAME,
    competition: {
      key:           comp.key,
      name:          comp.name,
      shortName:     comp.shortName,
      type:          comp.type,
      hasGroupStage: comp.hasGroupStage,
    },
  }
}
