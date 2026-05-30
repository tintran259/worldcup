import type { Match, TournamentRound } from '@/types/domain.types'

export interface BracketNodePosition {
  matchId: string
  x: number
  y: number
  round: TournamentRound
}

export interface ConnectorPath {
  id: string
  d: string
  isWinnerPath: boolean
  isActivePath: boolean
  isLivePath: boolean
  /** Which bracket column this connector originates from (0 = first round) */
  roundIndex: number
  /** Position of this connector within its round column */
  matchIndex: number
}

export interface BracketDimensions {
  totalWidth: number
  totalHeight: number
  roundCount: number
}

export interface RoundConfig {
  id: TournamentRound
  label: string
  shortLabel: string
  matchCount: number
  columnIndex: number
}

export const ROUND_CONFIGS: RoundConfig[] = [
  { id: 'group',         label: 'Group Stage',    shortLabel: 'GS',  matchCount: 48, columnIndex: 0 },
  { id: 'round-of-32',  label: 'Round of 32',    shortLabel: 'R32', matchCount: 16, columnIndex: 1 },
  { id: 'round-of-16',  label: 'Round of 16',    shortLabel: 'R16', matchCount: 8,  columnIndex: 2 },
  { id: 'quarter-final',label: 'Quarter-Finals',  shortLabel: 'QF',  matchCount: 4,  columnIndex: 3 },
  { id: 'semi-final',   label: 'Semi-Finals',    shortLabel: 'SF',  matchCount: 2,  columnIndex: 4 },
  { id: 'final',        label: 'Final',          shortLabel: 'F',   matchCount: 1,  columnIndex: 5 },
]

export const NODE_WIDTH     = 200
export const NODE_HEIGHT    = 80
export const NODE_GAP       = 16
export const ROUND_GAP      = 120
export const CANVAS_PADDING = 48
/** Vertical space reserved above the first node row for round column labels */
export const LABEL_HEIGHT   = 40

export type { Match }
