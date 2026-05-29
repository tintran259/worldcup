/**
 * Public API for the mock data system.
 * Import from here in all application code.
 *
 *   import { MOCK_ROUNDS, TOURNAMENT, GROUP_STANDINGS } from '@/lib/mock'
 */

// ── Types ──────────────────────────────────────────────────────────────────────
export type {
  Confederation,
  KnockoutRound,
  TournamentStatus,
  SurfaceType,
  FormResult,
  Stadium,
  ExtendedTeam,
  StarPlayer,
  GroupRow,
  GroupStage,
  MatchStats,
  ExtendedMatch,
  TournamentMeta,
  TournamentData,
  TopScorer,
} from './types'

// ── Stadiums ───────────────────────────────────────────────────────────────────
export { STADIUMS, getStadium } from './stadiums'

// ── Teams ──────────────────────────────────────────────────────────────────────
export { ALL_TEAMS, QUALIFIED_TEAMS, TEAM_MAP, getTeam } from './teams'

// ── Players ────────────────────────────────────────────────────────────────────
export {
  ALL_PLAYERS,
  PLAYER_MAP,
  TOP_SCORERS,
  getTeamPlayers,
  BRA_PLAYERS,
  FRA_PLAYERS,
  ARG_PLAYERS,
  ENG_PLAYERS,
  ESP_PLAYERS,
  GER_PLAYERS,
  POR_PLAYERS,
  NED_PLAYERS,
  USA_PLAYERS,
  MAR_PLAYERS,
  JPN_PLAYERS,
  SEN_PLAYERS,
  URU_PLAYERS,
} from './players'

// ── Group standings ────────────────────────────────────────────────────────────
export { GROUP_STANDINGS, GROUP_MAP, ALL_GROUP_ROWS } from './standings'

// ── Matches ────────────────────────────────────────────────────────────────────
export {
  R32_MATCHES,
  R16_MATCHES,
  QF_MATCHES,
  SF_MATCHES,
  FINAL_MATCHES,
  ALL_KNOCKOUT_MATCHES,
  KNOCKOUT_ROUNDS,
  getMatch,
} from './matches'

// ── Tournament ─────────────────────────────────────────────────────────────────
export {
  TOURNAMENT_META,
  TOURNAMENT,
  TOP_SCORER_TABLE,
  LIVE_MATCHES,
  COMPLETED_MATCHES,
  UPCOMING_MATCHES,
  MOCK_ROUNDS,          // ← BracketCanvas uses this
} from './tournament'
