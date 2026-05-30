import type { ISODate } from './common'

export type InjurySeverity = 'minor' | 'moderate' | 'serious'

export interface Injury {
  playerId: string
  teamId: string
  type: string
  severity: InjurySeverity
  reportedAt: ISODate
  expectedReturn?: ISODate
  notes?: string
  isActive: boolean
}
