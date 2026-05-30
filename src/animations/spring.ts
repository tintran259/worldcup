/**
 * Spring physics presets for Framer Motion transitions.
 * Use these instead of raw spring objects to keep physics consistent.
 */

export const spring = {
  /** Snappy: fast and decisive. Buttons, toggles. */
  snappy: { type: 'spring', stiffness: 420, damping: 32 } as const,
  /** Smooth: medium speed. Cards, panels. */
  smooth: { type: 'spring', stiffness: 220, damping: 28 } as const,
  /** Bouncy: visible overshoot. Celebratory moments. */
  bouncy: { type: 'spring', stiffness: 360, damping: 22 } as const,
  /** Slow: deliberate. Large layout shifts. */
  slow: { type: 'spring', stiffness: 120, damping: 20 } as const,
  /** Micro: instant. Small indicators. */
  micro: { type: 'spring', stiffness: 600, damping: 42 } as const,
} as const

/**
 * Cubic-bezier easing curves.
 * Mirrors CSS timing-function for consistent easing across libraries.
 */
export const ease = {
  /** Expo out — snappy deceleration. Default for most entrances. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Expo in — slow start, fast finish. Exits only. */
  in: [0.7, 0, 1, 1] as const,
  /** Expo in-out — symmetric. Full-screen transitions. */
  inOut: [0.87, 0, 0.13, 1] as const,
  /** Broadcast snap — fast and precise. Score updates, counters. */
  snap: [0.25, 1, 0.5, 1] as const,
} as const
