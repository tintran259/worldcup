/**
 * Competition runtime context — cho phép BFF route override competition
 * per-request mà không cần đổi env hay restart server.
 *
 * ⚠️ SERVER-ONLY: dùng `node:async_hooks` (chỉ chạy được trên Node.js).
 * KHÔNG import file này trong client component.
 * BFF routes + repositories import qua đường dẫn đầy đủ:
 *   import { withCompetition } from '@/lib/config/competitionContext'
 */

// SERVER-ONLY: `node:async_hooks` chỉ chạy được trên Node.js runtime.
// Bất kỳ client import nào sẽ throw build error → đây là natural barrier.
import { AsyncLocalStorage } from 'node:async_hooks'
import { getConfig } from './service'
import { getCompetitionByKey } from './competitions'
import type { CompetitionConfig, CompetitionKey } from './types'
import { COMPETITION_KEYS } from './env.schema'

interface CompetitionContext {
  competitionKey?: string
}

const storage = new AsyncLocalStorage<CompetitionContext>()

/**
 * Wrap handler trong scope của competition key truyền vào.
 * Mọi `getCurrentCompetition()` chạy trong fn sẽ trả về override.
 *
 * @param key Competition key hợp lệ. Nếu undefined/invalid → dùng env default.
 */
export function withCompetition<T>(
  key: string | null | undefined,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const normalized = normalizeKey(key)
  console.log(`[withCompetition] requested="${key}" → normalized="${normalized ?? 'ENV_DEFAULT'}"`)
  if (!normalized) return fn()
  return storage.run({ competitionKey: normalized }, fn)
}

/**
 * Lấy CompetitionConfig hiện tại:
 *   1. Ưu tiên override từ AsyncLocalStorage (BFF route truyền vào)
 *   2. Fallback về competition từ env (FOOTBALL_COMPETITION)
 */
export function getCurrentCompetition(): CompetitionConfig {
  const ctx = storage.getStore()
  if (ctx?.competitionKey) {
    const comp = getCompetitionByKey(ctx.competitionKey as CompetitionKey)
    console.log(`[getCurrentCompetition] FROM CONTEXT: ${comp.key} (${comp.name})`)
    return comp
  }
  const comp = getConfig().competition
  console.log(`[getCurrentCompetition] FROM ENV: ${comp.key} (${comp.name})`)
  return comp
}

/**
 * Lấy providerIds CONTEXT-AWARE — thay thế getProviderIds() cũ.
 * Dùng trong repository thay vì import từ '@/lib/config'.
 */
import type { ProviderName, ProviderCompetitionIds } from './types'

export function getCurrentProviderIds(
  providerName: ProviderName,
): ProviderCompetitionIds | null {
  const ids = getCurrentCompetition().providerIds[providerName]
  return ids ?? null
}

/**
 * Detect status của competition hiện tại (server-side).
 * Dùng trong BFF route để short-circuit upcoming competition → tiết kiệm quota.
 */
export function isCurrentCompetitionUpcoming(): boolean {
  const comp = getCurrentCompetition()
  const ids = Object.values(comp.providerIds)[0]
  if (!ids?.dateFrom) return false
  const startMs = new Date(ids.dateFrom).getTime()
  return Date.now() < startMs
}

/** Validate + cast competition key */
function normalizeKey(key: string | null | undefined): string | null {
  if (!key) return null
  return COMPETITION_KEYS.includes(key as never) ? key : null
}
