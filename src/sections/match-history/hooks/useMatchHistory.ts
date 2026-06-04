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
import { useCompetition } from '@/hooks/useCompetition'
import { mockOr } from '@/utils/env'
import type { Match } from '@/types/domain.types'

const EMPTY_MATCHES: Match[] = []

export interface UseMatchHistoryReturn {
  completedMatches: Match[]
  isLoading: boolean
}

export function useMatchHistory(): UseMatchHistoryReturn {
  const { key: compKey, queryEnabled } = useCompetition()

  // KHÔNG polling — trận đã kết thúc không thay đổi.
  // Fetch 1 lần khi đổi competition rồi giữ vĩnh viễn.
  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.matches.list('completed'), compKey] as const,
    queryFn: () => matchHistoryService.fetchCompleted(),
    staleTime: Infinity,
    refetchInterval: false,
    enabled: queryEnabled,
  })

  // Dev: mock completed matches; Production: empty array
  const fallback = mockOr(
    MOCK_ROUNDS.flatMap((r) => r.matches).filter((m) => m.status === 'completed'),
    EMPTY_MATCHES,
  )
  const allCompleted = data ?? fallback
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
