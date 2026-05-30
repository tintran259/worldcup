/**
 * Mobile tab switcher animations.
 *
 * Tab panels slide left or right depending on direction:
 *   direction  1 = navigating forward (higher index)
 *   direction -1 = navigating backward (lower index)
 */

import type { Variants } from 'framer-motion'
import { ease } from '@/animations/spring'

export function tabPanelSlide(direction: number): Variants {
  return {
    enter:  { x: direction > 0 ?  24 : -24, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.24, ease: ease.out } },
    exit:   { x: direction > 0 ? -24 :  24, opacity: 0, transition: { duration: 0.16 } },
  }
}
