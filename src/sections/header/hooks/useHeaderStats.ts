'use client'

/**
 * useHeaderStats — header data hook.
 *
 * Trả về:
 *   - liveCount, completedCount: counters cho UI
 *   - currentRound: vòng đấu hiện tại (derive từ matches)
 *   - phaseIndex: index trong TOURNAMENT_ROUNDS (0..6) cho progress dots
 *   - isFinished: giải đã kết thúc chưa
 *
 * Quy tắc xác định currentRound (theo thứ tự ưu tiên):
 *   1. Có live match    → round của trận live mới nhất
 *   2. Có upcoming      → round của trận sắp tới gần nhất
 *   3. Tất cả completed → round cuối cùng (thường là 'final') → isFinished=true
 */

import { useQuery } from '@tanstack/react-query'
import { headerService } from '../services/header.service'
import { queryKeys }     from '@/queries/keys'
import { MOCK_ROUNDS }   from '@/lib/mock'
import { TOURNAMENT_ROUNDS } from '@/constants/tournament'
import { useCompetition } from '@/hooks/useCompetition'
import { mockOr } from '@/utils/env'
import type { Match, TournamentRound } from '@/types/domain.types'

const EMPTY_MATCHES: Match[] = []

export interface UseHeaderStatsReturn {
  liveCount:      number
  completedCount: number
  currentRound:   TournamentRound
  phaseIndex:     number
  isFinished:     boolean
}

/**
 * Lấy round "muộn nhất" trong list matches — dùng cho live (round mới nhất đang đá)
 * hoặc completed (round cuối đã đá xong).
 */
function getLatestRound(matches: Match[]): TournamentRound | null {
  if (matches.length === 0) return null
  let latestIdx = -1
  for (const m of matches) {
    const idx = TOURNAMENT_ROUNDS.indexOf(m.round as TournamentRound)
    if (idx > latestIdx) latestIdx = idx
  }
  return latestIdx >= 0 ? TOURNAMENT_ROUNDS[latestIdx] : null
}

/**
 * Lấy round "sớm nhất" trong list matches — dùng cho upcoming (round sắp diễn ra gần nhất).
 */
function getEarliestRound(matches: Match[]): TournamentRound | null {
  if (matches.length === 0) return null
  let earliestIdx = TOURNAMENT_ROUNDS.length
  for (const m of matches) {
    const idx = TOURNAMENT_ROUNDS.indexOf(m.round as TournamentRound)
    if (idx >= 0 && idx < earliestIdx) earliestIdx = idx
  }
  return earliestIdx < TOURNAMENT_ROUNDS.length ? TOURNAMENT_ROUNDS[earliestIdx] : null
}

export function useHeaderStats(): UseHeaderStatsReturn {
  const { key: compKey, isLive, queryEnabled } = useCompetition()

  // Cùng queryKey với useLiveMatches → share cache (1 request phục vụ cả 2 hooks).
  // Polling chỉ khi giải đang live.
  const { data } = useQuery({
    queryKey:        [...queryKeys.matches.list(), compKey] as const,
    queryFn:         () => headerService.fetchAllMatches(),
    staleTime:       isLive ? 30_000 : Infinity,
    refetchInterval: isLive ? 60_000 : false,
    enabled:         queryEnabled,
  })

  // Dev: mock all matches; Production: empty → "no data yet" UI
  const matches = data ?? mockOr(MOCK_ROUNDS.flatMap((r) => r.matches), EMPTY_MATCHES)

  const liveMatches      = matches.filter((m) => m.status === 'live')
  const upcomingMatches  = matches.filter((m) => m.status === 'upcoming')
  const completedMatches = matches.filter((m) => m.status === 'completed')

  // Xác định vòng đấu hiện tại
  let currentRound: TournamentRound = 'group'
  let isFinished = false

  if (liveMatches.length > 0) {
    currentRound = getLatestRound(liveMatches) ?? 'group'
  } else if (upcomingMatches.length > 0) {
    currentRound = getEarliestRound(upcomingMatches) ?? 'group'
  } else if (completedMatches.length > 0) {
    // Tất cả đã xong → vòng cuối cùng (thường 'final')
    currentRound = getLatestRound(completedMatches) ?? 'final'
    isFinished = true
  }

  const phaseIndex = Math.max(0, TOURNAMENT_ROUNDS.indexOf(currentRound))

  return {
    liveCount:      liveMatches.length,
    completedCount: completedMatches.length,
    currentRound,
    phaseIndex,
    isFinished,
  }
}
