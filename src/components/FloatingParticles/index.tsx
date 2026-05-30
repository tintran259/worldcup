'use client'

import React, { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useParticles } from '@/hooks/useParticles'

interface FloatingParticlesProps {
  count?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Canvas-based ambient particle system — drifting micro-orbs in FIFA blue,
 * emerald, gold, and slate. Disabled when prefers-reduced-motion is set.
 * The canvas fills its nearest position:relative parent.
 */
export function FloatingParticles({
  count = 24,
  className,
  style,
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()

  useParticles(canvasRef, count, !prefersReduced)

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  )
}
