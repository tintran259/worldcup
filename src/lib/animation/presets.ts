import type { Variants } from 'framer-motion'

// ── Spring physics presets ─────────────────────────────────────────────────────

export const spring = {
  snappy: { type: 'spring', stiffness: 420, damping: 32 } as const,
  smooth: { type: 'spring', stiffness: 220, damping: 28 } as const,
  bouncy: { type: 'spring', stiffness: 360, damping: 22 } as const,
  slow:   { type: 'spring', stiffness: 120, damping: 20 } as const,
  micro:  { type: 'spring', stiffness: 600, damping: 42 } as const,
} as const

// ── Cubic-bezier easing curves ─────────────────────────────────────────────────

export const ease = {
  out:   [0.16, 1, 0.3, 1]   as const,  // expo out — snappy deceleration
  in:    [0.7,  0, 1, 1]     as const,  // expo in
  inOut: [0.87, 0, 0.13, 1]  as const,  // expo in-out
  snap:  [0.25, 1, 0.5, 1]   as const,  // broadcast snap
} as const

// ── Reusable Framer Motion variant sets ────────────────────────────────────────

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.20 } },
}

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.40, ease: ease.out } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.20 } },
}

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: ease.out } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.18 } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { ...spring.smooth } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.20 } },
}

// Card entrance — bracket nodes, live match rows
export const cardEntrance: Variants = {
  hidden:  { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, ease: ease.out },
  },
  exit: {
    opacity: 0, scale: 0.97,
    transition: { duration: 0.20 },
  },
}

// Stagger container — wraps a list, children inherit with stagger
export function staggerContainer(
  staggerChildren = 0.07,
  delayChildren   = 0,
): Variants {
  return {
    hidden:  {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

// SVG path draw — use per-path delay
export function pathDrawVariant(delay = 0): Variants {
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.60, delay, ease: ease.snap },
        opacity:    { duration: 0.12, delay },
      },
    },
    exit: {
      pathLength: 0,
      opacity: 0,
      transition: { duration: 0.22, ease: 'easeIn' },
    },
  }
}

// Panel slide from right (desktop aside)
export const panelSlide: Variants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.32, ease: ease.out } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.24, ease: 'easeIn' } },
}

// Bottom sheet (mobile)
export const sheetSlide: Variants = {
  hidden:  { y: '100%' },
  visible: { y: 0, transition: { duration: 0.38, ease: ease.out } },
  exit:    { y: '100%', transition: { duration: 0.28, ease: 'easeIn' } },
}

// Overlay backdrop
export const overlayFade: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.20 } },
  exit:    { opacity: 0, transition: { duration: 0.20 } },
}

// Tab content slide (direction: 1 = forward, -1 = back)
export function tabSlide(direction: 1 | -1): Variants {
  return {
    enter:  { x: direction > 0 ? 28 : -28, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.22, ease: ease.out } },
    exit:   {
      x: direction > 0 ? -28 : 28,
      opacity: 0,
      transition: { duration: 0.16 },
    },
  }
}

// Live glow pulse ring
export const liveRing: Variants = {
  pulse: {
    scale:   [1, 1.9],
    opacity: [0.7, 0],
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeOut' },
  },
}

// Score digit change
export const scoreDigit: Variants = {
  initial: { y: -16, opacity: 0 },
  animate: {
    y: 0, opacity: 1,
    transition: { ...spring.snappy },
  },
  exit: {
    y: 16, opacity: 0,
    transition: { duration: 0.14 },
  },
}
