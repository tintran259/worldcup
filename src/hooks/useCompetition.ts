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

import { useEffect, useState } from 'react'
import { getClientConfig, COMPETITIONS } from '@/lib/config'
import { useCompetitionStore } from '@/stores'
import { getCompetitionStatus, type CompetitionStatus } from '@/utils/competition'
import { IS_DEV } from '@/utils/env'
import type { CompetitionKey, CompetitionConfig } from '@/lib/config'

/**
 * DEV-ONLY: Đọc URL param `?testCountdown=<seconds>` để override dateFrom của
 * competition đang chọn. Hữu ích test flow "countdown expire → API fire".
 *
 *   /?testCountdown=30     → wc2026 starts in 30 seconds
 *   /?testCountdown=10     → starts in 10 seconds
 *
 * Override CHỈ client-side và CHỈ dev mode. Production code không bao giờ chạy.
 */
function useTestCountdownOverride(): number | null {
  const [overrideMs, setOverrideMs] = useState<number | null>(null)

  useEffect(() => {
    if (!IS_DEV) return
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const sec = params.get('testCountdown')
    if (!sec) return
    const n = parseInt(sec, 10)
    if (isNaN(n) || n <= 0) return
    // Set target = NOW + n seconds, ONE TIME (không update khi URL đổi)
    setOverrideMs(Date.now() + n * 1000)
    console.log(`[testCountdown] Override active: ${n}s from now`)
  }, [])

  return overrideMs
}

/**
 * Compute effective status, tôn trọng testCountdown override.
 */
function computeStatus(comp: CompetitionConfig, overrideStartMs: number | null): CompetitionStatus {
  if (overrideStartMs != null) {
    const now = Date.now()
    if (now < overrideStartMs) return 'upcoming'
    // Sau khi expire: trả 'live' để trigger fetch (dù real dateFrom có thể khác)
    return 'live'
  }
  return getCompetitionStatus(comp)
}

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
  /** True nếu chưa bắt đầu — hooks DISABLE queries để không gọi API thừa */
  isUpcoming:    boolean
  /**
   * Flag chung cho React Query `enabled` option.
   * False khi giải chưa bắt đầu → không gọi API → tiết kiệm quota.
   */
  queryEnabled:  boolean
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
  const overrideMs = useTestCountdownOverride()

  // Tick mỗi giây khi đang override để re-evaluate status (cho countdown expire trigger)
  const [, setTick] = useState(0)
  useEffect(() => {
    if (overrideMs == null) return
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [overrideMs])

  const selectedComp = selectedKey ? COMPETITIONS[selectedKey as CompetitionKey] : null
  const comp: CompetitionConfig = selectedComp ?? COMPETITIONS[getClientConfig().competition.key as CompetitionKey]

  const { year, title } = parseTitle(comp.name)
  const status = computeStatus(comp, overrideMs)

  const isUpcoming = status === 'upcoming'

  return {
    key:           comp.key,
    name:          comp.name,
    shortName:     comp.shortName,
    hasGroupStage: comp.hasGroupStage,
    year,
    title,
    status,
    isLive:        status === 'live',
    isUpcoming,
    queryEnabled:  !isUpcoming,
  }
}
