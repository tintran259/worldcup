/**
 * Config loader
 *
 * Parses process.env through the Zod schema, validates cross-field rules
 * (e.g. the primary provider must have credentials), and assembles the
 * typed AppConfig object.
 *
 * Fail-fast: throws with a formatted multi-line error if anything is wrong
 * so misconfigured deployments never silently serve stale or wrong data.
 */

import { serverEnvSchema } from './env.schema'
import { getCompetitionByKey } from './competitions'
import type {
  AppConfig,
  CompetitionKey,
  ProviderName,
  ProviderConfig,
  ProvidersConfig,
  SportradarAccessLevel,
} from './types'

// ── Loader ────────────────────────────────────────────────────────────────────

export function loadConfig(): AppConfig {
  // ── 1. Parse env vars through Zod ─────────────────────────────────────────

  const result = serverEnvSchema.safeParse(process.env)

  if (!result.success) {
    const lines = result.error.issues.map(
      e => `  • ${(e.path as string[]).join('.') || '(root)'}: ${e.message}`,
    )
    throw new Error(
      `[Config] Invalid environment — fix the following variables in .env.local:\n` +
      lines.join('\n'),
    )
  }

  const env = result.data

  // ── 2. Resolve competition ─────────────────────────────────────────────────

  const competition = getCompetitionByKey(env.FOOTBALL_COMPETITION as CompetitionKey)

  // ── 3. Build provider chain ────────────────────────────────────────────────

  const primaryName = env.FOOTBALL_PROVIDER as ProviderName
  const fallbackNames = parseFallbackList(env.FOOTBALL_FALLBACK)
  const chain: ProviderName[] = dedup([primaryName, ...fallbackNames])

  // ── 4. Build per-provider configs ─────────────────────────────────────────

  const allProviders: Partial<Record<ProviderName, ProviderConfig>> = {}

  // API-Football — only included if key is set
  if (env.API_FOOTBALL_KEY) {
    allProviders['api-football'] = {
      name: 'api-football',
      credentials: {
        apiKey: env.API_FOOTBALL_KEY,
        host: env.API_FOOTBALL_HOST,
      },
      rateLimit: {
        requestsPerMinute: env.API_FOOTBALL_RATE_LIMIT_MINUTE,
        requestsPerDay: env.API_FOOTBALL_RATE_LIMIT_DAY,
      },
    }
  }

  // SportMonks — only included if token is set
  if (env.SPORTMONKS_TOKEN) {
    allProviders['sportmonks'] = {
      name: 'sportmonks',
      credentials: { token: env.SPORTMONKS_TOKEN },
      rateLimit: {
        requestsPerMinute: env.SPORTMONKS_RATE_LIMIT_MINUTE,
        requestsPerDay: env.SPORTMONKS_RATE_LIMIT_DAY,
      },
    }
  }

  // Sportradar — only included if key is set
  if (env.SPORTRADAR_KEY) {
    allProviders['sportradar'] = {
      name: 'sportradar',
      credentials: {
        apiKey: env.SPORTRADAR_KEY,
        accessLevel: env.SPORTRADAR_ACCESS_LEVEL as SportradarAccessLevel,
      },
      rateLimit: {
        requestsPerMinute: env.SPORTRADAR_RATE_LIMIT_MINUTE,
        requestsPerDay: env.SPORTRADAR_RATE_LIMIT_DAY,
      },
    }
  }

  // ── 5. Cross-field validation ──────────────────────────────────────────────

  validateProviderChain(chain, allProviders)

  // ── 6. Assemble final config ───────────────────────────────────────────────

  const providers: ProvidersConfig = { chain, all: allProviders }

  return {
    env: env.NODE_ENV,
    competition,
    providers,
    cache: {
      liveMatchTtlSec: env.CACHE_LIVE_MATCH_TTL,
      matchDetailTtlSec: env.CACHE_MATCH_DETAIL_TTL,
      fixturesTtlSec: env.CACHE_FIXTURES_TTL,
      standingsTtlSec: env.CACHE_STANDINGS_TTL,
      teamTtlSec: env.CACHE_TEAM_TTL,
      maxEntries: env.CACHE_MAX_ENTRIES,
      // Redis chỉ enable khi cả url+token được set (avoid partial config)
      redis: env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
        ? {
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
          keyPrefix: env.REDIS_KEY_PREFIX,
          timeoutMs: env.REDIS_TIMEOUT_MS,
        }
        : undefined,
    },
    features: {
      liveUpdates: env.FEATURE_LIVE_UPDATES,
      realtimeSim: env.FEATURE_REALTIME_SIM,
      standings: env.FEATURE_STANDINGS,
      stats: env.FEATURE_STATS,
    },
    api: {
      rateLimitPerMinute: env.API_RATE_LIMIT_PER_MINUTE,
      corsOrigins: env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean),
    },
  }
}

// ── Private helpers ────────────────────────────────────────────────────────────

function parseFallbackList(raw: string): ProviderName[] {
  return raw
    .split(',')
    .map(s => s.trim())
    .filter((s): s is ProviderName => ['api-football', 'sportmonks', 'sportradar'].includes(s))
}

function dedup<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * Cross-field validation: every provider in the chain must have credentials
 * configured.  Providers with no credentials are silently excluded from the
 * chain so fallback config is forgiving, but the primary provider must have
 * credentials or startup fails immediately.
 */
function validateProviderChain(
  chain: ProviderName[],
  all: Partial<Record<ProviderName, ProviderConfig>>,
): void {
  const unconfigured = chain.filter(name => !all[name])

  if (unconfigured.length === 0) return

  const isDev = process.env.NODE_ENV !== 'production'
  const [primary, ...rest] = chain

  if (!all[primary]) {
    const keyVar = credentialsEnvVar(primary)
    const message =
      `Primary provider "${primary}" has no credentials. ` +
      `Set ${keyVar} in .env.local.`

    if (isDev) {
      // Dev: warn → BFF routes sẽ tự fallback về mock data
      console.warn(
        `[Config] ${message} ` +
        `→ Dev mode: sẽ dùng mock data thay thế.`,
      )
    } else {
      // Production: hard fail để không silently serve mock
      throw new Error(`[Config] ${message}`)
    }
  }

  // Fallbacks không có credentials: warn, không throw
  rest.filter(n => !all[n]).forEach(name => {
    console.warn(
      `[Config] Fallback provider "${name}" has no credentials and will be skipped. ` +
      `Set ${credentialsEnvVar(name)} if you want to use it.`,
    )
  })
}

function credentialsEnvVar(provider: ProviderName): string {
  const map: Record<ProviderName, string> = {
    'api-football': 'API_FOOTBALL_KEY',
    'sportmonks': 'SPORTMONKS_TOKEN',
    'sportradar': 'SPORTRADAR_KEY',
  }
  return map[provider]
}
