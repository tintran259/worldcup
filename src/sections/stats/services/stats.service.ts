/**
 * Stats service — gọi /api/stats.
 */

import { apiClient } from '@/lib/api/client'
import type { StatsResponse } from '@/app/api/stats/route'

export type { StatsResponse }

export const statsService = {
  async fetch(): Promise<StatsResponse> {
    return apiClient.get<StatsResponse>('/stats')
  },
}
