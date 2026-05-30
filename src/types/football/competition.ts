import type { DateRange } from './common'

export type CompetitionFormat = 'group-stage' | 'knockout' | 'round-robin' | 'mixed'

export interface Competition {
  id: string
  name: string
  shortName: string
  format: CompetitionFormat
  hasGroupStage: boolean
  season: string
  dateRange: DateRange
  totalTeams: number
  totalMatches: number
}
