export type MatchEventType = 'goal' | 'yellow-card' | 'red-card' | 'substitution' | 'var' | 'own-goal'

export interface MatchEvent {
  id: string
  matchId: string
  type: MatchEventType
  minute: number
  addedTime?: number
  teamId: string
  playerId?: string
  playerName?: string
  assistPlayerId?: string
  assistPlayerName?: string
  substituteInId?: string
  substituteOutId?: string
  description?: string
  timestamp?: number
}
