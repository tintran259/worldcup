/**
 * Framer Motion variants for the full-screen standings modal.
 *
 * The modal uses a layered entry:
 *   1. Backdrop fades in
 *   2. Panel scales + slides up
 *   3. Group cards stagger in one by one
 */

import type { Variants } from 'framer-motion'

export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
}

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.30, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } },
}

/**
 * Per-card stagger variant for the 12 group cards in the modal grid.
 * Pass the card index as the `custom` prop.
 */
export const groupCardVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.28, delay: i * 0.04 },
  }),
}
