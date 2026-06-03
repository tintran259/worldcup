/**
 * Cache profiles — chuẩn hóa Cache-Control headers cho CDN/edge.
 *
 * Phân tách 2 layer:
 *   - Server-side cache (Redis/Memory) — TTL trong `TTL` constants ở index.ts
 *   - CDN/edge cache (Vercel, Cloudflare) — header này
 *
 * Vercel CDN sẽ cache response theo `s-maxage`. Trong window đó, N requests
 * cùng URL → CDN serve từ edge, không hit origin function.
 *
 * `stale-while-revalidate` (SWR): khi cache expired, CDN vẫn serve stale ngay
 * cho user và background refetch — không user nào bị slow request.
 *
 * Browser-side: `private`/`public` quyết định browser có cache hay không.
 * Hầu hết BFF response: `public` (data tournament chung, không nhạy cảm).
 */

import type { Match } from '@/types/domain.types'

export interface CacheProfile {
  /** Max age tại CDN edge (seconds) — số request thực sự hit origin */
  edgeTtl: number
  /** Stale-while-revalidate window (seconds) — UX smooth khi cache expire */
  staleWhileRevalidate: number
}

/**
 * Tính: với rate API quota, mỗi profile chịu được bao nhiêu URL/giờ?
 *   1 origin hit / edgeTtl seconds  =  3600 / edgeTtl  hits/giờ/URL
 *
 *   LIVE (15s):       240 hits/giờ/URL → 1000 user share 1 URL = 240 calls/giờ
 *   BRACKET (60s):     60 hits/giờ/URL
 *   STANDINGS (300s):  12 hits/giờ/URL
 *   STATS (300s):      12 hits/giờ/URL
 *   TEAMS_LIST (3600): 1 hit/giờ/URL
 *   TEAM_DETAIL (3600):1 hit/giờ/URL  ← phổ biến nhất, nhiều URL/team
 *   SQUAD (7200):    0.5 hit/giờ/URL
 *   MATCH_LIVE (15s): 240 hits/giờ/URL
 *   MATCH_FINISHED (3600): 1 hit/giờ/URL (đã xong, ko đổi)
 */
export const CACHE_PROFILES = {
  /** Trận đang live — tỉ số/event đổi liên tục */
  LIVE_MATCH:    { edgeTtl: 15,   staleWhileRevalidate: 30   },
  /** Match detail của trận live */
  MATCH_LIVE:    { edgeTtl: 15,   staleWhileRevalidate: 30   },
  /** Match detail của trận đã xong — gần như không đổi */
  MATCH_FINISHED:{ edgeTtl: 3600, staleWhileRevalidate: 7200 },
  /** List matches (mixed status) */
  MATCHES_LIST:  { edgeTtl: 60,   staleWhileRevalidate: 120  },
  /** Bracket structure — ít đổi (chỉ khi có trận xong) */
  BRACKET:       { edgeTtl: 60,   staleWhileRevalidate: 300  },
  /** Standings — đổi sau mỗi trận */
  STANDINGS:     { edgeTtl: 300,  staleWhileRevalidate: 600  },
  /** Stats (top scorers, team goals) — đổi sau trận */
  STATS:         { edgeTtl: 300,  staleWhileRevalidate: 600  },
  /** List tất cả teams — quasi-static */
  TEAMS_LIST:    { edgeTtl: 3600, staleWhileRevalidate: 7200 },
  /** Team profile riêng */
  TEAM_DETAIL:   { edgeTtl: 3600, staleWhileRevalidate: 7200 },
  /** Squad — ít đổi (vài lần/giải) */
  SQUAD:         { edgeTtl: 7200, staleWhileRevalidate: 14400},
  /** Mock data fallback — không cache */
  NO_CACHE:      { edgeTtl: 0,    staleWhileRevalidate: 0    },
} as const satisfies Record<string, CacheProfile>

export type CacheProfileKey = keyof typeof CACHE_PROFILES

/**
 * Build Cache-Control header string từ profile.
 *
 *   public                  → cho cả browser + CDN cache (data chung, không nhạy cảm)
 *   s-maxage=N             → CDN edge cache N giây
 *   stale-while-revalidate → serve stale + background refetch
 *   no-store               → KHÔNG cache (cho mock fallback hoặc data dynamic)
 */
export function buildCacheControl(profile: CacheProfile | CacheProfileKey): string {
  const p = typeof profile === 'string' ? CACHE_PROFILES[profile] : profile
  if (p.edgeTtl === 0) return 'no-store'
  return `public, s-maxage=${p.edgeTtl}, stale-while-revalidate=${p.staleWhileRevalidate}`
}

/**
 * Pick cache profile theo match status — auto-select live vs finished.
 */
export function matchProfile(status: Match['status'] | null): CacheProfileKey {
  if (status === 'live')      return 'MATCH_LIVE'
  if (status === 'completed') return 'MATCH_FINISHED'
  return 'MATCHES_LIST'
}

/**
 * Standard cache headers object — dùng với `Response.json(data, { headers })`.
 */
export function cacheHeaders(profile: CacheProfile | CacheProfileKey): Record<string, string> {
  return { 'Cache-Control': buildCacheControl(profile) }
}
