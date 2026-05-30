import type { Player, PlayerPosition } from './player'

export interface LineupPlayer {
  player: Player
  position: PlayerPosition
  shirtNumber: number
  isSubstitute: boolean
}

export interface Lineup {
  matchId: string
  teamId: string
  formation: string
  startingXI: LineupPlayer[]
  substitutes: LineupPlayer[]
  manager?: string
}
