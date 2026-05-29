/**
 * Provider Abstraction Layer
 *
 * The UI and repositories NEVER import provider-specific types.
 * Every external provider response is mapped through an IProviderAdapter
 * before reaching the rest of the application.
 *
 * Data flow:
 *   External API  →  IFootballProvider  →  IProviderAdapter  →  Domain types
 */

import type {
  Match,
  MatchEvent,
  Team,
} from '@/types/domain.types'
import type {
  ExtendedTeam,
  GroupRow,
  StarPlayer,
} from '@/lib/mock/types'

// ── Provider names ─────────────────────────────────────────────────────────────

export type ProviderName = 'api-football' | 'sportmonks' | 'sportradar'

// ── Request parameter shapes ───────────────────────────────────────────────────
// Tournament IDs per provider live in @/lib/config/competitions.ts.
// Repositories access them via getProviderIds(providerName) from the config service.

export interface LiveMatchParams {
  leagueId?: string
  stageId?: string
  tournamentId?: string
  season?: string
  seasonId?: string
}

export interface FixtureParams extends LiveMatchParams {
  from: string   // ISO date string
  to:   string
}

// ── Error types ────────────────────────────────────────────────────────────────

export class ProviderError extends Error {
  constructor(
    public readonly provider: ProviderName,
    message: string,
    public readonly status?: number,
    public readonly cause?: unknown,
  ) {
    super(`[${provider}] ${message}`)
    this.name = 'ProviderError'
  }
}

export class ProviderRateLimitError extends ProviderError {
  constructor(provider: ProviderName, public readonly retryAfterMs: number) {
    super(provider, `Rate limited — retry after ${retryAfterMs}ms`)
    this.name = 'ProviderRateLimitError'
  }
}

export class CircuitOpenError extends Error {
  constructor(public readonly provider: ProviderName) {
    super(`Circuit breaker OPEN for provider: ${provider}`)
    this.name = 'CircuitOpenError'
  }
}

export class RepositoryError extends Error {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(`[Repository:${operation}] ${message}`)
    this.name = 'RepositoryError'
  }
}

// ── IFootballProvider ─────────────────────────────────────────────────────────
// One implementation per data provider. Returns raw (untyped) responses.
// Implementations must NOT be used outside the providers/ folder.

export interface IFootballProvider {
  readonly name: ProviderName

  /** Live matches for the current tournament */
  getLiveMatches(params: LiveMatchParams): Promise<unknown[]>

  /** All fixtures for the tournament in a date range */
  getFixtures(params: FixtureParams): Promise<unknown[]>

  /** Single match by provider-internal ID */
  getMatchById(externalId: string): Promise<unknown>

  /** Match event timeline (goals, cards, subs) */
  getMatchEvents(externalId: string): Promise<unknown[]>

  /** Team profile by provider-internal ID */
  getTeamById(externalId: string): Promise<unknown>

  /** All participating teams in the tournament */
  getTeamsByTournament(params: LiveMatchParams): Promise<unknown[]>

  /** Group stage standings table */
  getGroupStandings(params: LiveMatchParams): Promise<unknown[]>

  /** Squad players for a team */
  getSquad(teamExternalId: string): Promise<unknown[]>
}

// ── IProviderAdapter ──────────────────────────────────────────────────────────
// Maps a provider's raw unknown response to our canonical domain types.
// Each provider ships one adapter implementing this interface.

export interface IProviderAdapter {
  readonly provider: ProviderName

  toMatch(raw: unknown): Match
  toMatchEvent(raw: unknown): MatchEvent
  toTeam(raw: unknown): Team
  toExtendedTeam(raw: unknown): ExtendedTeam
  toGroupRow(raw: unknown): GroupRow
  toPlayer(raw: unknown): StarPlayer
}

// ── ProviderBundle ────────────────────────────────────────────────────────────
// A paired (client, adapter) tuple. The container wires them together.

export interface ProviderBundle {
  provider: IFootballProvider
  adapter:  IProviderAdapter
}
