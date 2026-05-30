/**
 * Helpers dùng chung cho BFF routes.
 *
 * Strategy:
 *   - Dev mode: API lỗi → fallback mock + log warning
 *   - Production: API lỗi → trả 503 thật
 *
 * Bộc lộ lỗi sớm trong production thay vì silently dùng mock.
 */

const IS_DEV = process.env.NODE_ENV !== 'production'

export interface FallbackOptions<T> {
  /** Tên route để log (e.g. "matches", "standings") */
  route:    string
  /** Lỗi gốc từ provider */
  error:    unknown
  /** Dữ liệu mock để trả nếu đang ở dev mode */
  mockData: T
  /** HTTP status code khi production (default 503) */
  status?:  number
}

/**
 * Trả response phù hợp:
 *   - Dev: mock data + header X-Data-Source: mock
 *   - Production: 503 + error message
 */
export function handleProviderError<T>(opts: FallbackOptions<T>): Response {
  const message = opts.error instanceof Error ? opts.error.message : String(opts.error)
  console.error(`[/api/${opts.route}]`, message)

  if (IS_DEV) {
    console.warn(`[/api/${opts.route}] Dev mode: fallback sang mock data`)
    return Response.json(opts.mockData, {
      headers: {
        'X-Data-Source':  'mock',
        'X-Mock-Reason':  message,
        'Cache-Control':  'no-store',
      },
    })
  }

  return Response.json(
    { error: `Failed to fetch ${opts.route}`, message },
    { status: opts.status ?? 503 },
  )
}
