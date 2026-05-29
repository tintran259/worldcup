import { queryKeys } from './keys'
import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Tournament, Group } from '@/types/domain.types'

export const tournamentBracketQuery = {
  queryKey: queryKeys.tournament.bracket(),
  queryFn: () => apiClient.get<Tournament>(endpoints.tournament.bracket),
  staleTime: 30_000,
}

export const tournamentStandingsQuery = {
  queryKey: queryKeys.tournament.standings(),
  queryFn: () => apiClient.get<Group[]>(endpoints.tournament.standings),
  staleTime: 60_000,
}
