/**
 * Typed in-process event bus.
 * Used internally by the simulation engine to decouple producers from consumers.
 * When integrating real Socket.IO, replace emit() with socket.emit() and
 * replace on() subscriptions with socket.on() — the consumer API stays identical.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler<T = any> = (data: T) => void

class TypedEventBus {
  private readonly listeners = new Map<string, Set<Handler>>()

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<T>(event: string, handler: Handler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler as Handler)
    return () => this.listeners.get(event)?.delete(handler as Handler)
  }

  /** Subscribe once — auto-unsubscribes after first call. */
  once<T>(event: string, handler: Handler<T>): void {
    const unsub = this.on<T>(event, (data) => {
      handler(data)
      unsub()
    })
  }

  /** Publish an event to all subscribers. */
  emit<T>(event: string, data: T): void {
    this.listeners.get(event)?.forEach((h) => {
      try { h(data) }
      catch (err) { console.error(`[EventBus] handler error on "${event}":`, err) }
    })
  }

  /** Remove all handlers for an event, or all events if omitted. */
  off(event?: string): void {
    if (event) this.listeners.delete(event)
    else this.listeners.clear()
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

// Singleton — one bus per application instance
export const eventBus = new TypedEventBus()

// ── Well-known event names ────────────────────────────────────────────────────

export const BUS_EVENTS = {
  WS_MESSAGE:   'ws:message',
  WS_CONNECTED: 'ws:connected',
  WS_CLOSED:    'ws:closed',
  WS_ERROR:     'ws:error',
  SIM_TICK:     'sim:tick',
  SIM_GOAL:     'sim:goal',
  SIM_CARD:     'sim:card',
  SIM_END:      'sim:matchEnd',
} as const
