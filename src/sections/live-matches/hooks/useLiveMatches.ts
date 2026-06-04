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
import { useCompetition } from '@/hooks/useCompetition'
import { mockOr } from '@/utils/env'
import type { Match } from '@/types/domain.types'

const EMPTY_MATCHES: Match[] = []

export interface UseLiveMatchesReturn {
  liveMatches: Match[]
  upcomingMatches: Match[]
  completedMatches: Match[]
  isLoading: boolean
}

export function useLiveMatches(): UseLiveMatchesReturn {
  const { key: compKey, isLive, queryEnabled } = useCompetition()

  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.matches.list(), compKey] as const,
    queryFn: () => liveMatchesService.fetchAll(),
    // Giải đã xong → data tĩnh, không cần polling.
    // Giải đang live → poll 60s (đã giảm từ 30s để tiết kiệm quota).
    staleTime: isLive ? 30_000 : Infinity,
    refetchInterval: isLive ? 60_000 : false,
    enabled: queryEnabled,
  })

  // Dev: mock data để UI có gì hiển thị khi API chưa wire.
  // Production: empty → user thấy empty state thật, không che lỗi/loading.
  const matches: Match[] = data ?? mockOr(MOCK_ROUNDS.flatMap((r) => r.matches), EMPTY_MATCHES)

  const { matchInvolvesFavorite, hasActiveFilter } = useFavorites()

  return useMemo(() => {
    // Live luôn được giữ — không filter
    const live = matches.filter((m) => m.status === 'live')

    let upcoming = matches.filter((m) => m.status === 'upcoming')
    let completed = matches.filter((m) => m.status === 'completed')

    if (hasActiveFilter) {
      upcoming = upcoming.filter(matchInvolvesFavorite)
      completed = completed.filter(matchInvolvesFavorite)
    }

    return {
      liveMatches: live,
      upcomingMatches: upcoming.slice(0, 6),
      completedMatches: completed.slice(0, 3),
      isLoading: isLoading && !data,
    }
  }, [matches, matchInvolvesFavorite, hasActiveFilter, isLoading, data])
}
