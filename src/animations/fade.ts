import type { Variants } from 'framer-motion'

/**
 * Pure opacity transitions.
 * Use when an element should appear/disappear without moving.
 */

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.20 } },
}

/** Backdrop / overlay fade — shorter duration for overlays. */
export const overlayFade: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
}
