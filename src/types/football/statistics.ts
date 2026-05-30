import type { Percentage } from './common'

export interface MatchStatistics {
  matchId: string
  teamId: string
  possession: Percentage
  shotsTotal: number
  shotsOnTarget: number
  shotsOffTarget: number
  shotsBlocked: number
  passes: number
  passesAccurate: number
  passesInaccurate: number
  passAccuracy: Percentage
  crosses: number
  crossesAccurate: number
  tackles: number
  interceptions: number
  fouls: number
  offsides: number
  corners: number
  throwIns: number
  saves: number
  goalKicks: number
}

export interface TeamSeasonStats {
  teamId: string
  competitionId: string
  gamesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  goalsPerGame: number
  cleanSheets: number
  failedToScore: number
  points: number
  averageRating?: number
}
