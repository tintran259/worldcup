'use client'

/**
 * UpcomingCompetitionModal — blocking modal khi user chọn giải đấu chưa diễn ra.
 *
 * Flow:
 *   1. User chọn wc2026 trong CompetitionSwitcher → competitionStore set
 *   2. useCompetition status === 'upcoming' → modal render full-screen
 *   3. UI bên dưới bị block (z-index cao nhất, không có exit ngoài button)
 *   4. Countdown chạy mỗi giây tới ngày bắt đầu
 *   5. Khi countdown = 0 → auto-fire `onStart()`:
 *      - Invalidate tất cả React Query cache → refetch với competition mới
 *      - Modal tự dismiss (useCompetition giờ trả status='live')
 *   6. User click "Chọn giải đấu khác" → mở CompetitionSwitcher → đổi giải
 */

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { useCompetition } from '@/hooks/useCompetition'
import { useCompetitionStore } from '@/stores'
import { useCountdown } from '@/hooks/useCountdown'
import { COMPETITIONS } from '@/lib/config'
import { getCompetitionDates } from '@/utils/competition'
import { IS_DEV } from '@/utils/env'
import type { CompetitionKey } from '@/lib/config'
import { backdropVariants, panelVariants, digitVariants } from './animations/modal'
import {
  Backdrop, Panel, GlowOrb, BadgeTag, TournamentName, SubText,
  CountdownLabel, CountGrid, CountCard, CountNum, CountLabel,
  StartDateRow, StartDateValue, ChooseAnotherBtn, StartingNowPulse,
} from './styles'

function formatStartDate(d: Date | null): string {
  if (!d) return '—'
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function UpcomingCompetitionModal() {
  const { key: compKey, name: compName, status } = useCompetition()
  const queryClient = useQueryClient()
  const { openModal: openSwitcher } = useCompetitionStore()

  // Hydration-safe portal mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Compute start date — tôn trọng URL param ?testCountdown=<sec> (dev only)
  const comp = COMPETITIONS[compKey as CompetitionKey]
  const realStart = comp ? getCompetitionDates(comp).from : null

  // Đọc test override 1 lần khi mount; KHÔNG re-evaluate để target ổn định
  const startDate = useMemo<Date | null>(() => {
    if (IS_DEV && typeof window !== 'undefined') {
      const sec = new URLSearchParams(window.location.search).get('testCountdown')
      const n = sec ? parseInt(sec, 10) : NaN
      if (!isNaN(n) && n > 0) {
        return new Date(Date.now() + n * 1000)
      }
    }
    return realStart
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compKey])

  const { days, hours, minutes, seconds, isExpired } = useCountdown(startDate)

  // Khi countdown hết → invalidate tất cả queries → API call với competition đã bắt đầu
  // (status check ở useCompetition sẽ tự đổi từ 'upcoming' sang 'live' theo time)
  useEffect(() => {
    if (status !== 'upcoming') return
    if (!isExpired) return
    console.log(`[UpcomingModal] Countdown expired for "${compKey}" — invalidating queries`)
    queryClient.invalidateQueries()
  }, [isExpired, status, compKey, queryClient])

  // Lock body scroll khi modal show
  useEffect(() => {
    if (status !== 'upcoming') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [status])

  if (!mounted) return null

  // Chỉ show khi status === 'upcoming' VÀ chưa expired
  const show = status === 'upcoming' && !isExpired
  // Khi vừa expired (vài giây transition): hiện "starting now" rồi đóng
  const showStartingNow = status === 'upcoming' && isExpired

  return createPortal(
    <AnimatePresence>
      {(show || showStartingNow) && (
        <Backdrop
          key="upcoming-backdrop"
          variants={backdropVariants}
          initial="hidden" animate="visible" exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label={`${compName} chưa bắt đầu`}
        >
          <Panel variants={panelVariants} initial="hidden" animate="visible" exit="exit">
            <GlowOrb aria-hidden="true" />

            <BadgeTag>🟡 Sắp diễn ra</BadgeTag>
            <TournamentName>{compName}</TournamentName>
            <SubText>Giải đấu chưa bắt đầu. Mời bạn chờ đến giờ khai mạc.</SubText>

            {show ? (
              <>
                <CountdownLabel>Đếm ngược tới giờ bóng lăn</CountdownLabel>
                <CountGrid>
                  <CountCard>
                    <CountNum
                      key={`d-${days}`}
                      variants={digitVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {days}
                    </CountNum>
                    <CountLabel>Ngày</CountLabel>
                  </CountCard>
                  <CountCard>
                    <CountNum
                      key={`h-${hours}`}
                      variants={digitVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {String(hours).padStart(2, '0')}
                    </CountNum>
                    <CountLabel>Giờ</CountLabel>
                  </CountCard>
                  <CountCard>
                    <CountNum
                      key={`m-${minutes}`}
                      variants={digitVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {String(minutes).padStart(2, '0')}
                    </CountNum>
                    <CountLabel>Phút</CountLabel>
                  </CountCard>
                  <CountCard>
                    <CountNum
                      key={`s-${seconds}`}
                      variants={digitVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {String(seconds).padStart(2, '0')}
                    </CountNum>
                    <CountLabel>Giây</CountLabel>
                  </CountCard>
                </CountGrid>

                <StartDateRow>
                  <span>Khai mạc:</span>
                  <StartDateValue>{formatStartDate(startDate)}</StartDateValue>
                </StartDateRow>

                <ChooseAnotherBtn
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openSwitcher}
                >
                  ⚽ Chọn giải đấu khác
                </ChooseAnotherBtn>
              </>
            ) : (
              <StartingNowPulse
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎉 Giải đấu đang bắt đầu...
              </StartingNowPulse>
            )}
          </Panel>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  )
}
