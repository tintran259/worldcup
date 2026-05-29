// ── Primitive score record ────────────────────────────────────────────────────

export interface ScoreUpdate {
  matchId: string
  homeScore: number
  awayScore: number
  minute: number
}

// ── Feed event (toast + history) ──────────────────────────────────────────────

export type FeedEventType =
  | 'goal'
  | 'yellow-card'
  | 'red-card'
  | 'match-start'
  | 'match-end'

export interface FeedEvent {
  id: string
  type: FeedEventType
  matchId: string
  teamId?: string
  teamCode?: string
  playerName?: string
  minute?: number
  homeScore?: number
  awayScore?: number
  homeTeamName?: string
  awayTeamName?: string
  timestamp: number
}

// ── WebSocket wire events ─────────────────────────────────────────────────────

export type WSMatchEvent =
  | {
      type: 'SCORE_UPDATE'
      matchId: string
      homeScore: number
      awayScore: number
      minute: number
    }
  | {
      type: 'MATCH_START'
      matchId: string
      homeTeamId: string
      awayTeamId: string
    }
  | {
      type: 'MATCH_END'
      matchId: string
      homeScore: number
      awayScore: number
      winnerId?: string
    }
  | {
      type: 'GOAL'
      matchId: string
      teamId: string
      teamCode: string
      playerId: string
      playerName: string
      minute: number
      homeScore: number
      awayScore: number
      homeTeamName: string
      awayTeamName: string
    }
  | {
      type: 'CARD'
      matchId: string
      teamId: string
      teamCode: string
      playerId: string
      playerName: string
      cardType: 'yellow' | 'red'
      minute: number
    }
  | {
      type: 'SUBSTITUTION'
      matchId: string
      teamId: string
      playerInName: string
      playerOutName: string
      minute: number
    }
  | {
      type: 'HEARTBEAT'
      timestamp: number
      connectedClients?: number
    }

// ── Simulation speed ──────────────────────────────────────────────────────────

export type SimulationSpeed = 'normal' | 'fast' | 'turbo'

export const SIMULATION_TICK_MS: Record<SimulationSpeed, number> = {
  normal: 1000,
  fast:   350,
  turbo:  100,
}
