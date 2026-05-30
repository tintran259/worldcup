'use client'

/**
 * useStandings — data hook for the group standings section.
 *
 * Data flow:
 *   StandingsTab → useStandings → standingsService → /api/standings
 */

import { useQuery } from '@tanstack/react-query'
import { standingsService } from '../services/standings.service'
import { queryKeys } from '@/queries/keys'
import { GROUP_STANDINGS } from '@/lib/mock'
import type { GroupStage } from '@/lib/mock/types'

export interface UseStandingsReturn {
  groups: GroupStage[]
  isLoading: boolean
}

export function useStandings(): UseStandingsReturn {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.standings.all,
    queryFn: () => standingsService.fetchAll(),
    staleTime: 300_000,   // standings change slowly — cache for 5 minutes
    refetchInterval: 300_000,
  })

  return {
    groups: (data as GroupStage[] | undefined) ?? GROUP_STANDINGS,
    isLoading: isLoading && !data,
  }
}
