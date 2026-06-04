'use client'

/**
 * useStandings — data hook for the group standings section.
 *
 * Data flow:
 *   StandingsTab → useStandings → standingsService → /api/standings
 *
 * Khi user chọn favorites: chỉ giữ các bảng đấu chứa ít nhất 1 đội yêu thích.
 * Các đội khác trong cùng bảng đó vẫn được hiển thị (để xem context).
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { standingsService } from '../services/standings.service'
import { queryKeys } from '@/queries/keys'
import { GROUP_STANDINGS } from '@/lib/mock'
import { useFavorites } from '@/hooks/useFavorites'
import { useCompetition } from '@/hooks/useCompetition'
import { mockOr } from '@/utils/env'
import type { GroupStage } from '@/lib/mock/types'

const EMPTY_GROUPS: GroupStage[] = []

export interface UseStandingsReturn {
  groups: GroupStage[]
  isLoading: boolean
}

export function useStandings(): UseStandingsReturn {
  const { key: compKey, queryEnabled } = useCompetition()

  // KHÔNG polling — standings chỉ fetch 1 lần khi đổi competition.
  // User phải reload trang nếu muốn cập nhật.
  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.standings.all, compKey] as const,
    queryFn: () => standingsService.fetchAll(),
    staleTime: Infinity,
    refetchInterval: false,
    enabled: queryEnabled,
  })

  // Dev: mock GROUP_STANDINGS để UI luôn có data hiển thị.
  // Production: empty → user thấy "No standings" state thật.
  const allGroups = (data as GroupStage[] | undefined) ?? mockOr(GROUP_STANDINGS, EMPTY_GROUPS)
  const { favoriteIds, hasActiveFilter } = useFavorites()

  const groups = useMemo(() => {
    if (!hasActiveFilter) return allGroups
    return allGroups.filter((g) =>
      g.teams.some((row) => favoriteIds.has(row.team.id)),
    )
  }, [allGroups, favoriteIds, hasActiveFilter])

  return {
    groups,
    isLoading: isLoading && !data,
  }
}
