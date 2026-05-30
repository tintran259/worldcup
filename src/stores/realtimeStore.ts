import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { WSMatchEvent, ScoreUpdate } from '@/types/events.types'

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'

interface RealtimeState {
  liveMatchIds: string[]
  scoreUpdates: Record<string, ScoreUpdate>
  connectionStatus: ConnectionStatus
  lastEventAt: number | null

  applyEvent: (event: WSMatchEvent) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setLiveMatchIds: (ids: string[]) => void
  clearUpdates: () => void
}

export const useRealtimeStore = create<RealtimeState>()(
  devtools(
    (set) => ({
      liveMatchIds: [],
      scoreUpdates: {},
      connectionStatus: 'idle',
      lastEventAt: null,

      applyEvent: (event) =>
        set((state) => {
          switch (event.type) {
            case 'SCORE_UPDATE':
              return {
                scoreUpdates: {
                  ...state.scoreUpdates,
                  [event.matchId]: {
                    matchId: event.matchId,
                    homeScore: event.homeScore,
                    awayScore: event.awayScore,
                    minute: event.minute,
                  },
                },
                lastEventAt: Date.now(),
              }
            case 'MATCH_START':
              return {
                liveMatchIds: [...new Set([...state.liveMatchIds, event.matchId])],
                lastEventAt: Date.now(),
              }
            case 'MATCH_END':
              return {
                liveMatchIds: state.liveMatchIds.filter((id) => id !== event.matchId),
                lastEventAt: Date.now(),
              }
            default:
              return { lastEventAt: Date.now() }
          }
        }),

      setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
      setLiveMatchIds: (liveMatchIds) => set({ liveMatchIds }),
      clearUpdates: () => set({ scoreUpdates: {} }),
    }),
    { name: 'realtime-store' }
  )
)
