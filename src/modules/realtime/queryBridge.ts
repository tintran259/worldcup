/**
 * Bridge: realtime events → React Query cache.
 *
 * Khi nhận SCORE_UPDATE / GOAL / MATCH_END từ SSE/WS:
 *   - Apply patch lên queryData (live matches, matches list, match detail)
 *   - UI tự re-render qua React Query subscription
 *   - KHÔNG cần refetch HTTP → 0 thêm API call
 *
 * Cách dùng (gọi 1 lần ở app-shell):
 *   useRealtimeQueryBridge()
 */

'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { eventBus, BUS_EVENTS } from './eventBus'
import { queryKeys } from '@/queries/keys'
import type { WSMatchEvent } from '@/types/events.types'
import type { Match } from '@/types/domain.types'

/**
 * Patch helper — update score của 1 match trong list.
 */
function patchScoreInList(matches: Match[] | undefined, matchId: string, home: number, away: number): Match[] | undefined {
  if (!matches) return matches
  let changed = false
  const next = matches.map((m) => {
    if (m.id !== matchId) return m
    if (m.score?.home === home && m.score?.away === away) return m
    changed = true
    return { ...m, score: { home, away } }
  })
  return changed ? next : matches
}

export function useRealtimeQueryBridge() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsub = eventBus.on<WSMatchEvent>(BUS_EVENTS.WS_MESSAGE, (event) => {
      switch (event.type) {
        case 'SCORE_UPDATE':
        case 'GOAL': {
          // Update score trong tất cả query liên quan đến matches list
          // (live, all, by-team). Filter theo queryKey prefix.
          queryClient.setQueriesData<Match[]>(
            { queryKey: queryKeys.matches.list() },
            (prev) => patchScoreInList(prev, event.matchId, event.homeScore, event.awayScore),
          )

          // Patch match detail nếu đang được watch
          queryClient.setQueryData<Match>(
            queryKeys.matches.detail(event.matchId),
            (prev) => prev
              ? { ...prev, score: { home: event.homeScore, away: event.awayScore } }
              : prev,
          )
          break
        }

        case 'MATCH_START':
        case 'MATCH_END': {
          // Status đổi → invalidate để refetch (status thay đổi affect nhiều derived state)
          queryClient.invalidateQueries({ queryKey: queryKeys.matches.list() })
          queryClient.invalidateQueries({ queryKey: queryKeys.matches.detail(event.matchId) })
          break
        }

        case 'CARD':
        case 'SUBSTITUTION': {
          // Events này chỉ affect match detail timeline.
          // Optional: append vào match.events array thay vì invalidate.
          queryClient.invalidateQueries({ queryKey: queryKeys.matches.detail(event.matchId) })
          break
        }

        // HEARTBEAT, CONNECTED, etc — ignore
        default:
          break
      }
    })

    return unsub
  }, [queryClient])
}
