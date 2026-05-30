/**
 * Team detail service — fetch team profile + squad + matches.
 *
 * Backed by:
 *   GET /api/teams/:id?squad=1   → team + squad
 *   GET /api/matches?teamId=:id  → matches of that team
 */

import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Match } from '@/types/domain.types'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'

export interface TeamWithSquad extends ExtendedTeam {
  squad?: StarPlayer[]
}

export const teamService = {
  async fetchTeam(teamId: string): Promise<TeamWithSquad> {
    return apiClient.get<TeamWithSquad>(endpoints.teams.withSquad(teamId))
  },

  async fetchMatches(teamId: string): Promise<Match[]> {
    return apiClient.get<Match[]>(endpoints.matches.byTeam(teamId))
  },
}
