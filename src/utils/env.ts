/**
 * Browser-safe environment helpers.
 *
 * `process.env.NODE_ENV` được Next.js inline ở build time (DefinePlugin).
 * Trên production build → string literal "production" → minifier dead-code-eliminate
 * cả nhánh dev. → Zero runtime cost + zero mock data trong bundle.
 */

/** True khi build dev/test, false khi build production */
export const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * Có dùng mock fallback hay không.
 * Dev/test: dùng — UX vẫn render khi API chưa wire.
 * Production: KHÔNG — trả empty state để user thấy data thật hoặc lỗi rõ ràng.
 */
export const USE_MOCK_FALLBACK = IS_DEV

/**
 * Pick value theo môi trường — pattern cho mock fallback.
 *
 *   const matches = data ?? mockOr(mockMatches, [])
 *   // Dev: → mockMatches
 *   // Prod: → []
 */
export function mockOr<T>(mockValue: T, productionValue: T): T {
  return USE_MOCK_FALLBACK ? mockValue : productionValue
}
