import type { Variants } from 'framer-motion'

export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
}

export const panelVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 26, mass: 0.9 },
  },
  exit:    { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.18, ease: 'easeIn' } },
}

export const digitVariants: Variants = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
}
