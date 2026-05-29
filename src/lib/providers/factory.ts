/**
 * ProviderFactory
 *
 * Resolves (client, adapter) bundles from the typed AppConfig.
 * No raw process.env access — credentials come exclusively from the
 * config service so validation runs before any bundle is created.
 *
 * Usage:
 *   const bundles = ProviderFactory.createChain()
 */

import { getConfig, getProviderChain } from '@/lib/config'
import { ApiFootballClient }  from './api-football/ApiFootballClient'
import { ApiFootballAdapter } from './api-football/ApiFootballAdapter'
import { SportMonksClient }   from './sportmonks/SportMonksClient'
import { SportMonksAdapter }  from './sportmonks/SportMonksAdapter'
import { SportradarClient }   from './sportradar/SportradarClient'
import { SportradarAdapter }  from './sportradar/SportradarAdapter'
import { ProviderError }      from './interfaces'
import type { ProviderBundle, ProviderName } from './interfaces'
import type { ApiFootballCredentials, SportMonksCredentials, SportradarCredentials } from '@/lib/config'

// ── Factory ────────────────────────────────────────────────────────────────────

export class ProviderFactory {
  /**
   * Create a single (client + adapter) bundle for the named provider.
   * Reads credentials from the validated config — throws if missing.
   */
  static create(name: ProviderName): ProviderBundle {
    const cfg   = getConfig()
    const pcfg  = cfg.providers.all[name]

    if (!pcfg) {
      throw new ProviderError(name, `No credentials configured. Check ${credentialVar(name)} in .env.local`)
    }

    switch (name) {
      case 'api-football': {
        const creds = pcfg.credentials as ApiFootballCredentials
        return {
          provider: new ApiFootballClient(creds.apiKey),
          adapter:  new ApiFootballAdapter(),
        }
      }

      case 'sportmonks': {
        const creds = pcfg.credentials as SportMonksCredentials
        return {
          provider: new SportMonksClient(creds.token),
          adapter:  new SportMonksAdapter(),
        }
      }

      case 'sportradar': {
        const creds = pcfg.credentials as SportradarCredentials
        return {
          provider: new SportradarClient(creds.apiKey),
          adapter:  new SportradarAdapter(),
        }
      }

      default:
        throw new Error(`Unknown provider: ${String(name)}`)
    }
  }

  /**
   * Build the ordered bundle chain from config.
   * The chain is: [primary, ...fallbacks] with credentials-less entries skipped.
   */
  static createChain(): ProviderBundle[] {
    const chain = getProviderChain()

    return chain.flatMap(name => {
      try {
        return [ProviderFactory.create(name)]
      } catch (err) {
        console.warn(`[ProviderFactory] Skipping "${name}": ${(err as Error).message}`)
        return []
      }
    })
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function credentialVar(name: ProviderName): string {
  const map: Record<ProviderName, string> = {
    'api-football': 'API_FOOTBALL_KEY',
    'sportmonks':   'SPORTMONKS_TOKEN',
    'sportradar':   'SPORTRADAR_KEY',
  }
  return map[name]
}
