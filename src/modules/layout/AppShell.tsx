'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { useRealtime }      from '@/modules/realtime/useRealtime'
import { LiveEventToast }   from '@/ui/components/LiveEventToast/LiveEventToast'
import { TeamModal }        from '@/modules/team-modal/TeamModal'

// ── Ambient animations ────────────────────────────────────────────────────────

const drift = keyframes`
  0%   { transform: translate(0,  0)   scale(1);    opacity: 0.5; }
  33%  { transform: translate(50px, -40px) scale(1.08); opacity: 0.7; }
  66%  { transform: translate(-25px, 25px) scale(0.96); opacity: 0.45; }
  100% { transform: translate(0,  0)   scale(1);    opacity: 0.5; }
`

// ── Styled elements ───────────────────────────────────────────────────────────

const Shell = styled.div`
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.base};
  display: flex;
  flex-direction: column;
  isolation: isolate;
`

/** Very subtle dot grid — light grey dots on white/light bg */
const DotGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(100, 116, 139, 0.10) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
`

/** Soft blue ambient blob — top left */
const GlowBlobBlue = styled.div`
  position: absolute;
  top: -20%;
  left: -15%;
  width: 55vw;
  height: 55vw;
  max-width: 700px;
  max-height: 700px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(37, 99, 235, 0.06) 0%,
    transparent 65%
  );
  animation: ${drift} 20s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

/** Soft amber ambient blob — bottom right */
const GlowBlobAmber = styled.div`
  position: absolute;
  bottom: -20%;
  right: -15%;
  width: 60vw;
  height: 60vw;
  max-width: 800px;
  max-height: 800px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(217, 119, 6, 0.05) 0%,
    transparent 65%
  );
  animation: ${drift} 26s ease-in-out infinite reverse;
  pointer-events: none;
  z-index: 0;

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

/** Soft red blob — center, visible only during live matches */
const GlowBlobLive = styled(motion.div)`
  position: absolute;
  top: 25%;
  left: 15%;
  width: 45vw;
  height: 45vw;
  max-width: 600px;
  max-height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(239, 68, 68, 0.05) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
`

/** All app content sits above the background layer */
const ContentLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

interface AppShellProps {
  children: React.ReactNode
  hasLiveMatches?: boolean
}

function RealtimeProvider() {
  useRealtime({ speed: 'normal', autoStart: true })
  return null
}

export function AppShell({ children, hasLiveMatches = false }: AppShellProps) {
  return (
    <Shell>
      <DotGrid aria-hidden="true" />
      <GlowBlobBlue aria-hidden="true" />
      <GlowBlobAmber aria-hidden="true" />
      <GlowBlobLive
        aria-hidden="true"
        animate={
          hasLiveMatches
            ? { opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }
            : { opacity: 0 }
        }
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <ContentLayer>{children}</ContentLayer>

      {/* Realtime simulation — boots MockWebSocket + SimulationEngine */}
      <RealtimeProvider />

      {/* Live event toasts — portal-rendered above everything */}
      <LiveEventToast />

      {/* Team detail modal — portal-rendered at z-index 500 */}
      <TeamModal />
    </Shell>
  )
}
