import type { TournamentMeta, TournamentData, TopScorer } from './types'
import { STADIUMS } from './stadiums'
import { ALL_TEAMS, TEAM_MAP } from './teams'
import { ALL_PLAYERS, TOP_SCORERS } from './players'
import { GROUP_STANDINGS } from './standings'
import { ALL_KNOCKOUT_MATCHES, KNOCKOUT_ROUNDS } from './matches'

// ── Tournament metadata ────────────────────────────────────────────────────────

export const TOURNAMENT_META: TournamentMeta = {
  id: 'wc2026',
  name: 'FIFA World Cup 2026™',
  edition: 23,
  year: 2026,
  hosts: [
    { country: 'United States', code: 'us', city: 'New York / New Jersey' },
    { country: 'Canada', code: 'ca', city: 'Toronto & Vancouver' },
    { country: 'Mexico', code: 'mx', city: 'Mexico City, Monterrey, Guadalajara' },
  ],
  teamCount: 48,
  groupCount: 12,
  matchCount: 104,
  startDate: '2026-06-11T17:00:00Z',
  finalDate: '2026-07-19T20:00:00Z',
  status: 'ongoing',
  currentPhase: 'round-of-32',
}

// ── Top scorers leaderboard ────────────────────────────────────────────────────

export const TOP_SCORER_TABLE: TopScorer[] = TOP_SCORERS.slice(0, 10).map(
  (player, i) => ({
    rank: i + 1,
    player,
    team: TEAM_MAP.get(player.teamId)!,
    goals: player.tournamentGoals,
    assists: player.tournamentAssists,
    minutesPerGoal: Math.round(player.minutesPlayed / (player.tournamentGoals || 1)),
  })
)

// ── Full tournament data object ────────────────────────────────────────────────

export const TOURNAMENT: TournamentData = {
  meta: TOURNAMENT_META,
  stadiums: STADIUMS,
  teams: ALL_TEAMS,
  groups: GROUP_STANDINGS,
  matches: ALL_KNOCKOUT_MATCHES,
  topScorers: TOP_SCORER_TABLE,
  players: ALL_PLAYERS,
}

// ── Quick-access derived views ─────────────────────────────────────────────────

export const LIVE_MATCHES = ALL_KNOCKOUT_MATCHES.filter((m) => m.status === 'live')
export const COMPLETED_MATCHES = ALL_KNOCKOUT_MATCHES.filter((m) => m.status === 'completed')
export const UPCOMING_MATCHES = ALL_KNOCKOUT_MATCHES.filter((m) => m.status === 'upcoming')

/** MOCK_ROUNDS shape used by BracketCanvas — kept for backward compat */
export const MOCK_ROUNDS = KNOCKOUT_ROUNDS
