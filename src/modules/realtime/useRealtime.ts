'use client'

import { useEffect, useRef } from 'react'
import { useRealtimeStore, useEventFeedStore } from '@/stores'
import { createMockWebSocket }   from './mockWebSocket'
import { getSimulationEngine }   from './simulationEngine'
import { eventBus, BUS_EVENTS }  from './eventBus'
import { LIVE_MATCHES }          from '@/lib/mock'
import { SIMULATION_TICK_MS }    from '@/types/events.types'
import type { WSMatchEvent, FeedEvent, SimulationSpeed } from '@/types/events.types'
import type { ExtendedMatch }    from '@/lib/mock/types'
import type { MockWebSocket }    from './mockWebSocket'
import type { SimulationEngine } from './simulationEngine'

export interface UseRealtimeOptions {
  speed?:     SimulationSpeed
  autoStart?: boolean
}

// ── Chuyển WSMatchEvent → FeedEvent (dùng cho toast/live feed) ───────────────

let _feedId = 1

function toFeedEvent(event: WSMatchEvent): FeedEvent | null {
  const id = `feed-${_feedId++}`
  const ts = Date.now()

  switch (event.type) {
    case 'GOAL':
      return { id, type: 'goal', matchId: event.matchId, teamId: event.teamId, teamCode: event.teamCode, playerName: event.playerName, minute: event.minute, homeScore: event.homeScore, awayScore: event.awayScore, homeTeamName: event.homeTeamName, awayTeamName: event.awayTeamName, timestamp: ts }

    case 'CARD':
      return { id, type: event.cardType === 'red' ? 'red-card' : 'yellow-card', matchId: event.matchId, teamId: event.teamId, teamCode: event.teamCode, playerName: event.playerName, minute: event.minute, timestamp: ts }

    case 'MATCH_START':
      return { id, type: 'match-start', matchId: event.matchId, timestamp: ts }

    case 'MATCH_END':
      return { id, type: 'match-end', matchId: event.matchId, homeScore: event.homeScore, awayScore: event.awayScore, timestamp: ts }

    default:
      return null
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRealtime({ speed = 'normal', autoStart = true }: UseRealtimeOptions = {}) {
  const { applyEvent, setConnectionStatus } = useRealtimeStore()
  const { pushEvent }  = useEventFeedStore()
  const engineRef = useRef<SimulationEngine | null>(null)
  const wsRef     = useRef<MockWebSocket    | null>(null)

  useEffect(() => {
    if (!autoStart) return

    const ws = createMockWebSocket({
      url:              'wss://mock.worldcup2026.app/realtime',
      heartbeatMs:      25_000,
      onStatusChange:   setConnectionStatus,
    })
    wsRef.current = ws

    // Bus → Zustand stores
    const unsubMsg = eventBus.on<WSMatchEvent>(BUS_EVENTS.WS_MESSAGE, (event) => {
      applyEvent(event)
      const feedEvent = toFeedEvent(event)
      if (feedEvent) pushEvent(feedEvent)
    })

    const unsubOpen = eventBus.on(BUS_EVENTS.WS_CONNECTED, () => {
      setConnectionStatus('connected')
      const engine = getSimulationEngine()
      engineRef.current = engine
      engine.setWebSocket(ws)
      engine.start(LIVE_MATCHES as ExtendedMatch[], SIMULATION_TICK_MS[speed])
    })

    const unsubClose = eventBus.on(BUS_EVENTS.WS_CLOSED, () => setConnectionStatus('disconnected'))

    ws.connect()

    return () => {
      unsubMsg()
      unsubOpen()
      unsubClose()
      engineRef.current?.stop()
      ws.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    pause:  () => engineRef.current?.stop(),
    resume: () => {
      const engine = engineRef.current
      if (!engine || !wsRef.current) return
      engine.start(LIVE_MATCHES as ExtendedMatch[], SIMULATION_TICK_MS[speed])
    },
  }
}
