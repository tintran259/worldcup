'use client'

import React, { useId, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ConnectorPath } from '../../types'

export interface SVGConnectionsProps {
  connectors: ConnectorPath[]
  width:      number
  height:     number
}

// Connector colour tokens
const C = {
  neutral:       'rgba(203, 213, 225, 0.55)',
  active:        'rgba(37,  99,  235, 0.95)',
  winner:        'rgba(16,  185, 129, 0.95)',
  live:          'rgba(239,  68,  68, 0.95)',
  glowActive:    'rgba(37,  99,  235, 0.60)',
  glowWinner:    'rgba(16,  185, 129, 0.55)',
  glowLive:      'rgba(239,  68,  68, 0.55)',
  liveFlow:      'rgba(252, 165, 165, 0.50)',
  winnerShimmer: 'rgba(167, 243, 208, 0.50)',
  jointNeutral:  'rgba(203, 213, 225, 0.75)',
  jointLive:     'rgba(239,  68,  68, 0.90)',
  jointWinner:   'rgba(16,  185, 129, 0.90)',
  jointActive:   'rgba(37,  99,  235, 0.90)',
} as const

// Stagger: earlier rounds draw first (bracket builds left → right)
const ROUND_BASE_DELAY = [0, 0.32, 0.62, 0.88, 1.10] as const

function getDelay(c: ConnectorPath): number {
  const base = ROUND_BASE_DELAY[c.roundIndex] ?? c.roundIndex * 0.28
  return base + c.matchIndex * 0.025
}

const pathDraw = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity:    1,
    transition: {
      pathLength: { duration: 0.58, delay, ease: [0.25, 1, 0.5, 1] as const },
      opacity:    { duration: 0.12, delay },
    },
  }),
  exit: {
    pathLength: 0,
    opacity:    0,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
}

// CSS-in-SVG keyframes for animated line effects
const SVG_STYLES = `
  @keyframes bc-flow         { to { stroke-dashoffset: -22; } }
  @keyframes bc-live-breathe { 0%,100% { stroke-opacity: 0.95; } 50% { stroke-opacity: 0.40; } }
  @keyframes bc-winner-pulse { 0%,100% { stroke-opacity: 0.90; } 50% { stroke-opacity: 0.46; } }
  @keyframes bc-shimmer      { 0%   { stroke-dashoffset: 0;    } 100% { stroke-dashoffset: -260; } }
  @keyframes bc-dot-pop      { 0%   { r: 0;   opacity: 0; } 60% { r: 3.2; opacity: 1; } 100% { r: 2.6; opacity: 1; } }
  @keyframes bc-dot-live     { 0%,100% { r: 2.6; opacity: 0.90; } 50% { r: 3.8; opacity: 0.55; } }

  .bc-live-main   { animation: bc-live-breathe 2.4s ease-in-out infinite; }
  .bc-live-flow   { stroke-dasharray: 6 5; animation: bc-flow 0.48s linear infinite; }
  .bc-winner-main { animation: bc-winner-pulse 2.8s ease-in-out infinite; }
  .bc-shimmer     { stroke-dasharray: 10 200; animation: bc-shimmer 2.8s ease-in-out infinite; }
  .bc-dot-pop     { animation: bc-dot-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .bc-dot-live    { animation: bc-dot-live 2.0s ease-in-out infinite; }
`

