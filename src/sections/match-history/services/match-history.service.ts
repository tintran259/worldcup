/**
 * Match history service — API calls for completed match results.
 *
 * Flow: MatchHistoryTab → useMatchHistory → matchHistoryService → /api/matches?status=completed
 */

import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Match } from '@/types/domain.types'

export const matchHistoryService = {
  /** Fetch all completed matches, newest first. */
  async fetchCompleted(): Promise<Match[]> {
    return apiClient.get<Match[]>(endpoints.matches.list('completed'))
  },
}
