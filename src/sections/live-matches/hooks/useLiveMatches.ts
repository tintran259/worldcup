'use client'

/**
 * useLiveMatches — data hook for the live feed section.
 *
 * Data flow:
 *   LiveMatchesTab → useLiveMatches → liveMatchesService → /api/matches
 *
 * Splits the full match list into three buckets: live, upcoming, completed.
 * Refetches every 30 seconds to stay current with live scores.
 */

import { useQuery } from '@tanstack/react-query'
import { liveMatchesService } from '../services/live-matches.service'
import { queryKeys } from '@/queries/keys'
import { MOCK_ROUNDS } from '@/lib/mock'
import type { Match } from '@/types/domain.types'

export interface UseLiveMatchesReturn {
  liveMatches: Match[]
  upcomingMatches: Match[]
  completedMatches: Match[]
  isLoading: boolean
}

export function useLiveMatches(): UseLiveMatchesReturn {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.matches.list(),
    queryFn: () => liveMatchesService.fetchAll(),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  })

  const mockMatches = MOCK_ROUNDS.flatMap((r) => r.matches)
  const matches: Match[] = data ?? mockMatches

  return {
    liveMatches: matches.filter((m) => m.status === 'live'),
    upcomingMatches: matches.filter((m) => m.status === 'upcoming').slice(0, 6),
    completedMatches: matches.filter((m) => m.status === 'completed').slice(0, 3),
    isLoading: isLoading && !data,
  }
}
