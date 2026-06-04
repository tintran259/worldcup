'use client'

/**
 * useTeamDetail — fetch full team data (profile + squad + matches).
 *
 * Tự bật/tắt khi modal open/close để tránh fetch không cần thiết.
 * Cache lâu (1h) vì team data ít đổi.
 */

import { useQuery } from '@tanstack/react-query'
import { teamService } from '../services/team.service'
import { useCompetition } from '@/hooks/useCompetition'
import type { Match } from '@/types/domain.types'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'

export interface UseTeamDetailReturn {
  team: ExtendedTeam | null
  players: StarPlayer[]
  matches: Match[]
  isLoading: boolean
  isError: boolean
}

export function useTeamDetail(teamId: string | null): UseTeamDetailReturn {
  const { key: compKey, queryEnabled } = useCompetition()
  // Cần cả teamId VÀ competition không upcoming
  const enabled = !!teamId && queryEnabled

  const teamQuery = useQuery({
    queryKey: ['team-detail', teamId, compKey] as const,
    queryFn: () => teamService.fetchTeam(teamId!),
    enabled,
    staleTime: 3_600_000,   // 1h
  })

  const matchesQuery = useQuery({
    queryKey: ['team-matches', teamId, compKey] as const,
    queryFn: () => teamService.fetchMatches(teamId!),
    enabled,
    staleTime: 600_000,     // 10 phút
  })

  return {
    team: teamQuery.data ?? null,
    players: teamQuery.data?.squad ?? [],
    matches: matchesQuery.data ?? [],
    isLoading: (teamQuery.isLoading || matchesQuery.isLoading) && !teamQuery.data,
    isError: teamQuery.isError || matchesQuery.isError,
  }
}
