/**
 * Helpers dùng chung cho BFF routes.
 *
 * Strategy:
 *   - Dev mode: API lỗi → fallback mock + log warning
 *   - Production: API lỗi → trả 503 thật
 *
 * Bộc lộ lỗi sớm trong production thay vì silently dùng mock.
 */

import { isCurrentCompetitionUpcoming, getCurrentCompetition } from '@/lib/config/competitionContext'

const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * Defense-in-depth: nếu competition chưa bắt đầu → short-circuit, return empty.
 * Tránh tốn quota api-football cho data không tồn tại.
 *
 * Trả về Response 200 với empty data + header báo lý do.
 * Caller dùng trong route handler:
 *
 *   const skip = skipIfUpcoming([])
 *   if (skip) return skip
 */
export function skipIfUpcoming<T>(emptyData: T): Response | null {
  if (!isCurrentCompetitionUpcoming()) return null
  const comp = getCurrentCompetition()
  console.log(`[skipIfUpcoming] Competition "${comp.key}" upcoming — returning empty (skip API call)`)
  return Response.json(emptyData, {
    headers: {
      'X-Data-Source': 'skipped-upcoming',
      'X-Skip-Reason': `Competition "${comp.key}" not started yet`,
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}

export interface FallbackOptions<T> {
  /** Tên route để log (e.g. "matches", "standings") */
  route: string
  /** Lỗi gốc từ provider */
  error: unknown
  /** Dữ liệu mock để trả nếu đang ở dev mode */
  mockData: T
  /** HTTP status code khi production (default 503) */
  status?: number
}

/**
 * Sanitize string for HTTP header value — header chỉ chấp nhận ASCII printable.
 * Strip non-ASCII characters và giới hạn độ dài để tránh lỗi serialization.
 */
function sanitizeForHeader(input: string): string {
  return input.replace(/[^\x20-\x7E]/g, '?').slice(0, 200)
}

/**
 * Trả response phù hợp:
 *   - Dev: mock data + header X-Data-Source: mock
 *   - Production: 503 + error message
 */
export function handleProviderError<T>(opts: FallbackOptions<T>): Response {
  const err = opts.error
  const message = err instanceof Error ? err.message : String(err)
  const stack = err instanceof Error ? err.stack : undefined
  const cause = err instanceof Error && 'cause' in err ? (err as { cause?: unknown }).cause : undefined

  console.error(`\n╔═══ [/api/${opts.route}] PROVIDER ERROR ═══`)
  console.error("║ IS_DEV:", IS_DEV)
  console.error(`║ Type:    ${err instanceof Error ? err.name : typeof err}`)
  console.error(`║ Message: ${message}`)
  if (cause) console.error(`║ Cause:  `, cause)
  if (stack) console.error(`║ Stack:\n${stack.split('\n').slice(0, 5).map(l => '║   ' + l).join('\n')}`)
  console.error(`╚════════════════════════════════════════════\n`)

  if (IS_DEV) {
    console.warn(`[/api/${opts.route}] → Dev: serving mock data (X-Data-Source: mock)`)
    return Response.json(opts.mockData, {
      headers: {
        'X-Data-Source': 'mock',
        // HTTP headers chỉ chấp nhận ASCII — sanitize message tiếng Việt
        'X-Mock-Reason': sanitizeForHeader(message),
        'Cache-Control': 'no-store',
      },
    })
  }

  return Response.json(
    { error: `Failed to fetch ${opts.route}`, message },
    { status: opts.status ?? 503 },
  )
}

