import type { Variants } from 'framer-motion'
import { ease } from './spring'

/**
 * Directional slide variants for Framer Motion.
 * All slide animations also fade opacity for a polished feel.
 */

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.40, ease: ease.out } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.20 } },
}

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.38, ease: ease.out } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.18 } },
}

/** Desktop side-panel: slides in from the right edge. */
export const panelSlide: Variants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.32, ease: ease.out } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.24, ease: 'easeIn' } },
}

/** Mobile bottom-sheet: rises from the bottom. */
export const sheetSlide: Variants = {
  hidden:  { y: '100%' },
  visible: { y: 0, transition: { duration: 0.38, ease: ease.out } },
  exit:    { y: '100%', transition: { duration: 0.28, ease: 'easeIn' } },
}

/**
 * Tab content slide — direction controls which way the new panel enters.
 * direction: 1 = forward (left→right reading), -1 = backward.
 */
export function tabSlide(direction: 1 | -1): Variants {
  const xIn  = direction > 0 ?  28 : -28
  const xOut = direction > 0 ? -28 :  28
  return {
    enter:  { x: xIn,  opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.22, ease: ease.out } },
    exit:   { x: xOut, opacity: 0, transition: { duration: 0.16 } },
  }
}
