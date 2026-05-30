/**
 * Tournament-specific constants.
 *
 * Hard-coded values that describe FIFA World Cup 2026 rules and structure.
 * These are tournament facts, not configuration — they don't change with env vars.
 */

import type { TournamentRound } from '@/types/domain.types'

/** All valid tournament rounds, in bracket-column order. */
export const TOURNAMENT_ROUNDS: TournamentRound[] = [
  'group',
  'round-of-32',
  'round-of-16',
  'quarter-final',
  'semi-final',
  'third-place',
  'final',
]

/** Human-readable label for each round. */
export const ROUND_LABELS: Record<TournamentRound, string> = {
  'group': 'Group Stage',
  'round-of-32': 'Round of 32',
  'round-of-16': 'Round of 16',
  'quarter-final': 'Quarter-Finals',
  'semi-final': 'Semi-Finals',
  'third-place': 'Third Place',
  'final': 'Final',
}

/** Short label for each round (displayed in the header phase pill). */
export const ROUND_SHORT_LABELS: Record<TournamentRound, string> = {
  'group': 'GS',
  'round-of-32': 'R32',
  'round-of-16': 'R16',
  'quarter-final': 'QF',
  'semi-final': 'SF',
  'third-place': 'TP',
  'final': 'F',
}

/** The current tournament phase (index into TOURNAMENT_ROUNDS). */
export const CURRENT_PHASE_INDEX = 1  // Round of 32

/** Tournament host nations. */
export const HOST_NATIONS = ['USA', 'Canada', 'Mexico'] as const

/** Total number of group-stage matches. */
export const GROUP_STAGE_MATCH_COUNT = 48

/** Total number of teams in the tournament. */
export const TOTAL_TEAMS = 48
