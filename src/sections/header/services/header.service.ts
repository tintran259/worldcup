/**
 * Header service — fetches match counts for the header status bar.
 *
 * Flow: Header → useHeaderStats → headerService → /api/matches
 */

import { apiClient } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import type { Match } from '@/types/domain.types'

export const headerService = {
  /**
   * Fetch all matches to derive live and completed counts.
   * The header only needs counts — the full match objects are discarded.
   */
  async fetchAllMatches(): Promise<Match[]> {
    return apiClient.get<Match[]>(endpoints.matches.list())
  },
}
