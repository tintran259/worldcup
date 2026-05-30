/**
 * Shared types cho provider layer.
 *
 * UI và repositories KHÔNG import provider-specific types.
 * Mọi response đều đi qua ProviderAdapter trước khi ra ngoài.
 */

import type { Match, MatchEvent, Team } from '@/types/domain.types'
import type { ExtendedTeam, GroupRow, StarPlayer, TopScorer } from '@/lib/mock/types'

// ── Provider names ────────────────────────────────────────────────────────────

export type ProviderName = 'api-football' | 'sportmonks' | 'sportradar'

// ── Request params ────────────────────────────────────────────────────────────

export interface LiveMatchParams {
  leagueId?: string
  stageId?: string
  tournamentId?: string
  season?: string
  seasonId?: string
}

export interface FixtureParams extends LiveMatchParams {
  from: string   // ISO date "YYYY-MM-DD"
  to: string
}

// ── Provider interface ────────────────────────────────────────────────────────
// Mỗi provider (api-football, sportmonks, sportradar) implement interface này.
// Trả về unknown[] vì từng provider có format riêng — Adapter sẽ chuyển đổi.

export interface FootballProvider {
  readonly name: ProviderName
  getLiveMatches(params: LiveMatchParams): Promise<unknown[]>
  getFixtures(params: FixtureParams): Promise<unknown[]>
  getMatchById(externalId: string): Promise<unknown>
  getMatchEvents(externalId: string): Promise<unknown[]>
  getTeamById(externalId: string): Promise<unknown>
  getTeamsByTournament(params: LiveMatchParams): Promise<unknown[]>
  getGroupStandings(params: LiveMatchParams): Promise<unknown[]>
  getSquad(teamExternalId: string): Promise<unknown[]>
  /** Top scorers cho tournament — sắp xếp theo số bàn thắng giảm dần */
  getTopScorers(params: LiveMatchParams): Promise<unknown[]>
}

// ── Adapter interface ─────────────────────────────────────────────────────────
// Chuyển đổi raw response → domain types. 1 adapter cho mỗi provider.

export interface ProviderAdapter {
  readonly provider: ProviderName
  toMatch(raw: unknown): Match
  toMatchEvent(raw: unknown): MatchEvent
  toTeam(raw: unknown): Team
  toExtendedTeam(raw: unknown): ExtendedTeam
  toGroupRow(raw: unknown): GroupRow
  toPlayer(raw: unknown): StarPlayer
  /** Convert player+stats response → TopScorer (rank được set bởi repository) */
  toTopScorer(raw: unknown, rank: number): TopScorer
}

// ── Bundle ────────────────────────────────────────────────────────────────────
// Cặp (client + adapter) được container ghép lại.

export interface ProviderBundle {
  provider: FootballProvider
  adapter: ProviderAdapter
}
