/**
 * Twitter card image — reuse same banner as OG.
 *
 * Next.js yêu cầu các config exports (runtime, size, contentType, alt) phải là
 * literal có thể static-parse. Vì vậy KHÔNG re-export từ opengraph-image.tsx;
 * chỉ import default component và copy literals.
 */

import OGImage from './opengraph-image'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt         = 'FIFA World Cup 2026 — Interactive Bracket Explorer'
export const dynamic     = 'force-dynamic'

export default OGImage
