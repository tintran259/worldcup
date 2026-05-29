import { queryKeys } from './keys'
import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Match, MatchDetail } from '@/types/domain.types'

export const liveMatchesQuery = {
  queryKey: queryKeys.matches.live(),
  queryFn: () => apiClient.get<Match[]>(endpoints.matches.live),
  refetchInterval: 30_000,
  refetchIntervalInBackground: true,
  staleTime: 0,
}

export const matchDetailQuery = (matchId: string) => ({
  queryKey: queryKeys.matches.detail(matchId),
  queryFn: () => apiClient.get<MatchDetail>(endpoints.matches.detail(matchId)),
  staleTime: 30_000,
  refetchInterval: (query: { state: { data: MatchDetail | undefined } }) =>
    query.state.data?.status === 'live' ? 15_000 : false,
  enabled: !!matchId,
})
