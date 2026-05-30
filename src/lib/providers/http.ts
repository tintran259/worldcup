/**
 * HTTP client factory — thay thế BaseHttpClient abstract class.
 *
 * Tính năng:
 *   - Retry với exponential backoff + jitter
 *   - Circuit breaker (tạm ngưng provider khi lỗi liên tục)
 *   - Request timeout
 */

import { ProviderError, ProviderRateLimitError, CircuitOpenError } from './errors'
import type { ProviderName } from './types'

export interface HttpClient {
  get<T>(path: string, params?: Record<string, string>): Promise<T>
}

export interface HttpClientConfig {
  baseUrl:    string
  timeoutMs?: number
  /** Trả về auth headers — mỗi provider có cách auth khác nhau */
  getHeaders: () => Record<string, string>
  retry?: {
    maxAttempts?: number
    baseDelayMs?: number
    maxDelayMs?:  number
  }
  circuit?: {
    failureThreshold?: number
    timeoutMs?:        number
  }
}

export function createHttpClient(name: ProviderName, config: HttpClientConfig): HttpClient {
  const timeout    = config.timeoutMs   ?? 10_000
  const maxTries   = config.retry?.maxAttempts ?? 3
  const baseDelay  = config.retry?.baseDelayMs ?? 500
  const maxDelay   = config.retry?.maxDelayMs  ?? 8_000
  const cbThreshold = config.circuit?.failureThreshold ?? 5
  const cbTimeout   = config.circuit?.timeoutMs        ?? 30_000

  // Circuit breaker state (module-scoped per provider instance)
  let failures   = 0
  let openUntil  = 0

  function isOpen() {
    if (openUntil === 0) return false
    if (Date.now() > openUntil) { openUntil = 0; return false }  // HALF_OPEN
    return true
  }

  function onSuccess() { failures = 0 }

  function onFailure() {
    failures++
    if (failures >= cbThreshold) openUntil = Date.now() + cbTimeout
  }

  function delay(attempt: number) {
    const exp = Math.min(baseDelay * 2 ** attempt, maxDelay)
    return exp / 2 + Math.random() * (exp / 2)   // jitter
  }

  function buildUrl(path: string, params?: Record<string, string>) {
    const url = new URL(`${config.baseUrl}${path}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return url.toString()
  }

  async function fetchWithTimeout(url: string): Promise<Response> {
    const ctrl  = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeout)
    try {
      return await fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...config.getHeaders() },
        signal: ctrl.signal,
      })
    } finally {
      clearTimeout(timer)
    }
  }

  return {
    async get<T>(path: string, params?: Record<string, string>) {
      if (isOpen()) throw new CircuitOpenError(name)

      let lastErr: unknown
      for (let attempt = 0; attempt < maxTries; attempt++) {
        try {
          const res = await fetchWithTimeout(buildUrl(path, params))

          if (res.status === 429) {
            const retryAfter = Number(res.headers.get('Retry-After') ?? 60) * 1_000
            onFailure()
            throw new ProviderRateLimitError(name, retryAfter)
          }

          if (!res.ok) {
            onFailure()
            throw new ProviderError(name, `HTTP ${res.status}: ${res.statusText}`, res.status)
          }

          onSuccess()
          return await res.json() as T

        } catch (err) {
          lastErr = err
          // Không retry rate limit và 4xx
          if (err instanceof ProviderRateLimitError) throw err
          if (err instanceof ProviderError && err.status && err.status < 500) throw err

          onFailure()
          if (attempt < maxTries - 1) await sleep(delay(attempt))
        }
      }

      throw new ProviderError(name, `Thất bại sau ${maxTries} lần thử`, undefined)
    },
  }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}
