'use client'

import { useRealtime }           from '@/modules/realtime/useRealtime'
import { LiveEventToast }         from '@/components/LiveEventToast'
import { TeamModal }              from '@/sections/team-modal'
import { liveBlobAnimate, liveBlobTransition } from './animations/blobs'
import {
  Shell,
  DotGrid,
  GlowBlobBlue,
  GlowBlobAmber,
  GlowBlobLive,
  ContentLayer,
} from './styles'

export interface AppShellProps {
  children:        React.ReactNode
  hasLiveMatches?: boolean
}

/** Boots MockWebSocket + SimulationEngine — renders nothing itself. */
function RealtimeProvider() {
  useRealtime({ speed: 'normal', autoStart: true })
  return null
}

export function AppShell({ children, hasLiveMatches = false }: AppShellProps) {
  return (
    <Shell>
      {/* Ambient background layer */}
      <DotGrid aria-hidden="true" />
      <GlowBlobBlue  aria-hidden="true" />
      <GlowBlobAmber aria-hidden="true" />
      <GlowBlobLive
        aria-hidden="true"
        animate={liveBlobAnimate(hasLiveMatches)}
        transition={liveBlobTransition}
      />

      {/* All page content above background */}
      <ContentLayer>{children}</ContentLayer>

      {/* Global side-effects — no visual output */}
      <RealtimeProvider />
      <LiveEventToast />
      <TeamModal />
    </Shell>
  )
}
