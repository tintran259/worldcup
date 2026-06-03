/**
 * Competition utilities — derive trạng thái + date info từ CompetitionConfig.
 */

import type { CompetitionConfig } from '@/lib/config'

export type CompetitionStatus = 'upcoming' | 'live' | 'finished'

export interface CompetitionDates {
  from: Date | null
  to:   Date | null
}

/**
 * Trích date range từ providerIds — dùng entry đầu tiên (mọi provider có cùng date range).
 */
export function getCompetitionDates(comp: CompetitionConfig): CompetitionDates {
  const ids = Object.values(comp.providerIds)[0]
  if (!ids?.dateFrom || !ids?.dateTo) {
    return { from: null, to: null }
  }
  return {
    from: new Date(ids.dateFrom),
    to:   new Date(ids.dateTo),
  }
}

/**
 * Xác định status dựa trên ngày hiện tại.
 *   now < dateFrom    → upcoming
 *   dateFrom..dateTo  → live
 *   now > dateTo      → finished
 *
 * Trả 'finished' làm default nếu không có date range.
 */
export function getCompetitionStatus(comp: CompetitionConfig, now = Date.now()): CompetitionStatus {
  const { from, to } = getCompetitionDates(comp)
  if (!from || !to) return 'finished'

  if (now < from.getTime()) return 'upcoming'
  if (now > to.getTime())   return 'finished'
  return 'live'
}
