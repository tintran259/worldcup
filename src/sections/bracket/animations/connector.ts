/**
 * SVG connector-line animation variants for the tournament bracket.
 *
 * The bracket draws its edges left-to-right as each round resolves,
 * so earlier rounds get a smaller base delay than later ones.
 *
 * Design tokens:
 *   Neutral lines  — slate-300, 55% opacity
 *   Active path    — FIFA blue (#2563eb)
 *   Winner path    — emerald green (#10b981)
 *   Live path      — red (#ef4444)
 */

import type { Variants } from 'framer-motion'

// Per-round base delay: earlier rounds draw first (left → right)
const ROUND_BASE_DELAY = [0, 0.32, 0.62, 0.88, 1.10] as const

/**
 * Compute the draw delay for a specific connector path.
 * Paths within the same round stagger by 25ms each.
 */
export function getConnectorDelay(roundIndex: number, matchIndex: number): number {
  const base = ROUND_BASE_DELAY[roundIndex] ?? roundIndex * 0.28
  return base + matchIndex * 0.025
}

/**
 * Framer Motion variant for animating SVG `pathLength` from 0 → 1.
 * Custom value must be the computed delay from `getConnectorDelay`.
 */
export const pathDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity:    1,
    transition: {
      pathLength: { duration: 0.58, delay, ease: [0.25, 1, 0.5, 1] as const },
      opacity:    { duration: 0.12, delay },
    },
  }),
  exit: {
    pathLength: 0,
    opacity:    0,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
}

/**
 * Joint dot pop — small circle at the elbow of each L-shaped connector.
 * Appears slightly after the path draw finishes.
 */
export const dotPop = (delay: number) => ({
  animation: `bc-dot-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards`,
})
