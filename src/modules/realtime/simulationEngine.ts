/**
 * SimulationEngine — singleton orchestrator
 *
 * Manages one MatchTimer per live match, feeds events through
 * the MockWebSocketService, and maintains authoritative score state.
 *
 * Socket.IO migration path:
 *   Replace MockWebSocketService with a real io() client.
 *   Remove the _dispatch() calls — the server drives events instead.
 *   Keep useRealtime() and the Zustand store untouched.
 */

import { MatchTimer }           from './matchTimer'
import { processMinute }        from './goalEngine'
import type { MockWebSocketService } from './mockWebSocket'
import type { WSMatchEvent }    from '@/types/events.types'
import type { ExtendedMatch }   from '@/lib/mock/types'

// ── Per-match runtime state ────────────────────────────────────────────────────

interface LiveMatchState {
  match:     ExtendedMatch
  timer:     MatchTimer
  homeScore: number
  awayScore: number
}

// ── Engine ────────────────────────────────────────────────────────────────────

export class SimulationEngine {
  private static _instance: SimulationEngine | null = null
  private ws:   MockWebSocketService | null = null
  private state = new Map<string, LiveMatchState>()
  private running = false

  /** Singleton access */
  static getInstance(): SimulationEngine {
    if (!SimulationEngine._instance) {
      SimulationEngine._instance = new SimulationEngine()
    }
    return SimulationEngine._instance
  }

  // ── Setup ──────────────────────────────────────────────────────────────────

  setWebSocket(ws: MockWebSocketService): void {
    this.ws = ws
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  start(matches: ExtendedMatch[], tickMs: number): void {
    if (this.running) return
    this.running = true

    matches.forEach((match) => {
      if (!match.homeTeam || !match.awayTeam) return

      const homeScore = match.score?.home ?? 0
      const awayScore = match.score?.away ?? 0
      const startMin  = match.minute ?? 1

      const timer = new MatchTimer({
        matchId:     match.id,
        startMinute: startMin,
        tickMs,
        onTick:     (id, min) => this.handleTick(id, min),
        onFullTime: (id, min) => this.handleFullTime(id, min),
      })

      this.state.set(match.id, { match, timer, homeScore, awayScore })

      // Subscribe WS to this match
      this.ws?.subscribe([match.id])

      // Announce match start
      this.dispatch({
        type:       'MATCH_START',
        matchId:    match.id,
        homeTeamId: match.homeTeam.id,
        awayTeamId: match.awayTeam.id,
      })

      timer.start()
    })
  }

  stop(): void {
    this.state.forEach(({ timer }) => timer.stop())
    this.state.clear()
    this.running = false
  }

  isRunning(): boolean { return this.running }

  getScore(matchId: string): { home: number; away: number } | undefined {
    const s = this.state.get(matchId)
    return s ? { home: s.homeScore, away: s.awayScore } : undefined
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private handleTick(matchId: string, minute: number): void {
    const s = this.state.get(matchId)
    if (!s || !s.match.homeTeam || !s.match.awayTeam) return

    const result = processMinute(
      {
        matchId,
        homeTeamId:   s.match.homeTeam.id,
        awayTeamId:   s.match.awayTeam.id,
        homeTeamName: s.match.homeTeam.shortName,
        awayTeamName: s.match.awayTeam.shortName,
        homeTeamCode: s.match.homeTeam.code,
        awayTeamCode: s.match.awayTeam.code,
        homeScore:    s.homeScore,
        awayScore:    s.awayScore,
      },
      minute,
    )

    // Commit updated scores
    s.homeScore = result.newHome
    s.awayScore = result.newAway

    result.events.forEach((e) => this.dispatch(e))
  }

  private handleFullTime(matchId: string, minute: number): void {
    const s = this.state.get(matchId)
    if (!s) return

    const winnerId = s.homeScore > s.awayScore
      ? s.match.homeTeam?.id
      : s.awayScore > s.homeScore
        ? s.match.awayTeam?.id
        : undefined

    this.dispatch({
      type:      'MATCH_END',
      matchId,
      homeScore: s.homeScore,
      awayScore: s.awayScore,
      winnerId,
    })

    this.state.delete(matchId)
  }

  private dispatch(event: WSMatchEvent): void {
    this.ws?._dispatch(event)
  }
}
