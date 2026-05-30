/**
 * motion-presets.ts
 *
 * Central barrel export for all Framer Motion animation presets.
 * Import from here in components — never define animation objects inline.
 *
 * Usage:
 *   import { fadeIn, slideUp, cardEntrance } from '@/animations/motion-presets'
 *   <motion.div variants={fadeIn} initial="hidden" animate="visible" />
 */

export { spring, ease } from './spring'

export { fadeIn, overlayFade } from './fade'

export {
  slideUp,
  slideLeft,
  panelSlide,
  sheetSlide,
  tabSlide,
} from './slide'

export {
  scaleIn,
  modalScale,
  cardEntrance,
  scoreDigit,
  liveRing,
} from './scale'

export {
  staggerContainer,
  staggerItem,
  staggerItemFast,
  staggerContainerSlow,
} from './stagger'

/**
 * SVG path-draw variant — animates stroke-dashoffset for bracket connectors.
 * @param delay - seconds to wait before drawing this path
 */
export function pathDrawVariant(delay = 0) {
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.60, delay, ease: [0.25, 1, 0.5, 1] as const },
        opacity:    { duration: 0.12, delay },
      },
    },
    exit: {
      pathLength: 0,
      opacity:    0,
      transition: { duration: 0.22, ease: 'easeIn' as const },
    },
  }
}
