/**
 * Simulation engine — điều phối tất cả trận đấu đang live.
 *
 * Mỗi trận live có 1 MatchTimer riêng.
 * Engine nhận tick → gọi goalEngine → đẩy event qua MockWebSocket.
 *
 * Khi dùng Socket.IO thật: xóa file này, server sẽ drive events thay thế.
 */

import { createMatchTimer } from './matchTimer'
import { processMinute } from './goalEngine'
import type { MockWebSocket } from './mockWebSocket'
import type { WSMatchEvent } from '@/types/events.types'
import type { ExtendedMatch } from '@/lib/mock/types'

interface LiveMatchState {
  match: ExtendedMatch
  timer: ReturnType<typeof createMatchTimer>
  homeScore: number
  awayScore: number
}

export function createSimulationEngine() {
  let ws: MockWebSocket | null = null
  const state = new Map<string, LiveMatchState>()
  let running = false

  function dispatch(event: WSMatchEvent) {
    ws?._dispatch?.(event)
  }

  function handleTick(matchId: string, minute: number) {
    const s = state.get(matchId)
    if (!s || !s.match.homeTeam || !s.match.awayTeam) return

    const result = processMinute(
      {
        matchId,
        homeTeamId: s.match.homeTeam.id,
        awayTeamId: s.match.awayTeam.id,
        homeTeamName: s.match.homeTeam.shortName,
        awayTeamName: s.match.awayTeam.shortName,
        homeTeamCode: s.match.homeTeam.code,
        awayTeamCode: s.match.awayTeam.code,
        homeScore: s.homeScore,
        awayScore: s.awayScore,
      },
      minute,
    )

    s.homeScore = result.newHome
    s.awayScore = result.newAway
    result.events.forEach(dispatch)
  }

  function handleFullTime(matchId: string, _minute: number) {
    const s = state.get(matchId)
    if (!s) return

    dispatch({
      type: 'MATCH_END',
      matchId,
      homeScore: s.homeScore,
      awayScore: s.awayScore,
      winnerId: s.homeScore > s.awayScore ? s.match.homeTeam?.id
        : s.awayScore > s.homeScore ? s.match.awayTeam?.id
          : undefined,
    })

    state.delete(matchId)
  }

  return {
    setWebSocket(w: MockWebSocket) { ws = w },

    start(matches: ExtendedMatch[], tickMs: number) {
      if (running) return
      running = true

      matches.forEach(match => {
        if (!match.homeTeam || !match.awayTeam) return

        const timer = createMatchTimer({
          matchId: match.id,
          startMinute: match.minute ?? 1,
          tickMs,
          onTick: handleTick,
          onFullTime: handleFullTime,
        })

        state.set(match.id, {
          match,
          timer,
          homeScore: match.score?.home ?? 0,
          awayScore: match.score?.away ?? 0,
        })

        ws?.subscribe([match.id])

        dispatch({ type: 'MATCH_START', matchId: match.id, homeTeamId: match.homeTeam.id, awayTeamId: match.awayTeam.id })

        timer.start()
      })
    },

    stop() {
      state.forEach(({ timer }) => timer.stop())
      state.clear()
      running = false
    },

    isRunning: () => running,
    getScore: (matchId: string) => {
      const s = state.get(matchId)
      return s ? { home: s.homeScore, away: s.awayScore } : undefined
    },
  }
}

export type SimulationEngine = ReturnType<typeof createSimulationEngine>

// Module-level singleton — tạo 1 lần duy nhất cho toàn app
let _engine: SimulationEngine | null = null
export function getSimulationEngine(): SimulationEngine {
  return (_engine ??= createSimulationEngine())
}
