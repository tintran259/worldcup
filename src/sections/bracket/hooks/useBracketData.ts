'use client'

/**
 * useBracketData — primary data hook for the bracket section.
 *
 * Data flow:
 *   BracketCanvas → useBracketData → bracketService → /api/tournament/bracket
 *
 * Fallback: mock MOCK_ROUNDS are used when the API is unavailable
 * so the bracket always renders something meaningful.
 */

import { useQuery } from '@tanstack/react-query'
import { bracketService } from '../services/bracket.service'
import { queryKeys } from '@/queries/keys'
import { MOCK_ROUNDS } from '@/lib/mock'
import type { BracketRound } from '@/types/domain.types'

export interface UseBracketDataReturn {
  rounds: BracketRound[]
  hasLiveMatches: boolean
  liveCount: number
  isLoading: boolean
  isMock: boolean
}

export function useBracketData(): UseBracketDataReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.tournament.bracket(),
    queryFn: () => bracketService.fetchRounds(),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })

  // Fall back to mock data when the API is unavailable
  const rounds: BracketRound[] = data ?? MOCK_ROUNDS

  const allMatches = rounds.flatMap((r) => r.matches)
  const hasLiveMatches = allMatches.some((m) => m.status === 'live')
  const liveCount = allMatches.filter((m) => m.status === 'live').length

  return {
    rounds,
    hasLiveMatches,
    liveCount,
    isLoading: isLoading && !data,
    isMock: isError || !data,
  }
}
