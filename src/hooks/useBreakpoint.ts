'use client'

import { useState, useEffect } from 'react'
import { breakpointValues } from '@/theme/breakpoints'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

function getCurrentBreakpoint(width: number): Breakpoint {
  if (width < breakpointValues.sm) return 'sm'
  if (width < breakpointValues.md) return 'md'
  if (width < breakpointValues.lg) return 'lg'
  if (width < breakpointValues.xl) return 'xl'
  return '2xl'
}

export function useBreakpoint() {
  const [bp, setBp] = useState<Breakpoint>('xl')

  useEffect(() => {
    const update = () => setBp(getCurrentBreakpoint(window.innerWidth))
    update()

    let raf: number
    const handler = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    window.addEventListener('resize', handler, { passive: true })
    return () => {
      window.removeEventListener('resize', handler)
      cancelAnimationFrame(raf)
    }
  }, [])

  return {
    bp,
    isMobile: bp === 'sm' || bp === 'md',
    isTablet: bp === 'lg',
    isDesktop: bp === 'xl' || bp === '2xl',
    isWide: bp === '2xl',
    // Panel becomes a side-by-side column at xl+
    hasSidePanel: bp === 'xl' || bp === '2xl',
    // Bracket collapses to vertical at mobile
    isBracketVertical: bp === 'sm' || bp === 'md',
  }
}
