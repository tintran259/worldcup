/**
 * Bracket service — handles all API communication for the bracket section.
 *
 * Components must never call API directly.
 * Hooks consume this service and expose data to components.
 *
 * Flow: BracketCanvas → useBracketData → bracketService → /api/tournament/bracket
 */

import { apiClient } from '@/lib/api/client'
import type { BracketRound } from '@/types/domain.types'

export const bracketService = {
  /**
   * Fetch all tournament rounds with their matches, grouped by round type.
   * Returns in bracket-column order (group → R32 → R16 → QF → SF → Final).
   */
  async fetchRounds(): Promise<BracketRound[]> {
    return apiClient.get<BracketRound[]>('/tournament/bracket')
  },
}
