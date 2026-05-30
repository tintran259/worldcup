'use client'

/**
 * useMatchHistory — data hook for the results/history section.
 *
 * Data flow:
 *   MatchHistoryTab → useMatchHistory → matchHistoryService → /api/matches?status=completed
 */

import { useQuery } from '@tanstack/react-query'
import { matchHistoryService } from '../services/match-history.service'
import { queryKeys } from '@/queries/keys'
import { MOCK_ROUNDS } from '@/lib/mock'
import type { Match } from '@/types/domain.types'

export interface UseMatchHistoryReturn {
  completedMatches: Match[]
  isLoading: boolean
}

export function useMatchHistory(): UseMatchHistoryReturn {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.matches.list('completed'),
    queryFn: () => matchHistoryService.fetchCompleted(),
    staleTime: 60_000,
  })

  const mockCompleted = MOCK_ROUNDS
    .flatMap((r) => r.matches)
    .filter((m) => m.status === 'completed')

  return {
    completedMatches: data ?? mockCompleted,
    isLoading: isLoading && !data,
  }
}
