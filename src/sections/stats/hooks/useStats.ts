'use client'

/**
 * useStats — fetch stats summary + top scorers + team goals.
 *
 * Data flow:
 *   StatsTab → useStats → statsService → /api/stats
 */

import { useQuery } from '@tanstack/react-query'
import { statsService } from '../services/stats.service'
import type { StatsResponse } from '../services/stats.service'

const EMPTY: StatsResponse = {
  summary: { goalsScored: 0, matchesPlayed: 0, goalsPerMatch: 0, teamsRemaining: 0 },
  topScorers: [],
  teamGoals: [],
}

export interface UseStatsReturn extends StatsResponse {
  isLoading: boolean
  hasData: boolean
}

export function useStats(): UseStatsReturn {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'] as const,
    queryFn: () => statsService.fetch(),
    staleTime: 300_000,   // 5 phút
  })

  const stats = data ?? EMPTY
  const hasData =
    stats.summary.matchesPlayed > 0 ||
    stats.topScorers.length > 0 ||
    stats.teamGoals.length > 0

  return {
    ...stats,
    isLoading: isLoading && !data,
    hasData,
  }
}
