/**
 * Standings service — API calls for group stage standings.
 *
 * Flow: StandingsTab → useStandings → standingsService → /api/standings
 */

import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { GroupStage } from '@/lib/mock/types'

export const standingsService = {
  /** Fetch standings for all groups. */
  async fetchAll(): Promise<GroupStage[]> {
    return apiClient.get<GroupStage[]>(endpoints.tournament.standings)
  },

  /** Fetch standings for a single group by letter (e.g. "A", "B"). */
  async fetchGroup(groupId: string): Promise<GroupStage> {
    return apiClient.get<GroupStage>(endpoints.standings.group(groupId))
  },
}
