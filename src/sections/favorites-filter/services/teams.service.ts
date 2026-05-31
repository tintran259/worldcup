import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Team } from '@/types/domain.types'

export const favoritesTeamsService = {
  async fetchAll(): Promise<Team[]> {
    return apiClient.get<Team[]>(endpoints.teams.list)
  },
}
