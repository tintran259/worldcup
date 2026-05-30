'use client'

/**
 * useHeaderStats — data hook for live/completed match counts in the header.
 *
 * Data flow:
 *   Header → useHeaderStats → headerService → /api/matches
 *
 * Polls every 30 seconds so the live count badge stays accurate.
 */

import { useQuery }      from '@tanstack/react-query'
import { headerService } from '../services/header.service'
import { queryKeys }     from '@/queries/keys'
import { MOCK_ROUNDS }   from '@/lib/mock'

export interface UseHeaderStatsReturn {
  liveCount:      number
  completedCount: number
}

export function useHeaderStats(): UseHeaderStatsReturn {
  const { data } = useQuery({
    queryKey:        queryKeys.matches.list(),
    queryFn:         () => headerService.fetchAllMatches(),
    staleTime:       0,
    refetchInterval: 30_000,
  })

  const matches = data ?? MOCK_ROUNDS.flatMap((r) => r.matches)

  return {
    liveCount:      matches.filter((m) => m.status === 'live').length,
    completedCount: matches.filter((m) => m.status === 'completed').length,
  }
}
