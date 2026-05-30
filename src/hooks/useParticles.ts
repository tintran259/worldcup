'use client'

import { useEffect } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number
  alpha: number; alphaDir: number
  color: string
}

// RGBA colour components for the ambient particles (blue, emerald, gold, slate)
const COLORS = ['37,99,235', '16,185,129', '251,191,36', '148,163,184'] as const

function spawn(w: number, h: number, fromBottom = true): Particle {
  return {
    x:        Math.random() * w,
    y:        fromBottom ? h + Math.random() * 40 : Math.random() * h,
    vx:       (Math.random() - 0.5) * 0.20,
    vy:       -(0.08 + Math.random() * 0.16),
    r:        0.8 + Math.random() * 2.0,
    alpha:    fromBottom ? 0 : Math.random() * 0.10,
    alphaDir: 0.0014 + Math.random() * 0.0022,
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

/**
 * Draws softly-drifting ambient particles on a <canvas>.
 * Uses ResizeObserver + device-pixel-ratio aware sizing.
 * Respects `enabled` so callers can disable via prefers-reduced-motion.
 */
export function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  count  = 24,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let alive = true
    const dpr = window.devicePixelRatio || 1

    const fit = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()

    const ro = new ResizeObserver(fit)
    ro.observe(canvas)

    const cw = () => canvas.offsetWidth
    const ch = () => canvas.offsetHeight

    const particles: Particle[] = Array.from({ length: count }, () => spawn(cw(), ch(), false))

    const tick = () => {
      if (!alive) return
      const w = cw()
      const h = ch()
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaDir

        if (p.alpha >= 0.11) p.alphaDir = -Math.abs(p.alphaDir)
        if (p.alpha <= 0 || p.y < -12) { particles[i] = spawn(w, h); continue }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha.toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect() }
  }, [canvasRef, count, enabled])
}
