/**
 * Team detail modal animation variants.
 *
 * Layout:
 *   Backdrop → fade
 *   Modal container → spring scale + y lift
 *   Tab content → directional slide (forward/backward)
 */

import type { Variants } from 'framer-motion'
import { ease } from '@/animations/spring'

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

export const modalContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 32 },
  },
  exit: {
    opacity: 0, scale: 0.97, y: 10,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

/**
 * Tab content slide variant.
 * Pass the tab index as `custom` — positive = forward, negative = backward.
 */
export const tabContentVariants: Variants = {
  enter: (d: number) => ({ x: d > 0 ? 28 : -28, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.24, ease: ease.out } },
  exit: (d: number) => ({
    x: d > 0 ? -28 : 28, opacity: 0,
    transition: { duration: 0.14 },
  }),
}
