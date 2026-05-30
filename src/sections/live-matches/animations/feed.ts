/**
 * Live matches feed animation variants.
 *
 * The "live now" section animates in/out using AnimatePresence
 * when the live match list becomes non-empty.
 */

import type { Variants } from 'framer-motion'

export const liveSection: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0 },
}

export const upcomingSection: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05 } },
}

export const completedSection: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.10 } },
}

/** Pulsing dot before the "Đang diễn ra" live label. */
export const pulseDotAnimate = {
  scale: [1, 1.5, 1] as [number, number, number],
  opacity: [1, 0.5, 1] as [number, number, number],
}

export const pulseDotTransition = {
  duration: 1.4,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}
