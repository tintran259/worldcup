'use client'

/**
 * useBracketData — primary data hook for the bracket section.
 *
 * Data flow:
 *   BracketCanvas → useBracketData → bracketService → /api/tournament/bracket
 *
 * Fallback:
 *   Dev: MOCK_ROUNDS để UI luôn có data render — tiện build feature.
 *   Production: empty array — user thấy empty state thật, không che lỗi.
 */

import { useQuery } from '@tanstack/react-query'
import { bracketService } from '../services/bracket.service'
import { queryKeys } from '@/queries/keys'
import { MOCK_ROUNDS } from '@/lib/mock'
import { useCompetition } from '@/hooks/useCompetition'
import { mockOr } from '@/utils/env'
import type { BracketRound } from '@/types/domain.types'

const EMPTY_ROUNDS: BracketRound[] = []

export interface UseBracketDataReturn {
  rounds: BracketRound[]
  hasLiveMatches: boolean
  liveCount: number
  isLoading: boolean
  isMock: boolean
}

export function useBracketData(): UseBracketDataReturn {
  const { key: compKey } = useCompetition()

  const { data, isLoading, isError } = useQuery({
    queryKey: [...queryKeys.tournament.bracket(), compKey] as const,
    queryFn: () => bracketService.fetchRounds(),
    staleTime: Infinity,
    refetchInterval: false,
  })

  const rounds: BracketRound[] = data ?? mockOr(MOCK_ROUNDS, EMPTY_ROUNDS)

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
