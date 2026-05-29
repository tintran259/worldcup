import { queryKeys } from './keys'
import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Team, TeamStats } from '@/types/domain.types'

export const teamDetailQuery = (teamId: string) => ({
  queryKey: queryKeys.teams.detail(teamId),
  queryFn: () => apiClient.get<Team>(endpoints.teams.detail(teamId)),
  staleTime: 5 * 60_000,
  enabled: !!teamId,
})

export const teamStatsQuery = (teamId: string) => ({
  queryKey: queryKeys.teams.stats(teamId),
  queryFn: () => apiClient.get<TeamStats>(endpoints.teams.stats(teamId)),
  staleTime: 5 * 60_000,
  enabled: !!teamId,
})
