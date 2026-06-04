/**
 * Provider chain factory — thay thế ProviderFactory class.
 *
 * Đọc cấu hình từ .env, tạo danh sách (client + adapter) theo thứ tự ưu tiên.
 * Provider thiếu credentials sẽ bị bỏ qua thay vì crash app.
 */

import { getConfig, getProviderChain } from '@/lib/config'
import type { ApiFootballCredentials } from '@/lib/config'
import { createApiFootballClient } from './api-football/client'
import { apiFootballAdapter } from './api-football/adapter'
import type { ProviderBundle, ProviderName } from './types'

function createBundle(name: ProviderName): ProviderBundle {
  const cfg = getConfig()
  const pcfg = cfg.providers.all[name]

  if (!pcfg) throw new Error(`Không tìm thấy cấu hình cho provider: ${name}`)

  switch (name) {
    case 'api-football': {
      const { apiKey } = pcfg.credentials as ApiFootballCredentials
      return { provider: createApiFootballClient(apiKey), adapter: apiFootballAdapter }
    }
    default:
      throw new Error(`Provider không hợp lệ: ${String(name)}`)
  }
}

/**
 * Tạo danh sách provider theo thứ tự: [primary, ...fallbacks].
 * Provider nào thiếu API key sẽ bị bỏ qua (console.warn).
 */
export function createProviderChain(): ProviderBundle[] {
  const names = getProviderChain()

  return names.flatMap(name => {
    try {
      return [createBundle(name)]
    } catch (err) {
      console.warn(`[providers] Bỏ qua "${name}": ${(err as Error).message}`)
      return []
    }
  })
}
