/**
 * DI Container — server-side singleton
 *
 * Wires providers → adapters → repositories → API routes.
 * Only created on the server (Next.js Route Handlers).
 * Client components never import this file.
 *
 * Dependency graph:
 *
 *   ProviderFactory.createChain()
 *         │
 *         ▼
 *   ProviderBundle[]  (provider + adapter pairs, in fallback order)
 *         │
 *         ├──▶  MatchRepository      (+ ICache)
 *         ├──▶  TeamRepository       (+ ICache)
 *         └──▶  StandingsRepository  (+ ICache)
 *
 * Environment:
 *   FOOTBALL_PROVIDER  = primary provider name
 *   FOOTBALL_FALLBACK  = comma-separated fallback names
 *   API_FOOTBALL_KEY   = key for api-football
 *   SPORTMONKS_TOKEN   = token for sportmonks
 *   SPORTRADAR_KEY     = key for sportradar
 */

import { ProviderFactory }     from '../providers/factory'
import { MemoryCache }         from '../cache/MemoryCache'
import { getConfig }           from '../config'
import { MatchRepository }     from '../repositories/MatchRepository'
import { TeamRepository }      from '../repositories/TeamRepository'
import { StandingsRepository } from '../repositories/StandingsRepository'
import type { IMatchRepository }     from '../repositories/interfaces'
import type { ITeamRepository }      from '../repositories/interfaces'
import type { IStandingsRepository } from '../repositories/interfaces'
import type { ICache }               from '../cache/ICache'

// ── Container ──────────────────────────────────────────────────────────────────

class Container {
  private static _instance: Container | null = null

  readonly matchRepository:     IMatchRepository
  readonly teamRepository:      ITeamRepository
  readonly standingsRepository: IStandingsRepository
  readonly cache:               ICache

  private constructor() {
    const bundles = ProviderFactory.createChain()

    if (bundles.length === 0) {
      // Fallback to mock data when no provider credentials are configured.
      // This keeps the dev server runnable without API keys.
      console.warn(
        '[Container] No provider bundles configured. ' +
        'Set FOOTBALL_PROVIDER + provider API key env vars for live data.',
      )
    }

    this.cache = new MemoryCache(getConfig().cache.maxEntries)

    this.matchRepository     = new MatchRepository(bundles, this.cache)
    this.teamRepository      = new TeamRepository(bundles, this.cache)
    this.standingsRepository = new StandingsRepository(bundles, this.cache)
  }

  static getInstance(): Container {
    // In Next.js App Router, each module is instantiated once per worker.
    // This singleton is safe under normal serverless execution.
    if (!Container._instance) {
      Container._instance = new Container()
    }
    return Container._instance
  }

  /** Force re-creation (useful in tests to inject different providers) */
  static reset(): void {
    Container._instance = null
  }
}

// ── Public exports ─────────────────────────────────────────────────────────────

export function getContainer(): Container {
  return Container.getInstance()
}

// Convenience shortcuts for Route Handlers
export const getMatchRepository     = (): IMatchRepository     => getContainer().matchRepository
export const getTeamRepository      = (): ITeamRepository      => getContainer().teamRepository
export const getStandingsRepository = (): IStandingsRepository => getContainer().standingsRepository
