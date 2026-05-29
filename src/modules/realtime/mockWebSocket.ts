/**
 * MockWebSocketService
 *
 * Mimics the browser WebSocket / Socket.IO-client interface so that
 * swapping to a real Socket.IO connection later requires changing only
 * this file — all consumers keep the same API.
 *
 *   Real Socket.IO swap:
 *     const socket = io('wss://api.example.com')
 *     socket.on('matchEvent', handler)
 *     socket.emit('subscribe', { matchIds })
 */

import type { WSMatchEvent } from '@/types/events.types'
import { eventBus, BUS_EVENTS } from './eventBus'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'

export interface MockWSConfig {
  url: string
  /** How long to simulate the initial handshake (ms) */
  connectDelayMs?: number
  /** How often to send HEARTBEAT events (ms, 0 = disabled) */
  heartbeatMs?: number
  onStatusChange?: (status: ConnectionStatus) => void
}

// ── Service ───────────────────────────────────────────────────────────────────

export class MockWebSocketService {
  private status: ConnectionStatus = 'idle'
  private connectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private readonly config: Required<MockWSConfig>
  private subscribedMatchIds: Set<string> = new Set()

  constructor(config: MockWSConfig) {
    this.config = {
      connectDelayMs: 280 + Math.random() * 180,
      heartbeatMs: 30_000,
      onStatusChange: () => {},
      ...config,
    }
  }

  // ── Public API (mirrors Socket.IO / WebSocket) ──────────────────────────────

  connect(): void {
    if (this.status === 'connected' || this.status === 'connecting') return
    this.setStatus('connecting')

    this.connectTimer = setTimeout(() => {
      this.setStatus('connected')
      eventBus.emit(BUS_EVENTS.WS_CONNECTED, { url: this.config.url })
      this.startHeartbeat()
    }, this.config.connectDelayMs)
  }

  disconnect(): void {
    this.cleanup()
    this.setStatus('disconnected')
    eventBus.emit(BUS_EVENTS.WS_CLOSED, {})
  }

  /**
   * Subscribe to live updates for specific matches.
   * (In real Socket.IO: socket.emit('subscribe', { matchIds }))
   */
  subscribe(matchIds: string[]): void {
    matchIds.forEach((id) => this.subscribedMatchIds.add(id))
  }

  unsubscribe(matchIds: string[]): void {
    matchIds.forEach((id) => this.subscribedMatchIds.delete(id))
  }

  isConnected(): boolean {
    return this.status === 'connected'
  }

  getStatus(): ConnectionStatus {
    return this.status
  }

  // ── Internal — called by SimulationEngine ───────────────────────────────────

  /**
   * Push a simulated server event into the bus.
   * Real Socket.IO equivalent: socket.emit() on the server side.
   */
  _dispatch(event: WSMatchEvent): void {
    if (this.status !== 'connected') return

    // Filter to subscribed matches only (matches real WS filtering)
    if ('matchId' in event && !this.subscribedMatchIds.has(event.matchId)) return

    // Small random latency jitter to feel realistic (0–40 ms)
    const jitter = Math.random() * 40
    setTimeout(() => {
      eventBus.emit(BUS_EVENTS.WS_MESSAGE, event)
    }, jitter)
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private setStatus(status: ConnectionStatus): void {
    this.status = status
    this.config.onStatusChange(status)
  }

  private startHeartbeat(): void {
    if (!this.config.heartbeatMs) return
    this.heartbeatTimer = setInterval(() => {
      eventBus.emit(BUS_EVENTS.WS_MESSAGE, {
        type: 'HEARTBEAT',
        timestamp: Date.now(),
      } satisfies WSMatchEvent)
    }, this.config.heartbeatMs)
  }

  private cleanup(): void {
    if (this.connectTimer) { clearTimeout(this.connectTimer); this.connectTimer = null }
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null }
  }
}
