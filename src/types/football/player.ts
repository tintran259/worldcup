import type { CountryCode, MarketValue, ISODate, Percentage } from './common'

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface Player {
  id: string
  name: string
  firstName?: string
  lastName?: string
  countryCode: CountryCode
  position: PlayerPosition
  shirtNumber?: number
  dateOfBirth?: ISODate
  height?: number
  weight?: number
  club?: string
  marketValue?: MarketValue
  isCaptain: boolean
  lastUpdated?: ISODate
}

export interface PlayerPerformance {
  playerId: string
  teamId: string
  matchesPlayed: number
  minutesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  rating?: Percentage
}
