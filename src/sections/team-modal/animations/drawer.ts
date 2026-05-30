/**
 * Player detail drawer animation variants.
 *
 * The drawer slides in from the right, overlapping the modal body.
 * An overlay fades behind it so the user can click to dismiss.
 */

import type { Variants } from 'framer-motion'

export const drawerVariants: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 340, damping: 30 } },
  exit: { x: '100%', transition: { duration: 0.20, ease: 'easeIn' } },
}

export const drawerOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}
