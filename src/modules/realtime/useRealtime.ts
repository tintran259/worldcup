'use client'

import { useEffect, useRef } from 'react'
import { useRealtimeStore, useEventFeedStore } from '@/store'
import { MockWebSocketService }  from './mockWebSocket'
import { SimulationEngine }      from './simulationEngine'
import { eventBus, BUS_EVENTS }  from './eventBus'
import { LIVE_MATCHES }          from '@/lib/mock'
import type { WSMatchEvent, FeedEvent, SimulationSpeed, SIMULATION_TICK_MS } from '@/types/events.types'

// Re-import for value (not just type)
import { SIMULATION_TICK_MS as TICK_MS } from '@/types/events.types'
import type { ExtendedMatch } from '@/lib/mock/types'

// ── Options ───────────────────────────────────────────────────────────────────

export interface UseRealtimeOptions {
  speed?:    SimulationSpeed
  autoStart?: boolean
}

// ── Helper: convert WSMatchEvent → FeedEvent ──────────────────────────────────

let _feedId = 1

function toFeedEvent(event: WSMatchEvent): FeedEvent | null {
  const id  = `feed-${_feedId++}`
  const ts  = Date.now()

  switch (event.type) {
    case 'GOAL':
      return {
        id, type: 'goal',
        matchId:      event.matchId,
        teamId:       event.teamId,
        teamCode:     event.teamCode,
        playerName:   event.playerName,
        minute:       event.minute,
        homeScore:    event.homeScore,
        awayScore:    event.awayScore,
        homeTeamName: event.homeTeamName,
        awayTeamName: event.awayTeamName,
        timestamp: ts,
      }

    case 'CARD':
      return {
        id, type: event.cardType === 'red' ? 'red-card' : 'yellow-card',
        matchId:    event.matchId,
        teamId:     event.teamId,
        teamCode:   event.teamCode,
        playerName: event.playerName,
        minute:     event.minute,
        timestamp:  ts,
      }

    case 'MATCH_START':
      return { id, type: 'match-start', matchId: event.matchId, timestamp: ts }

    case 'MATCH_END':
      return {
        id, type: 'match-end',
        matchId:   event.matchId,
        homeScore: event.homeScore,
        awayScore: event.awayScore,
        timestamp: ts,
      }

    default:
      return null
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRealtime({
  speed     = 'normal',
  autoStart = true,
}: UseRealtimeOptions = {}) {
  const { applyEvent, setConnectionStatus } = useRealtimeStore()
  const { pushEvent }                       = useEventFeedStore()
  const engineRef = useRef<SimulationEngine | null>(null)
  const wsRef     = useRef<MockWebSocketService | null>(null)

  useEffect(() => {
    if (!autoStart) return

    // ── Boot the mock WS service ────────────────────────────────────────────
    const ws = new MockWebSocketService({
      url: 'wss://mock.worldcup2026.app/realtime',
      heartbeatMs: 25_000,
      onStatusChange: setConnectionStatus,
    })
    wsRef.current = ws

    // ── Wire bus → Zustand stores ───────────────────────────────────────────
    const unsubMessage = eventBus.on<WSMatchEvent>(BUS_EVENTS.WS_MESSAGE, (event) => {
      // 1. Update realtime store (scores, live match ids, etc.)
      applyEvent(event)

      // 2. Push notable events into the feed/toast store
      const feedEvent = toFeedEvent(event)
      if (feedEvent) pushEvent(feedEvent)
    })

    const unsubOpen  = eventBus.on(BUS_EVENTS.WS_CONNECTED, () => {
      setConnectionStatus('connected')

      // ── Start simulation for all currently-live matches ─────────────────
      const engine = SimulationEngine.getInstance()
      engineRef.current = engine
      engine.setWebSocket(ws)
      engine.start(LIVE_MATCHES as ExtendedMatch[], TICK_MS[speed])
    })

    const unsubClose = eventBus.on(BUS_EVENTS.WS_CLOSED, () => {
      setConnectionStatus('disconnected')
    })

    // ── Connect (triggers onOpen → starts simulation) ──────────────────────
    ws.connect()

    return () => {
      unsubMessage()
      unsubOpen()
      unsubClose()
      engineRef.current?.stop()
      ws.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Manual controls (for a debug panel / simulation settings) ──────────────
  const pause = () => engineRef.current?.stop()
  const resume = () => {
    const engine = engineRef.current
    if (!engine || !wsRef.current) return
    engine.start(LIVE_MATCHES as ExtendedMatch[], TICK_MS[speed])
  }

  return { pause, resume }
}
