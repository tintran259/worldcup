import type { Variants } from 'framer-motion'

export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

export const sheetVariants: Variants = {
  hidden:  { y: '100%', opacity: 0.8 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 360, damping: 32 },
  },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
}

export const rowVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.20, delay: i * 0.04 },
  }),
}
