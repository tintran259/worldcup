'use client'

/**
 * useStats — fetch stats + filter theo favorites.
 *
 * Khi user chọn favorites:
 *   - topScorers: chỉ giữ cầu thủ thuộc đội yêu thích
 *   - teamGoals:  chỉ giữ đội yêu thích
 *   - summary:    giữ nguyên (chỉ số tổng quan toàn giải)
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statsService } from '../services/stats.service'
import { useFavorites } from '@/hooks/useFavorites'
import { useCompetition } from '@/hooks/useCompetition'
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
  const { key: compKey } = useCompetition()

  // KHÔNG polling — stats fetch 1 lần khi đổi competition.
  const { data, isLoading } = useQuery({
    queryKey: ['stats', compKey] as const,
    queryFn: () => statsService.fetch(),
    staleTime: Infinity,
    refetchInterval: false,
  })

  const raw = data ?? EMPTY
  const { favoriteIds, hasActiveFilter } = useFavorites()

  const filtered = useMemo<StatsResponse>(() => {
    // Tổng quan giải đấu giữ nguyên dù có filter hay không
    if (!hasActiveFilter) {
      return {
        summary: raw.summary,
        topScorers: raw.topScorers.slice(0, 5),   // Default top 5
        teamGoals: raw.teamGoals.slice(0, 5),    // Default top 5
      }
    }

    return {
      summary: raw.summary,
      topScorers: raw.topScorers.filter((p) => favoriteIds.has(p.team.id)),
      teamGoals: raw.teamGoals.filter((t) => favoriteIds.has(t.id)),
    }
  }, [raw, favoriteIds, hasActiveFilter])

  const hasData =
    filtered.summary.matchesPlayed > 0 ||
    filtered.topScorers.length > 0 ||
    filtered.teamGoals.length > 0

  return {
    ...filtered,
    isLoading: isLoading && !data,
    hasData,
  }
}
