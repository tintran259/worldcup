'use client'

/**
 * useFavorites — helper hook để các sections check team có nằm trong favorites không.
 *
 * Hook này wrap useFavoritesStore để optimize:
 *   - Chỉ trả về Set<string> để check O(1) thay vì array.includes
 *   - Trả về hasActiveFilter dạng boolean ổn định
 */

import { useMemo } from 'react'
import { useFavoritesStore } from '@/stores'
import type { Match } from '@/types/domain.types'

export interface UseFavoritesReturn {
  /** Set IDs để check O(1) */
  favoriteIds:     Set<string>
  /** Array IDs (preserve thứ tự chọn) */
  favoriteIdList:  string[]
  /** Có ít nhất 1 team được chọn */
  hasActiveFilter: boolean
  /** Helper — match có dính team yêu thích không */
  matchInvolvesFavorite: (match: Match) => boolean
}

export function useFavorites(): UseFavoritesReturn {
  const teamIds = useFavoritesStore((s) => s.teamIds)

  return useMemo(() => {
    const set = new Set(teamIds)
    return {
      favoriteIds:     set,
      favoriteIdList:  teamIds,
      hasActiveFilter: set.size > 0,
      matchInvolvesFavorite: (m: Match) =>
        (!!m.homeTeam && set.has(m.homeTeam.id)) ||
        (!!m.awayTeam && set.has(m.awayTeam.id)),
    }
  }, [teamIds])
}
