/**
 * Match card animations for the bracket canvas.
 *
 * Each card entrance is staggered by the card's index within its round column.
 * Live cards have continuous breathing animations defined in CSS keyframes
 * (inside styles.ts) — only the entrance/exit states live here.
 */

import type { Variants } from 'framer-motion'
import { ease } from '@/animations/spring'

/**
 * Card entrance animation.
 * Index multiplied by 0.03s gives each card a unique stagger offset.
 */
export function bracketCardVariant(index: number): object {
  return {
    initial: { opacity: 0, y: 8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.28, delay: index * 0.03, ease: ease.out },
  }
}

/** Zoom controls panel entrance — delayed so the bracket draws first. */
export const zoomControlsEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.90 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, delay: 0.45, ease: ease.out } },
}

/** Minimap panel entrance — slightly more delay than zoom controls. */
export const minimapEntrance: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, delay: 0.50, ease: ease.out } },
}
