import type { Confederation, CountryCode, PersonRef, ISODate } from './common'

export interface Team {
  id: string
  name: string
  shortName: string
  countryCode: CountryCode
  confederation: Confederation
  founded?: number
  homeColor?: string
  awayColor?: string
  thirdColor?: string
  manager?: PersonRef
  captain?: PersonRef
  logo?: string
  lastUpdated?: ISODate
}

export interface TeamStats {
  teamId: string
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}
