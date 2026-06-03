'use client'

/**
 * QuotaBanner — popup thông báo khi BFF fallback về mock data.
 *
 * Hiển thị khi:
 *   - API-Football hết quota (free tier 100 req/day)
 *   - Không có API key trong .env
 *   - Provider API down
 *
 * User có thể dismiss → không hiển thị lại trong session hiện tại.
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useDataSourceStore } from '@/stores'
import type { MockReason } from '@/stores'
import {
  Backdrop, Popup, Header, IconCircle, TitleBlock, Title, Subtitle, CloseBtn,
  Body, Description, InfoCard, InfoLabel, InfoValue,
  Footer, PrimaryBtn, SecondaryBtn,
} from './styles'

// ── Animation variants ────────────────────────────────────────────────────────

const backdropV = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

const popupV = {
  hidden:  { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.16 } },
}

// ── Content per reason ────────────────────────────────────────────────────────

interface Content {
  icon:        string
  severity:    'warning' | 'info'
  title:       string
  subtitle:    string
  description: string
  primaryLabel: string
  primaryHref?: string
}

const CONTENT: Record<MockReason, Content> = {
  'quota-exceeded': {
    icon:        '⚠️',
    severity:    'warning',
    title:       'Hết quota API miễn phí',
    subtitle:    'API-Football · 100 requests/day',
    description:
      'Bạn đã dùng hết số request miễn phí cho hôm nay. App đang hiển thị dữ liệu mock để bạn vẫn có thể trải nghiệm. Quota sẽ reset vào 00:00 UTC ngày mai, hoặc bạn có thể nâng cấp plan.',
    primaryLabel: 'Nâng cấp plan',
    primaryHref:  'https://dashboard.api-football.com/pricing',
  },
  'no-credentials': {
    icon:        '🔑',
    severity:    'info',
    title:       'Chưa cấu hình API key',
    subtitle:    'Demo mode · Mock data',
    description:
      'Bạn đang chạy app ở chế độ demo với dữ liệu mock. Để dùng dữ liệu thật, đăng ký API-Football miễn phí và thêm key vào file .env.local.',
    primaryLabel: 'Đăng ký API key',
    primaryHref:  'https://dashboard.api-football.com/register',
  },
  'provider-error': {
    icon:        '⚡',
    severity:    'warning',
    title:       'Provider tạm thời không phản hồi',
    subtitle:    'Đang dùng dữ liệu mock',
    description:
      'API provider gặp sự cố tạm thời. App đang dùng dữ liệu mock để duy trì hoạt động. Refresh lại sau vài phút để thử kết nối lại.',
    primaryLabel: 'Đóng',
  },
  'empty-data': {
    icon:        '📭',
    severity:    'info',
    title:       'Chưa có dữ liệu giải đấu',
    subtitle:    'API trả về rỗng',
    description:
      'API hoạt động bình thường nhưng giải đấu này chưa có dữ liệu (chưa bắt đầu hoặc chưa cập nhật). App đang hiển thị mock data tạm thời.',
    primaryLabel: 'Đóng',
  },
  'unknown': {
    icon:        'ℹ️',
    severity:    'info',
    title:       'Đang dùng dữ liệu mock',
    subtitle:    'Mock data mode',
    description:
      'App đang hiển thị dữ liệu giả lập. Chi tiết lý do xem trong header X-Mock-Reason.',
    primaryLabel: 'Đóng',
  },
}

export function QuotaBanner() {
  const { isUsingMock, reason, rawMessage, dismissed, dismiss } = useDataSourceStore()

  // Hydration-safe portal mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const shouldShow = mounted && isUsingMock && !dismissed
  const content   = CONTENT[reason]

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {shouldShow && (
        <Backdrop
          key="quota-backdrop"
          variants={backdropV}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={dismiss}
        >
          <Popup
            key="quota-popup"
            variants={popupV}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-labelledby="quota-title"
          >
            <Header $severity={content.severity}>
              <IconCircle $severity={content.severity} aria-hidden="true">
                {content.icon}
              </IconCircle>
              <TitleBlock>
                <Title id="quota-title">{content.title}</Title>
                <Subtitle>{content.subtitle}</Subtitle>
              </TitleBlock>
              <CloseBtn onClick={dismiss} aria-label="Đóng">✕</CloseBtn>
            </Header>

            <Body>
              <Description>{content.description}</Description>

              {/* InfoCards — thông tin chi tiết tùy theo reason */}
              {reason === 'no-credentials' && (
                <>
                  <InfoCard>
                    <InfoLabel>Cách khắc phục</InfoLabel>
                    <InfoValue>
                      Thêm <code>API_FOOTBALL_KEY=&lt;your_key&gt;</code> vào file <code>.env.local</code> rồi restart dev server.
                    </InfoValue>
                  </InfoCard>
                  <InfoCard>
                    <InfoLabel>File config</InfoLabel>
                    <InfoValue>.env.local · ở root project</InfoValue>
                  </InfoCard>
                </>
              )}

              {reason === 'quota-exceeded' && (
                <>
                  <InfoCard>
                    <InfoLabel>Giới hạn free tier</InfoLabel>
                    <InfoValue>100 requests / ngày · reset lúc 00:00 UTC</InfoValue>
                  </InfoCard>
                  {rawMessage && (
                    <InfoCard>
                      <InfoLabel>Server response</InfoLabel>
                      <InfoValue>{rawMessage}</InfoValue>
                    </InfoCard>
                  )}
                </>
              )}

              {reason === 'provider-error' && (
                <>
                  <InfoCard>
                    <InfoLabel>Provider</InfoLabel>
                    <InfoValue>API-Football (api-sports.io)</InfoValue>
                  </InfoCard>
                  {rawMessage && (
                    <InfoCard>
                      <InfoLabel>Server message</InfoLabel>
                      <InfoValue>{rawMessage}</InfoValue>
                    </InfoCard>
                  )}
                </>
              )}

              {reason === 'empty-data' && (
                <>
                  <InfoCard>
                    <InfoLabel>Nguyên nhân có thể</InfoLabel>
                    <InfoValue>
                      Giải đấu chưa bắt đầu, hoặc API chưa cập nhật dữ liệu cho competition này.
                    </InfoValue>
                  </InfoCard>
                  <InfoCard>
                    <InfoLabel>Cách khắc phục</InfoLabel>
                    <InfoValue>
                      Thử đổi <code>FOOTBALL_COMPETITION</code> trong <code>.env.local</code> sang giải đã kết thúc (vd: <code>wc2022</code>) rồi restart.
                    </InfoValue>
                  </InfoCard>
                </>
              )}

              {reason === 'unknown' && rawMessage && (
                <InfoCard>
                  <InfoLabel>Server message</InfoLabel>
                  <InfoValue>{rawMessage}</InfoValue>
                </InfoCard>
              )}
            </Body>

            <Footer>
              <SecondaryBtn onClick={dismiss} whileTap={{ scale: 0.95 }}>
                Đã hiểu
              </SecondaryBtn>
              {content.primaryHref ? (
                <PrimaryBtn
                  as="a"
                  href={content.primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  onClick={dismiss}
                >
                  {content.primaryLabel}
                </PrimaryBtn>
              ) : (
                <PrimaryBtn onClick={dismiss} whileTap={{ scale: 0.95 }}>
                  {content.primaryLabel}
                </PrimaryBtn>
              )}
            </Footer>
          </Popup>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  )
}
