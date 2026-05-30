'use client'

/**
 * useCompetition — hook đọc thông tin giải đấu đang active.
 *
 * Đọc từ NEXT_PUBLIC_COMPETITION trong .env.
 * Tự động cập nhật khi đổi `FOOTBALL_COMPETITION` + restart dev server.
 *
 * Trả về:
 *   name      - "FIFA World Cup 2022"
 *   shortName - "World Cup 2022"
 *   year      - "2022" (parse từ name)
 *   title     - "World Cup" (tên giải, bỏ năm)
 */

import { getClientConfig } from '@/lib/config'

export interface CompetitionInfo {
  /** Tên đầy đủ — "FIFA World Cup 2022" */
  name: string
  /** Tên ngắn — "World Cup 2022" */
  shortName: string
  /** Năm/season — "2022" */
  year: string
  /** Tên giải không kèm năm — "World Cup" */
  title: string
  /** Có vòng bảng không */
  hasGroupStage: boolean
}

/**
 * Tách năm/season từ tên giải.
 * "FIFA World Cup 2022" → year: "2022", title: "FIFA World Cup"
 * "UEFA Champions League 2023-24" → year: "2023-24", title: "UEFA Champions League"
 */
function parseTitle(name: string): { year: string; title: string } {
  const match = name.match(/(\d{4}(?:-\d{2,4})?)\s*$/)
  if (!match) return { year: '', title: name }
  return {
    year: match[1],
    title: name.slice(0, match.index).trim(),
  }
}

export function useCompetition(): CompetitionInfo {
  const cfg = getClientConfig()
  const { year, title } = parseTitle(cfg.competition.name)

  return {
    name: cfg.competition.name,
    shortName: cfg.competition.shortName,
    year,
    title,
    hasGroupStage: cfg.competition.hasGroupStage,
  }
}
