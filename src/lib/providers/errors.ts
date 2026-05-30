/**
 * Error types cho provider layer.
 * Dùng class vì chúng extend Error — đây là trường hợp hợp lệ duy nhất.
 */

import type { ProviderName } from './types'

export class ProviderError extends Error {
  constructor(
    public readonly provider: ProviderName,
    message: string,
    public readonly status?: number,
  ) {
    super(`[${provider}] ${message}`)
    this.name = 'ProviderError'
  }
}

export class ProviderRateLimitError extends ProviderError {
  constructor(provider: ProviderName, public readonly retryAfterMs: number) {
    super(provider, `Rate limited — thử lại sau ${retryAfterMs}ms`)
    this.name = 'ProviderRateLimitError'
  }
}

// Circuit breaker mở — provider đang bị tạm ngưng
export class CircuitOpenError extends Error {
  constructor(public readonly provider: ProviderName) {
    super(`Circuit breaker mở cho provider: ${provider}`)
    this.name = 'CircuitOpenError'
  }
}

// Repository không tìm được data từ bất kỳ provider nào
export class RepositoryError extends Error {
  constructor(public readonly operation: string, message: string) {
    super(`[Repository:${operation}] ${message}`)
    this.name = 'RepositoryError'
  }
}
