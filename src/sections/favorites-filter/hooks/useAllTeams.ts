'use client'

import { useQuery } from '@tanstack/react-query'
import { favoritesTeamsService } from '../services/teams.service'
import type { Team } from '@/types/domain.types'

export function useAllTeams() {
  const { data, isLoading } = useQuery({
    queryKey: ['teams', 'all'] as const,
    queryFn: () => favoritesTeamsService.fetchAll(),
    staleTime: 3_600_000,   // 1h — team list rất ít đổi
  })

  return {
    teams: (data ?? []) as Team[],
    isLoading: isLoading && !data,
  }
}
