import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FeedEvent, FeedEventType } from '@/types/events.types'

const MAX_FEED_EVENTS = 30
const MAX_TOAST_QUEUE = 5

// ── State ─────────────────────────────────────────────────────────────────────

interface EventFeedState {
  /** Full chronological event log (newest first) */
  feed: FeedEvent[]
  /** Queue of events awaiting toast display */
  toastQueue: FeedEvent[]

  pushEvent: (event: FeedEvent) => void
  dismissToast: (id: string) => void
  clearFeed: () => void
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useEventFeedStore = create<EventFeedState>()(
  devtools(
    (set) => ({
      feed: [],
      toastQueue: [],

      pushEvent: (event) =>
        set((state) => {
          // Deduplicate by id
          if (state.feed.some((e) => e.id === event.id)) return state

          const feed = [event, ...state.feed].slice(0, MAX_FEED_EVENTS)

          // Only goal/card/match events get toasts
          const toastWorthy: FeedEventType[] = ['goal', 'yellow-card', 'red-card', 'match-start', 'match-end']
          const toastQueue = toastWorthy.includes(event.type)
            ? [...state.toastQueue, event].slice(-MAX_TOAST_QUEUE)
            : state.toastQueue

          return { feed, toastQueue }
        }),

      dismissToast: (id) =>
        set((state) => ({
          toastQueue: state.toastQueue.filter((e) => e.id !== id),
        })),

      clearFeed: () => set({ feed: [], toastQueue: [] }),
    }),
    { name: 'event-feed-store' }
  )
)