// SVG filter definitions for glow halos
function Filters({ uid }: { uid: string }) {
  return (
    <>
      <filter id={`${uid}-ga`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6"   result="h1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="h2" />
        <feMerge><feMergeNode in="h1" /><feMergeNode in="h2" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id={`${uid}-gw`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5"   result="h1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="h2" />
        <feMerge><feMergeNode in="h1" /><feMergeNode in="h2" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id={`${uid}-gl`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="h1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="h2" />
        <feMerge><feMergeNode in="h1" /><feMergeNode in="h2" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </>
  )
}

// Parse the elbow point (midX, y2) from "M x1 y1 H midX V y2 H x2"
function parseJoint(d: string): { x: number; y: number } | null {
  const m = d.match(/M\s+([\d.]+)\s+([\d.]+)\s+H\s+([\d.]+)\s+V\s+([\d.]+)/)
  if (!m) return null
  return { x: parseFloat(m[3]), y: parseFloat(m[4]) }
}

export function SVGConnections({ connectors, width, height }: SVGConnectionsProps) {
  const uid = useId().replace(/:/g, 'u')

  const groups = useMemo(() => {
    const active:  ConnectorPath[] = []
    const winners: ConnectorPath[] = []
    const live:    ConnectorPath[] = []
    const neutral: ConnectorPath[] = []

    for (const c of connectors) {
      if      (c.isActivePath)                  active.push(c)
      else if (c.isWinnerPath && !c.isLivePath) winners.push(c)
      else if (c.isLivePath)                    live.push(c)
      else                                      neutral.push(c)
    }
    return { active, winners, live, neutral }
  }, [connectors])

  const { active, winners, live, neutral } = groups

  return (
    <svg
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible', zIndex: 0,
      }}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <defs>
        <style>{SVG_STYLES}</style>
        <Filters uid={uid} />
      </defs>

      {/* Layer 1 — glow halos */}
      <g aria-hidden="true" opacity={0.70}>
        {live.map((c) => (
          <path key={`${c.id}-h`} d={c.d} fill="none" stroke={C.glowLive}
            strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
            filter={`url(#${uid}-gl)`} />
        ))}
        {winners.map((c) => (
          <path key={`${c.id}-h`} d={c.d} fill="none" stroke={C.glowWinner}
            strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round"
            filter={`url(#${uid}-gw)`} />
        ))}
        {active.map((c) => (
          <path key={`${c.id}-h`} d={c.d} fill="none" stroke={C.glowActive}
            strokeWidth={6} strokeLinejoin="round" strokeLinecap="round"
            filter={`url(#${uid}-ga)`} />
        ))}
      </g>

      {/* Layer 2 — Framer Motion path draw (pathLength 0 → 1) */}
      <AnimatePresence>
        {neutral.map((c) => (
          <motion.path key={c.id} d={c.d} fill="none" stroke={C.neutral}
            strokeWidth={1.2} strokeLinejoin="miter" strokeLinecap="round"
            custom={getDelay(c)} variants={pathDraw}
            initial="hidden" animate="visible" exit="exit" />
        ))}
        {live.map((c) => (
          <motion.path key={c.id} d={c.d} fill="none" stroke={C.live}
            strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
            className="bc-live-main"
            custom={getDelay(c)} variants={pathDraw}
            initial="hidden" animate="visible" exit="exit" />
        ))}
        {winners.map((c) => (
          <motion.path key={c.id} d={c.d} fill="none" stroke={C.winner}
            strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"
            className="bc-winner-main"
            custom={getDelay(c)} variants={pathDraw}
            initial="hidden" animate="visible" exit="exit" />
        ))}
        {active.map((c) => (
          <motion.path key={c.id} d={c.d} fill="none" stroke={C.active}
            strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round"
            custom={getDelay(c)} variants={pathDraw}
            initial="hidden" animate="visible" exit="exit" />
        ))}
      </AnimatePresence>

      {/* Layer 3 — CSS effect overlays (marching ants, shimmer) */}
      <g aria-hidden="true">
        {live.map((c) => (
          <path key={`${c.id}-flow`} d={c.d} fill="none" stroke={C.liveFlow}
            strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round"
            className="bc-live-flow" />
        ))}
        {winners.map((c, i) => (
          <path key={`${c.id}-sh`} d={c.d} fill="none" stroke={C.winnerShimmer}
            strokeWidth={3} strokeLinejoin="round" strokeLinecap="round"
            className="bc-shimmer" style={{ animationDelay: `${i * 0.55}s` }} />
        ))}
        {active.map((c, i) => (
          <path key={`${c.id}-sh`} d={c.d} fill="none" stroke="rgba(147,197,253,0.42)"
            strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
            className="bc-shimmer" style={{ animationDelay: `${i * 0.38 + 0.2}s` }} />
        ))}
      </g>

      {/* Layer 4 — corner joint dots at each elbow */}
      <g aria-hidden="true">
        {neutral.map((c) => {
          const j = parseJoint(c.d)
          return j ? (
            <circle key={`${c.id}-j`} cx={j.x} cy={j.y} r={2.4}
              fill={C.jointNeutral} className="bc-dot-pop"
              style={{ animationDelay: `${getDelay(c) + 0.55}s` }} />
          ) : null
        })}
        {winners.map((c) => {
          const j = parseJoint(c.d)
          return j ? (
            <circle key={`${c.id}-j`} cx={j.x} cy={j.y} r={2.8}
              fill={C.jointWinner} className="bc-dot-pop"
              style={{ animationDelay: `${getDelay(c) + 0.52}s` }} />
          ) : null
        })}
        {live.map((c) => {
          const j = parseJoint(c.d)
          return j ? (
            <circle key={`${c.id}-j`} cx={j.x} cy={j.y} r={3}
              fill={C.jointLive} className="bc-dot-live" />
          ) : null
        })}
        {active.map((c) => {
          const j = parseJoint(c.d)
          return j ? (
            <circle key={`${c.id}-j`} cx={j.x} cy={j.y} r={2.8}
              fill={C.jointActive} className="bc-dot-pop"
              style={{ animationDelay: `${getDelay(c) + 0.50}s` }} />
          ) : null
        })}
      </g>
    </svg>
  )
}
