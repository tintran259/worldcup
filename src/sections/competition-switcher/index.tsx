'use client'

/**
 * CompetitionSwitcher — modal cho user chọn giải đấu khác (runtime).
 *
 * Mở qua useCompetitionStore.openModal().
 * Khi chọn 1 giải → store cập nhật → apiClient tự gắn query → BFF dùng giải mới.
 * React Query cache invalidate qua useCompetition() ở queryKey.
 */

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { useCompetitionStore, useDataSourceStore } from '@/stores'
import { useCountdown } from '@/hooks/useCountdown'
import { COMPETITIONS } from '@/lib/config'
import { getClientConfig } from '@/lib/config'
import {
  getCompetitionStatus,
  getCompetitionDates,
  type CompetitionStatus,
} from '@/utils/competition'
import { backdropVariants, sheetVariants, rowVariants } from './animations/modal'
import {
  Backdrop, Sheet, GrabHandle, Header, TitleBlock, Title, Subtitle, CloseBtn,
  List, Card, CardTop, CardName, StatusBadge, DateRange,
  Countdown, CountdownLabel, CountdownUnits, CountUnit, CountValue, CountSuffix,
  SelectedDot,
} from './styles'

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<CompetitionStatus, string> = {
  upcoming: '🟡 Sắp diễn ra',
  live: '🔴 Đang diễn ra',
  finished: '⏹ Đã kết thúc',
}

function formatDateRange(from: Date | null, to: Date | null): string {
  if (!from || !to) return 'Chưa có lịch'
  const fmt = (d: Date) =>
    d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
  return `${fmt(from)} → ${fmt(to)}`
}

// ── Countdown row (chỉ render cho upcoming) ──────────────────────────────────

function CompetitionCountdown({ target }: { target: Date }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(target)

  if (isExpired) return null

  return (
    <Countdown>
      <CountdownLabel>Bắt đầu sau</CountdownLabel>
      <CountdownUnits>
        <CountUnit><CountValue>{days}</CountValue><CountSuffix>d</CountSuffix></CountUnit>
        <CountUnit><CountValue>{String(hours).padStart(2, '0')}</CountValue><CountSuffix>h</CountSuffix></CountUnit>
        <CountUnit><CountValue>{String(minutes).padStart(2, '0')}</CountValue><CountSuffix>m</CountSuffix></CountUnit>
        <CountUnit><CountValue>{String(seconds).padStart(2, '0')}</CountValue><CountSuffix>s</CountSuffix></CountUnit>
      </CountdownUnits>
    </Countdown>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CompetitionSwitcher() {
  const { isModalOpen, closeModal, selectedKey, selectCompetition } = useCompetitionStore()
  const queryClient = useQueryClient()

  // Hydration-safe portal
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Đóng bằng Escape
  useEffect(() => {
    if (!isModalOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isModalOpen, closeModal])

  // Lock body scroll
  useEffect(() => {
    if (!isModalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isModalOpen])

  // Sort giải đấu: live → upcoming → finished (mới nhất trước)
  const competitions = useMemo(() => {
    return Object.values(COMPETITIONS).map((c) => ({
      ...c,
      status: getCompetitionStatus(c),
      dates: getCompetitionDates(c),
    })).sort((a, b) => {
      const order: Record<CompetitionStatus, number> = { live: 0, upcoming: 1, finished: 2 }
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
      // Cùng status: sort theo ngày bắt đầu giảm dần (mới hơn lên trước)
      const ta = a.dates.from?.getTime() ?? 0
      const tb = b.dates.from?.getTime() ?? 0
      return tb - ta
    })
  }, [])

  // Active key = user choice OR env default
  const activeKey = selectedKey ?? getClientConfig().competition.key

  function handleSelect(key: string) {
    selectCompetition(key)

    // Reset data source flag — giải mới có thể hit quota/empty data,
    // banner cần được fire lại cho dù user đã dismiss ở giải trước.
    useDataSourceStore.getState().reset()

    // Không cần invalidateQueries vì queryKey đã include competition.key
    // → đổi key tự động trigger refetch ở queryKey mới + giữ cache giải cũ.
    // Cleanup queries cũ sau 10 phút (gcTime default).
    void queryClient
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <Backdrop
          key="comp-backdrop"
          variants={backdropVariants}
          initial="hidden" animate="visible" exit="exit"
          onClick={closeModal}
        >
          <Sheet
            key="comp-sheet"
            variants={sheetVariants}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label="Chọn giải đấu"
          >
            <GrabHandle aria-hidden="true" />

            <Header>
              <TitleBlock>
                <Title>Chọn giải đấu</Title>
                <Subtitle>{competitions.length} giải khả dụng</Subtitle>
              </TitleBlock>
              <CloseBtn onClick={closeModal} aria-label="Đóng">✕</CloseBtn>
            </Header>

            <List>
              {competitions.map((comp, idx) => {
                const isSelected = comp.key === activeKey
                // Upcoming vẫn cho chọn — sẽ show countdown modal blocking
                // cho tới khi giải bắt đầu, hết countdown tự fetch API.
                return (
                  <Card
                    key={comp.key}
                    $selected={isSelected}
                    $status={comp.status}
                    $disabled={false}
                    custom={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleSelect(comp.key)}
                    whileTap={{ scale: 0.98 }}
                    title={comp.status === 'upcoming' ? 'Giải đấu chưa bắt đầu — sẽ hiện countdown' : undefined}
                  >
                    <CardTop>
                      <CardName>{comp.name}</CardName>
                      <StatusBadge $status={comp.status}>
                        {STATUS_LABEL[comp.status]}
                      </StatusBadge>
                      <SelectedDot $visible={isSelected} aria-hidden="true">✓</SelectedDot>
                    </CardTop>

                    <DateRange>
                      {formatDateRange(comp.dates.from, comp.dates.to)}
                    </DateRange>

                    {/* Countdown chỉ hiển thị cho upcoming */}
                    {comp.status === 'upcoming' && comp.dates.from && (
                      <CompetitionCountdown target={comp.dates.from} />
                    )}
                  </Card>
                )
              })}
            </List>
          </Sheet>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  )
}
