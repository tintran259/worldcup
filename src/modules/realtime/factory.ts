/**
 * Realtime client factory — picks adapter dựa trên env config.
 *
 * Priority:
 *   1. NEXT_PUBLIC_REALTIME_SSE_URL set  → SSE (zero deps, Vercel-native)
 *   2. NEXT_PUBLIC_REALTIME_WS_URL set   → Socket.IO (needs install + WS server)
 *   3. Default                            → MockWebSocket (dev/demo)
 *
 * Production trên Vercel: dùng SSE.
 * Production self-hosted có WS server: dùng Socket.IO (Phase 3 Pro).
 */

'use client'

import { createMockWebSocket } from './mockWebSocket'
import { createSSEClient } from './sseClient'
import type { RealtimeClient, ConnectionStatus } from './types'

export interface RealtimeFactoryConfig {
  onStatusChange?: (s: ConnectionStatus) => void
  heartbeatMs?:    number
}

export function createRealtimeClient(opts: RealtimeFactoryConfig = {}): RealtimeClient {
  const sseUrl = process.env.NEXT_PUBLIC_REALTIME_SSE_URL
  const wsUrl  = process.env.NEXT_PUBLIC_REALTIME_WS_URL

  if (sseUrl) {
    console.log(`[realtime] Using SSE client → ${sseUrl}`)
    return createSSEClient({
      url:           sseUrl,
      autoReconnect: true,
      onStatusChange: opts.onStatusChange,
    })
  }

  if (wsUrl) {
    // Socket.IO adapter — lazy-load để tránh require socket.io-client khi chưa cài.
    // Khi user set NEXT_PUBLIC_REALTIME_WS_URL → họ phải `npm install socket.io-client`.
    console.warn(
      `[realtime] Socket.IO requested (${wsUrl}) but adapter chưa được wire. ` +
      `Install socket.io-client + uncomment trong factory.ts để enable.`,
    )
    // import('./socketIOClient').then(...)  ← enable khi đã cài deps
    return createMockWebSocket({
      url:           wsUrl,
      heartbeatMs:   opts.heartbeatMs,
      onStatusChange: opts.onStatusChange,
    })
  }

  // Default: mock simulation
  console.log('[realtime] Using MockWebSocket (set NEXT_PUBLIC_REALTIME_SSE_URL hoặc NEXT_PUBLIC_REALTIME_WS_URL để dùng real backend)')
  return createMockWebSocket({
    url:            'mock://localhost',
    heartbeatMs:    opts.heartbeatMs,
    onStatusChange: opts.onStatusChange,
  })
}
