/**
 * Live matches service — all API calls for the live feed section.
 *
 * Flow: LiveMatchesTab → useLiveMatches → liveMatchesService → /api/matches
 */

import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Match } from '@/types/domain.types'

export const liveMatchesService = {
  /** Fetch all matches (live + upcoming + completed). */
  async fetchAll(): Promise<Match[]> {
    return apiClient.get<Match[]>(endpoints.matches.list())
  },

  /** Fetch only live matches — used for quick polling. */
  async fetchLive(): Promise<Match[]> {
    return apiClient.get<Match[]>(endpoints.matches.live)
  },
}
