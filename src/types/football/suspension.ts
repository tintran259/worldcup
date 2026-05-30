import type { ISODate } from './common'

export interface Suspension {
  playerId: string
  teamId: string
  reason: string
  redCards?: number
  yellowCards?: number
  suspendedUntil: ISODate
  matchesRemaining: number
  notes?: string
}
