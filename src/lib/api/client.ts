import type { ApiError } from '@/types/api.types'
import { useDataSourceStore, classifyMockReason, getSelectedCompetitionKey } from '@/stores'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

/**
 * Tự động thêm ?competition=<key> vào path nếu user đã chọn competition khác.
 * BFF route sẽ đọc query này và override env default.
 */
function injectCompetitionQuery(path: string): string {
  const key = getSelectedCompetitionKey()
  if (!key) return path

  const sep = path.includes('?') ? '&' : '?'
  return `${path}${sep}competition=${encodeURIComponent(key)}`
}

class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * Phát hiện BFF có fallback về mock data không qua header `X-Data-Source`.
 * Cập nhật global store để banner UI có thể hiển thị.
 *
 * Chỉ chạy ở browser — server-side fetch không có store.
 */
/**
 * Dump tất cả response headers ra Record để dễ log.
 * Một số CDN/proxy có thể strip custom headers — log để verify.
 */
function dumpHeaders(response: Response): Record<string, string> {
  const out: Record<string, string> = {}
  response.headers.forEach((value, key) => { out[key] = value })
  return out
}

function detectDataSource(response: Response, url: string): void {
  if (typeof window === 'undefined') return

  const source = response.headers.get('X-Data-Source')
  const store = useDataSourceStore.getState()

  // ── Verbose log để debug ────────────────────────────────────────────────────
  console.groupCollapsed(
    `%c[apiClient] ${response.status} ${response.statusText} · ${url}`,
    `color: ${source === 'mock' ? '#f59e0b' : '#10b981'}; font-weight: bold`,
  )
  console.log('🔵 URL:        ', url)
  console.log('🔵 Status:     ', response.status, response.statusText)
  console.log('🔵 X-Data-Source:', source ?? '(none)')
  console.log('🔵 X-Mock-Reason:', response.headers.get('X-Mock-Reason') ?? '(none)')
  console.log('🔵 All headers: ', dumpHeaders(response))
  console.groupEnd()

  if (source === 'mock') {
    const rawMessage = response.headers.get('X-Mock-Reason') ?? 'Unknown reason'
    const newReason = classifyMockReason(rawMessage)

    const isTransition = !store.isUsingMock
    const reasonChanged = store.reason !== newReason
    const messageChanged = store.rawMessage !== rawMessage

    console.warn(
      `[apiClient] Mock fallback detected`,
      { reason: newReason, rawMessage, isTransition, reasonChanged, messageChanged },
    )

    if (isTransition || reasonChanged || messageChanged) {
      store.setMockMode(newReason, rawMessage)
      console.warn(`[apiClient] → Banner SHOULD show now (reason=${newReason})`)
    } else {
      console.warn(`[apiClient] → Banner skipped (no change)`)
    }
  } else if (store.isUsingMock) {
    console.log(`[apiClient] API working again → clear mock mode`)
    store.setApiMode()
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${injectCompetitionQuery(path)}`

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  // Detect data source (also logs verbose info to console)
  detectDataSource(response, url)

  if (!response.ok) {
    let errorBody: ApiError = {
      message: response.statusText,
      code: 'UNKNOWN_ERROR',
      status: response.status,
    }

    try {
      errorBody = await response.json()
    } catch {
      // use defaults
    }

    console.error(
      `%c[apiClient] HTTP ERROR ${response.status}`,
      'color: #ef4444; font-weight: bold',
      { url, status: response.status, code: errorBody.code, message: errorBody.message },
    )

    throw new ApiClientError(errorBody.status, errorBody.code, errorBody.message)
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, init?: Omit<RequestInit, 'method'>) =>
    request<T>(path, { ...init, method: 'GET' }),

  post: <T>(path: string, body: unknown, init?: Omit<RequestInit, 'method' | 'body'>) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
}
