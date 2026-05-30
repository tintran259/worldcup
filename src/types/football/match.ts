import type { ISODateTime, Percentage } from './common'
import type { Team } from './team'

export type MatchStatus = 'upcoming' | 'live' | 'halftime' | 'completed' | 'postponed' | 'cancelled'
export type TournamentRound = 'round-of-32' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'final' | 'third-place' | 'group'

export interface Score {
  home: number
  away: number
  homeExtraTime?: number
  awayExtraTime?: number
  homePenalties?: number
  awayPenalties?: number
}

export interface Match {
  id: string
  competitionId: string
  homeTeam: Team
  awayTeam: Team
  score: Score | null
  status: MatchStatus
  round: TournamentRound
  group?: string
  scheduledAt: ISODateTime
  startedAt?: ISODateTime
  finishedAt?: ISODateTime
  venue?: string
  city?: string
  referee?: string
  attendance?: number
  minute?: number
  winnerId?: string
  possession?: { home: Percentage; away: Percentage }
}
