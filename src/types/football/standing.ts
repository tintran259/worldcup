import type { FormResult } from './common'
import type { Team } from './team'

export type AdvanceStatus = 'qualified' | 'eliminated' | 'pending'

export interface Standing {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: FormResult[]
  advanceStatus: AdvanceStatus
}

export interface GroupStage {
  id: string
  name: string
  standings: Standing[]
}
