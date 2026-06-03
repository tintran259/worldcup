/**
 * SSE (Server-Sent Events) client — native EventSource, không cần install deps.
 *
 * Trade-offs:
 *   ✅ Zero new dependencies (browser EventSource là native API)
 *   ✅ Auto-reconnect built-in (browser tự retry với Last-Event-ID)
 *   ✅ HTTP-based → đi qua HTTP/2, CDN, proxies dễ dàng
 *   ✅ Deploy được trên Vercel (streaming response support)
 *   ⚠️  One-way (server → client). Subscribe phải đẩy qua query string.
 *   ⚠️  Connection limit per browser: ~6 cùng origin (HTTP/2 thì cao hơn)
 *
 * Khi cần bidirectional + room support → upgrade lên Socket.IO (xem socketIOClient.ts).
 */

'use client'

import type { WSMatchEvent } from '@/types/events.types'
import { eventBus, BUS_EVENTS } from './eventBus'
import type { RealtimeClient, ConnectionStatus, RealtimeClientConfig } from './types'

export interface SSEClientConfig extends RealtimeClientConfig {
  /** Endpoint SSE — default '/api/stream/live' */
  url: string
}

export function createSSEClient(config: SSEClientConfig): RealtimeClient {
  let status:        ConnectionStatus = 'idle'
  let eventSource:   EventSource | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  const subscribedMatchIds = new Set<string>()

  const onStatusChange = config.onStatusChange ?? (() => { })
  const autoReconnect  = config.autoReconnect ?? true

  function setStatus(s: ConnectionStatus) {
    if (status === s) return
    status = s
    onStatusChange(s)
  }

  function buildUrl(): string {
    const params = new URLSearchParams()
    if (subscribedMatchIds.size > 0) {
      params.set('matchIds', [...subscribedMatchIds].join(','))
    }
    const qs = params.toString()
    return qs ? `${config.url}?${qs}` : config.url
  }

  function doConnect() {
    if (eventSource) eventSource.close()
    if (typeof EventSource === 'undefined') {
      console.error('[SSE] EventSource not supported in this environment')
      setStatus('error')
      return
    }

    setStatus('connecting')
    const url = buildUrl()
    eventSource = new EventSource(url, { withCredentials: false })

    eventSource.onopen = () => {
      setStatus('connected')
      eventBus.emit(BUS_EVENTS.WS_CONNECTED, { url })
    }

    // Message default channel — JSON payload là WSMatchEvent
    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as WSMatchEvent
        // Filter client-side theo subscribed matches (server có thể không filter)
        if ('matchId' in event && subscribedMatchIds.size > 0
            && !subscribedMatchIds.has(event.matchId)) return
        eventBus.emit(BUS_EVENTS.WS_MESSAGE, event)
      } catch (err) {
        console.warn('[SSE] Parse error:', err, e.data)
      }
    }

    eventSource.onerror = () => {
      // EventSource tự retry, nhưng vẫn signal disconnected cho UI
      setStatus('disconnected')
      eventBus.emit(BUS_EVENTS.WS_CLOSED, {})

      // EventSource tự reconnect. Nếu disable autoReconnect → close hoàn toàn.
      if (!autoReconnect) {
        eventSource?.close()
        eventSource = null
      } else {
        // Browser EventSource handles reconnect automatically with backoff.
        // Chỉ schedule manual khi muốn override (vd: thay đổi subscribe).
      }
    }
  }

  return {
    connect() {
      if (status === 'connected' || status === 'connecting') return
      doConnect()
    },

    disconnect() {
      if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
      eventSource?.close()
      eventSource = null
      setStatus('disconnected')
      eventBus.emit(BUS_EVENTS.WS_CLOSED, {})
    },

    subscribe(matchIds: string[]) {
      let changed = false
      for (const id of matchIds) {
        if (!subscribedMatchIds.has(id)) { subscribedMatchIds.add(id); changed = true }
      }
      // Nếu subscribe đổi → reconnect với URL mới (SSE không support push subscribe)
      if (changed && status === 'connected') {
        doConnect()
      }
    },

    unsubscribe(matchIds: string[]) {
      let changed = false
      for (const id of matchIds) {
        if (subscribedMatchIds.delete(id)) changed = true
      }
      if (changed && status === 'connected') {
        doConnect()
      }
    },

    isConnected: () => status === 'connected',
    getStatus:   () => status,
    // SSE không support _dispatch (one-way). Mock-only API.
  }
}
