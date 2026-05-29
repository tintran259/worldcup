'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Plays a one-shot cinematic reveal on the bento grid.
 *
 * Elements are targeted by data-intro="<slot>" attributes:
 *   header   → slide down
 *   bracket  → scale + blur reveal
 *   bento    → stagger slide from right
 *   footer   → fade in
 *
 * GSAP handles the intro; Framer Motion handles all subsequent interactions.
 * clearProps:'filter,transform' is applied at the end so styled-components
 * CSS takes over cleanly.
 */
export function useGSAPIntro(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  const played = useRef(false)

  useEffect(() => {
    if (!enabled || played.current) return
    const container = containerRef.current
    if (!container) return

    played.current = true

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(container)

      const header  = q<HTMLElement>('[data-intro="header"]')
      const bracket = q<HTMLElement>('[data-intro="bracket"]')
      const bento   = q<HTMLElement>('[data-intro="bento"]')
      const footer  = q<HTMLElement>('[data-intro="footer"]')

      // Initialise all targets to invisible so there's no flash before gsap fires
      if (header.length)  gsap.set(header,  { opacity: 0, y: -18 })
      if (bracket.length) gsap.set(bracket, { opacity: 0, scale: 0.97, filter: 'blur(6px)' })
      if (bento.length)   gsap.set(bento,   { opacity: 0, x: 22, filter: 'blur(3px)' })
      if (footer.length)  gsap.set(footer,  { opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          // Let styled-components own the transform / filter after intro
          if (bracket.length) gsap.set(bracket, { clearProps: 'filter,scale' })
          if (bento.length)   gsap.set(bento,   { clearProps: 'filter,x' })
          if (header.length)  gsap.set(header,  { clearProps: 'y' })
        },
      })

      if (header.length) {
        tl.to(header, { opacity: 1, y: 0, duration: 0.48 }, 0)
      }

      if (bracket.length) {
        tl.to(bracket, {
          opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.62,
        }, 0.06)
      }

      if (bento.length) {
        tl.to(bento, {
          opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.50,
          stagger: { amount: 0.22, from: 'start' },
        }, 0.14)
      }

      if (footer.length) {
        tl.to(footer, { opacity: 1, duration: 0.35 }, 0.38)
      }
    }, container)

    return () => ctx.revert()
  }, [containerRef, enabled])
}
