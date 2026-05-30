/**
 * Ambient background blob animation.
 *
 * The live blob appears only when there are active matches and pulses
 * to signal that real-time data is being received.
 */

/** Animate prop for the live glow blob. Shows when there are live matches. */
export function liveBlobAnimate(hasLiveMatches: boolean) {
  return hasLiveMatches
    ? { opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }
    : { opacity: 0 }
}

export const liveBlobTransition = {
  duration: 3.5,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}
