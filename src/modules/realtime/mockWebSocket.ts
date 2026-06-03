/**
 * Mock WebSocket — implement RealtimeClient interface qua simulation engine.
 *
 * Dùng cho dev/demo khi chưa có backend real-time.
 * Swap sang `createSSEClient` hoặc `createSocketIOClient` khi deploy thật.
 */

import type { WSMatchEvent } from '@/types/events.types'
import { eventBus, BUS_EVENTS } from './eventBus'
import type { RealtimeClient, ConnectionStatus } from './types'

export interface MockWSConfig {
  url: string
  connectDelayMs?: number
  heartbeatMs?: number
  onStatusChange?: (status: ConnectionStatus) => void
}

export function createMockWebSocket(config: MockWSConfig): RealtimeClient {
  let status: ConnectionStatus = 'idle'
  let connectTimer: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  const subscribedMatchIds = new Set<string>()

  const connectDelay = config.connectDelayMs ?? 280 + Math.random() * 180
  const heartbeatMs = config.heartbeatMs ?? 30_000
  const onStatusChange = config.onStatusChange ?? (() => { })

  function setStatus(s: ConnectionStatus) {
    status = s
    onStatusChange(s)
  }

  function cleanup() {
    if (connectTimer) { clearTimeout(connectTimer); connectTimer = null }
    if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null }
  }

  return {
    connect() {
      if (status === 'connected' || status === 'connecting') return
      setStatus('connecting')

      connectTimer = setTimeout(() => {
        setStatus('connected')
        eventBus.emit(BUS_EVENTS.WS_CONNECTED, { url: config.url })

        if (heartbeatMs) {
          heartbeatTimer = setInterval(() => {
            eventBus.emit(BUS_EVENTS.WS_MESSAGE, {
              type: 'HEARTBEAT',
              timestamp: Date.now(),
            } satisfies WSMatchEvent)
          }, heartbeatMs)
        }
      }, connectDelay)
    },

    disconnect() {
      cleanup()
      setStatus('disconnected')
      eventBus.emit(BUS_EVENTS.WS_CLOSED, {})
    },

    subscribe(matchIds: string[]) {
      matchIds.forEach(id => subscribedMatchIds.add(id))
    },

    unsubscribe(matchIds: string[]) {
      matchIds.forEach(id => subscribedMatchIds.delete(id))
    },

    isConnected: () => status === 'connected',
    getStatus: () => status,

    /** Được gọi bởi SimulationEngine để đẩy event vào bus */
    _dispatch(event: WSMatchEvent) {
      if (status !== 'connected') return
      if ('matchId' in event && !subscribedMatchIds.has(event.matchId)) return
      // Jitter nhỏ để giống latency thật (0–40ms)
      setTimeout(() => eventBus.emit(BUS_EVENTS.WS_MESSAGE, event), Math.random() * 40)
    },
  }
}

/** @deprecated use RealtimeClient from './types' */
export type MockWebSocket = ReturnType<typeof createMockWebSocket>
