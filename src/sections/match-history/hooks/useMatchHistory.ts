'use client'

/**
 * useMatchHistory — data hook for the results/history section.
 *
 * Khi user chọn favorites: chỉ giữ các trận có đội yêu thích.
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { matchHistoryService } from '../services/match-history.service'
import { queryKeys } from '@/queries/keys'
import { MOCK_ROUNDS } from '@/lib/mock'
import { useFavorites } from '@/hooks/useFavorites'
import type { Match } from '@/types/domain.types'

export interface UseMatchHistoryReturn {
  completedMatches: Match[]
  isLoading:        boolean
}

export function useMatchHistory(): UseMatchHistoryReturn {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.matches.list('completed'),
    queryFn:  () => matchHistoryService.fetchCompleted(),
    staleTime: 60_000,
  })

  const mockCompleted = MOCK_ROUNDS
    .flatMap((r) => r.matches)
    .filter((m) => m.status === 'completed')

  const allCompleted = data ?? mockCompleted
  const { matchInvolvesFavorite, hasActiveFilter } = useFavorites()

  const completedMatches = useMemo(() => {
    if (!hasActiveFilter) return allCompleted
    return allCompleted.filter(matchInvolvesFavorite)
  }, [allCompleted, matchInvolvesFavorite, hasActiveFilter])

  return {
    completedMatches,
    isLoading: isLoading && !data,
  }
}
