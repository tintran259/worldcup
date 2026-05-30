/**
 * Header animation variants.
 *
 * The header slides down from above on first render.
 * The live match count badge animates in/out as live matches start/end.
 */

import type { Variants } from 'framer-motion'

export const headerEntrance: Variants = {
  hidden: { y: -60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

export const phasePillEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.2 } },
}

export const liveCountEntrance: Variants = {
  hidden: { opacity: 0, x: 8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.25 } },
}
