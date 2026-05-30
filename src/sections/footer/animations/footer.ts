/**
 * Footer entrance animation.
 * Slides up from below — mirrors the header's downward slide.
 */

import type { Variants } from 'framer-motion'

export const footerEntrance: Variants = {
  hidden: { y: 36, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] } },
}
