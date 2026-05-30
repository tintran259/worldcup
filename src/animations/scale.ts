import type { Variants } from 'framer-motion'
import { spring, ease } from './spring'

/**
 * Scale + opacity variants.
 * Use for modals, popovers, and elements that pop into view.
 */

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,    transition: { ...spring.smooth } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.20 } },
}

/** Modal container — slight scale + vertical lift on entry. */
export const modalScale: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 32 },
  },
  exit: { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.18, ease: 'easeIn' } },
}

/** Card entrance — bracket nodes, match rows, list items. */
export const cardEntrance: Variants = {
  hidden:  { opacity: 0, y: 10, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.35, ease: ease.out } },
  exit:    { opacity: 0, scale: 0.97,         transition: { duration: 0.20 } },
}

/** Score digit counter — flips vertically on score change. */
export const scoreDigit: Variants = {
  initial: { y: -16, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { ...spring.snappy } },
  exit:    { y: 16, opacity: 0, transition: { duration: 0.14 } },
}

/** Live status ring — continuous pulse animation. */
export const liveRing: Variants = {
  pulse: {
    scale:   [1, 1.9],
    opacity: [0.7, 0],
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeOut' },
  },
}
