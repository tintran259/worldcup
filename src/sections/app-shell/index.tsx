'use client'

import { useRealtime } from '@/modules/realtime/useRealtime'
import { useRealtimeQueryBridge } from '@/modules/realtime/queryBridge'
import { useCompetition } from '@/hooks/useCompetition'
import { LiveEventToast } from '@/components/LiveEventToast'
import { QuotaBanner } from '@/components/QuotaBanner'
import { TeamModal } from '@/sections/team-modal'
import { FavoritesFilterModal } from '@/sections/favorites-filter'
import { CompetitionSwitcher } from '@/sections/competition-switcher'
import { UpcomingCompetitionModal } from '@/sections/upcoming-modal'
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
  children: React.ReactNode
  hasLiveMatches?: boolean
}

/** Boots realtime client (mock / SSE / WS) + bridges events to React Query. */
function RealtimeProvider() {
  const { queryEnabled } = useCompetition()
  // Disable simulation/realtime entirely khi competition chưa bắt đầu —
  // tránh queryBridge invalidate queries (sẽ refetch) hoặc SSE poll quota.
  useRealtime({ speed: 'normal', autoStart: queryEnabled })
  useRealtimeQueryBridge()
  return null
}

export function AppShell({ children, hasLiveMatches = false }: AppShellProps) {
  return (
    <Shell>
      {/* Ambient background layer */}
      <DotGrid aria-hidden="true" />
      <GlowBlobBlue aria-hidden="true" />
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
      <FavoritesFilterModal />
      <CompetitionSwitcher />
      <UpcomingCompetitionModal />
      <QuotaBanner />
    </Shell>
  )
}
