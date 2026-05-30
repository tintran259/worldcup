'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Fires a GSAP scale-pop animation on the referenced element whenever
 * the score value changes. Safe on first render — only plays on updates.
 */
export function useScoreFlip(
  elRef:  React.RefObject<HTMLElement | null>,
  score:  number | undefined,
) {
  const prev        = useRef<number | undefined>(score)
  const firstRender = useRef(true)

  useEffect(() => {
    // Skip the initial render so mounting doesn't trigger the flash
    if (firstRender.current) {
      firstRender.current = false
      prev.current = score
      return
    }

    if (score === undefined || score === prev.current) return
    prev.current = score

    const el = elRef.current
    if (!el) return

    gsap.killTweensOf(el)
    gsap.timeline()
      .to(el, {
        scale:      1.50,
        textShadow: '0 0 18px rgba(251,191,36,0.80)',
        duration:   0.12,
        ease:       'power2.in',
      })
      .to(el, {
        scale:      1.00,
        textShadow: '0 0 0px rgba(251,191,36,0)',
        duration:   0.45,
        ease:       'elastic.out(1.3, 0.55)',
      })
  }, [score, elRef])
}
