/**
 * Data source store — track xem app đang dùng API thật hay mock fallback.
 *
 * Cập nhật bởi apiClient mỗi khi nhận header X-Data-Source: mock.
 * Đọc bởi QuotaBanner để show popup cho user.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type MockReason =
  | 'quota-exceeded'    // 429 — hết quota daily/minute
  | 'no-credentials'    // .env không có API key
  | 'provider-error'    // API trả lỗi khác (500, timeout, ...)
  | 'empty-data'        // API OK nhưng trả empty (giải chưa có data)
  | 'unknown'

interface DataSourceState {
  /** Đang dùng mock fallback không */
  isUsingMock: boolean
  /** Lý do fallback (parse từ X-Mock-Reason header) */
  reason: MockReason
  /** Raw message từ server để debug */
  rawMessage: string
  /** User đã dismiss banner chưa (per session) */
  dismissed: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  setMockMode: (reason: MockReason, rawMessage: string) => void
  setApiMode: () => void
  dismiss: () => void
  reset: () => void
}

/**
 * Phân loại lý do từ message text.
 * Mock reason header đã được sanitize ASCII nên check theo keyword tiếng Anh.
 *
 * Thứ tự check QUAN TRỌNG — kiểm tra cụ thể trước (no-credentials)
 * rồi mới đến chung (provider-error).
 */
export function classifyMockReason(message: string): MockReason {
  const m = message.toLowerCase()

  // Empty data — API thành công nhưng không có data
  if (m.includes('empty') || m.includes('no data') || m.includes('not found')) {
    return 'empty-data'
  }

  // No provider configured — kiểm tra trước vì message có thể chứa "provider"
  if (
    m.includes('no api provider') ||
    m.includes('no credentials') ||
    m.includes('add api_football_key') ||
    m.includes('no provider configured')
  ) {
    return 'no-credentials'
  }

  // Quota / rate limit
  if (
    m.includes('rate limit') ||
    m.includes('429') ||
    m.includes('quota') ||
    m.includes('plan')
  ) {
    return 'quota-exceeded'
  }

  // Provider error (HTTP error, network, circuit breaker, ...)
  if (
    m.includes('http ') ||
    m.includes('failed') ||
    m.includes('circuit') ||
    m.includes('timeout') ||
    m.includes('all providers')
  ) {
    return 'provider-error'
  }

  return 'unknown'
}

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    (set) => ({
      isUsingMock: false,
      reason: 'unknown',
      rawMessage: '',
      dismissed: false,

      setMockMode: (reason, rawMessage) => set({
        isUsingMock: true,
        reason,
        rawMessage,
        // Reset dismissed mỗi khi caller gọi setMockMode — apiClient đã chịu
        // trách nhiệm chỉ gọi khi có change thật sự (transition / reason / msg).
        // Nhờ đó: switch giải khác hit limit lại → popup hiện lại.
        dismissed: false,
      }),

      setApiMode: () => set({
        isUsingMock: false,
        reason: 'unknown',
        rawMessage: '',
      }),

      dismiss: () => set({ dismissed: true }),

      reset: () => set({
        isUsingMock: false,
        reason: 'unknown',
        rawMessage: '',
        dismissed: false,
      }),
    }),
    { name: 'data-source-store' },
  ),
)
