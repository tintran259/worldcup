// ── Re-export commons domain types (non-conflicting) ────────────────────────
export type {
  CountryCode,
  ISODate,
  ISODateTime,
  Percentage,
  MarketValue,
  FormResult,
  Confederation,
  Coordinate,
  DateRange,
  PersonRef,
  Paginated,
  Timestamped,
} from '@/types/football/common'

export type {
  CompetitionFormat,
  Competition,
} from '@/types/football/competition'

export type {
  PlayerPosition,
  PlayerPerformance,
} from '@/types/football/player'

export type {
  MatchStatistics,
  TeamSeasonStats,
} from '@/types/football/statistics'

export type {
  AdvanceStatus,
  Standing,
  GroupStage,
} from '@/types/football/standing'

export type {
  LineupPlayer,
  Lineup,
} from '@/types/football/lineup'

export type {
  InjurySeverity,
  Injury,
} from '@/types/football/injury'

export type {
  Suspension,
} from '@/types/football/suspension'

// ── UI-focused type definitions (canonical for this codebase) ───────────────
export type MatchStatus = 'upcoming' | 'live' | 'halftime' | 'completed' | 'postponed' | 'cancelled'
export type TournamentRound = 'group' | 'round-of-32' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'third-place' | 'final'

export interface Team {
  id: string
  name: string
  shortName: string
  code: string
  flagUrl: string
  groupId?: string
  ranking?: number
}

export interface TeamStats {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: ('W' | 'D' | 'L')[]
}

export interface Player {
  id: string
  name: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  number: number
  teamId: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface MatchScore {
  home: number
  away: number
  homeExtraTime?: number
  awayExtraTime?: number
  homePenalties?: number
  awayPenalties?: number
}

export interface MatchEvent {
  id: string
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution' | 'var'
  minute: number
  addedTime?: number
  teamId: string
  playerId: string
  playerName: string
  assistPlayerId?: string
  assistPlayerName?: string
  description?: string
}

export interface Match {
  id: string
  round: TournamentRound
  roundDisplay: string
  matchNumber: number
  homeTeam: Team | null
  awayTeam: Team | null
  score: MatchScore | null
  status: MatchStatus
  minute?: number
  venue: string
  city: string
  scheduledAt: string
  winnerId?: string
  events?: MatchEvent[]
}

export interface MatchDetail extends Match {
  events: MatchEvent[]
  homeLineup?: Player[]
  awayLineup?: Player[]
  homeFormation?: string
  awayFormation?: string
  stats?: MatchStats
}

export interface MatchStats {
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  shotsOnTarget: { home: number; away: number }
  corners: { home: number; away: number }
  fouls: { home: number; away: number }
  yellowCards: { home: number; away: number }
  redCards: { home: number; away: number }
  xG?: { home: number; away: number }
}

export interface Group {
  id: string
  name: string
  teams: Team[]
  standings: TeamStats[]
}

export interface BracketRound {
  id: TournamentRound
  label: string
  matchCount: number
  matches: Match[]
}

export interface Tournament {
  id: string
  name: string
  year: number
  host: string
  rounds: BracketRound[]
  champion?: Team
  status: 'upcoming' | 'ongoing' | 'completed'
}
