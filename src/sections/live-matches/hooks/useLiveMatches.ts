'use client'

/**
 * useLiveMatches — data hook for the live feed section.
 *
 * Quy tắc filter theo favorites:
 *   - Live matches:      LUÔN giữ nguyên (user yêu cầu)
 *   - Upcoming:          filter theo favorites
 *   - Completed:         filter theo favorites
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { liveMatchesService } from '../services/live-matches.service'
import { queryKeys } from '@/queries/keys'
import { MOCK_ROUNDS } from '@/lib/mock'
import { useFavorites } from '@/hooks/useFavorites'
import type { Match } from '@/types/domain.types'

export interface UseLiveMatchesReturn {
  liveMatches:      Match[]
  upcomingMatches:  Match[]
  completedMatches: Match[]
  isLoading:        boolean
}

export function useLiveMatches(): UseLiveMatchesReturn {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.matches.list(),
    queryFn:  () => liveMatchesService.fetchAll(),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  })

  const mockMatches = MOCK_ROUNDS.flatMap((r) => r.matches)
  const matches: Match[] = data ?? mockMatches

  const { matchInvolvesFavorite, hasActiveFilter } = useFavorites()

  return useMemo(() => {
    // Live luôn được giữ — không filter
    const live = matches.filter((m) => m.status === 'live')

    let upcoming  = matches.filter((m) => m.status === 'upcoming')
    let completed = matches.filter((m) => m.status === 'completed')

    if (hasActiveFilter) {
      upcoming  = upcoming.filter(matchInvolvesFavorite)
      completed = completed.filter(matchInvolvesFavorite)
    }

    return {
      liveMatches:      live,
      upcomingMatches:  upcoming.slice(0, 6),
      completedMatches: completed.slice(0, 3),
      isLoading:        isLoading && !data,
    }
  }, [matches, matchInvolvesFavorite, hasActiveFilter, isLoading, data])
}
