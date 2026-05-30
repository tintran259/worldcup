/**
 * Event bus nội bộ — tách biệt producer và consumer.
 *
 * Khi tích hợp Socket.IO thật:
 *   Thay emit() → socket.emit()
 *   Thay on()   → socket.on()
 *   Consumer API không cần đổi.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler<T = any> = (data: T) => void

function createEventBus() {
  const listeners = new Map<string, Set<Handler>>()

  return {
    /** Subscribe — trả về hàm unsubscribe */
    on<T>(event: string, handler: Handler<T>): () => void {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(handler as Handler)
      return () => listeners.get(event)?.delete(handler as Handler)
    },

    /** Subscribe một lần rồi tự hủy */
    once<T>(event: string, handler: Handler<T>): void {
      const unsub = this.on<T>(event, (data) => { handler(data); unsub() })
    },

    /** Publish đến tất cả subscriber */
    emit<T>(event: string, data: T): void {
      listeners.get(event)?.forEach(h => {
        try { h(data) }
        catch (err) { console.error(`[EventBus] lỗi handler "${event}":`, err) }
      })
    },

    /** Hủy tất cả handler của một event (hoặc toàn bộ nếu không truyền) */
    off(event?: string): void {
      if (event) listeners.delete(event)
      else listeners.clear()
    },

    listenerCount: (event: string) => listeners.get(event)?.size ?? 0,
  }
}

// Module-level singleton — 1 bus cho toàn app
export const eventBus = createEventBus()

// ── Tên event chuẩn ───────────────────────────────────────────────────────────

export const BUS_EVENTS = {
  WS_MESSAGE: 'ws:message',
  WS_CONNECTED: 'ws:connected',
  WS_CLOSED: 'ws:closed',
  WS_ERROR: 'ws:error',
  SIM_TICK: 'sim:tick',
  SIM_GOAL: 'sim:goal',
  SIM_CARD: 'sim:card',
  SIM_END: 'sim:matchEnd',
} as const
