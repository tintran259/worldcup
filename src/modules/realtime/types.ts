/**
 * RealtimeClient — interface chung cho mọi transport (mock / SSE / Socket.IO).
 *
 * Cho phép swap implementation tại runtime mà không sửa useRealtime/stores.
 */

import type { WSMatchEvent } from '@/types/events.types'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'

export interface RealtimeClientConfig {
  /** URL endpoint — diễn giải tùy adapter (mock=fake, sse=HTTP, socket.io=WS) */
  url: string
  /** Reconnect tự động khi disconnected */
  autoReconnect?: boolean
  /** Reconnect delay base (ms) */
  reconnectDelayMs?: number
  /** Callback khi status đổi */
  onStatusChange?: (status: ConnectionStatus) => void
}

export interface RealtimeClient {
  connect():    void
  disconnect(): void
  subscribe(matchIds:   string[]): void
  unsubscribe(matchIds: string[]): void
  isConnected(): boolean
  getStatus():   ConnectionStatus
  /** Cho phép mock engine inject event vào bus (chỉ mock dùng) */
  _dispatch?(event: WSMatchEvent): void
}
