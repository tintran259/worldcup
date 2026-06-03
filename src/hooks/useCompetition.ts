'use client'

/**
 * useCompetition — hook đọc thông tin giải đấu đang active.
 *
 * Ưu tiên:
 *   1. competitionStore (user chọn qua CompetitionSwitcher)
 *   2. NEXT_PUBLIC_COMPETITION từ env (default)
 *
 * Trả về thêm `status` để hooks khác quyết định có poll hay không:
 *   - 'live'     → đang diễn ra, NÊN poll
 *   - 'finished' → đã xong, KHÔNG cần poll (data tĩnh)
 *   - 'upcoming' → chưa bắt đầu (đã disable trong switcher)
 */

import { getClientConfig, COMPETITIONS } from '@/lib/config'
import { useCompetitionStore } from '@/stores'
import { getCompetitionStatus, type CompetitionStatus } from '@/utils/competition'
import type { CompetitionKey, CompetitionConfig } from '@/lib/config'

export interface CompetitionInfo {
  /** Key (wc2026, ucl, premier-league...) */
  key:           string
  /** Tên đầy đủ — "FIFA World Cup 2022" */
  name:          string
  /** Tên ngắn — "World Cup 2022" */
  shortName:     string
  /** Năm/season — "2022" */
  year:          string
  /** Tên giải không kèm năm — "FIFA World Cup" */
  title:         string
  /** Có vòng bảng không */
  hasGroupStage: boolean
  /** Trạng thái: live / upcoming / finished */
  status:        CompetitionStatus
  /** True nếu đang live — hooks dùng để quyết định polling */
  isLive:        boolean
}

function parseTitle(name: string): { year: string; title: string } {
  const match = name.match(/(\d{4}(?:-\d{2,4})?)\s*$/)
  if (!match) return { year: '', title: name }
  return {
    year:  match[1],
    title: name.slice(0, match.index).trim(),
  }
}

export function useCompetition(): CompetitionInfo {
  const selectedKey = useCompetitionStore((s) => s.selectedKey)

  const selectedComp = selectedKey ? COMPETITIONS[selectedKey as CompetitionKey] : null
  const comp: CompetitionConfig = selectedComp ?? COMPETITIONS[getClientConfig().competition.key as CompetitionKey]

  const { year, title } = parseTitle(comp.name)
  const status = getCompetitionStatus(comp)

  return {
    key:           comp.key,
    name:          comp.name,
    shortName:     comp.shortName,
    hasGroupStage: comp.hasGroupStage,
    year,
    title,
    status,
    isLive:        status === 'live',
  }
}
