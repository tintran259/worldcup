'use client'

import { useRef } from 'react'
import { AppShell } from '@/sections/app-shell'
import { Header } from '@/sections/header'
import { Footer } from '@/sections/footer'
import { BentoCard } from '@/components/BentoCard'
import { MobileBentoTabs } from '@/sections/mobile-tabs'
import { BracketCanvas } from './components/BracketCanvas'
import { LiveMatchesTab } from '@/sections/live-matches'
import { StandingsTab } from '@/sections/standings'
import { MatchHistoryTab } from '@/sections/match-history'
import { StatsTab } from '@/sections/stats'
import { FloatingParticles } from '@/components/FloatingParticles'
import { useGSAPIntro } from '@/hooks/useGSAPIntro'
import { useBracketData } from './hooks/useBracketData'
import {
  BentoPage,
  HeaderCell,
  BracketCell,
  BracketOverlay,
  OverlayDot,
  OverlayLabel,
  LiveCell,
  StatsCell,
  StandingsCell,
  HistoryCell,
  MobileTabsCell,
  FooterCell,
} from './styles'

export function TournamentLayout() {
  const { rounds, hasLiveMatches, liveCount, isLoading } = useBracketData()

  const containerRef = useRef<HTMLDivElement>(null)
  useGSAPIntro(containerRef)

  return (
    <AppShell hasLiveMatches={hasLiveMatches}>
      <BentoPage ref={containerRef}>

        <HeaderCell data-intro="header">
          <Header />
        </HeaderCell>

        <BracketCell data-intro="bracket">
          <FloatingParticles count={20} style={{ zIndex: 0 }} />
          <BracketOverlay>
            <OverlayDot />
            <OverlayLabel>Bracket Explorer</OverlayLabel>
          </BracketOverlay>
          <BracketCanvas rounds={rounds} isLoading={isLoading} />
        </BracketCell>

        <LiveCell data-intro="bento">
          <BentoCard title="Live Now" accent="live"
            badge={liveCount > 0 ? liveCount : undefined} delay={0}>
            <LiveMatchesTab />
          </BentoCard>
        </LiveCell>

        <StatsCell data-intro="bento">
          <BentoCard title="Statistics" accent="cyan" delay={0}>
            <StatsTab />
          </BentoCard>
        </StatsCell>

        <StandingsCell data-intro="bento">
          <BentoCard title="Standings" accent="mint" delay={0}>
            <StandingsTab />
          </BentoCard>
        </StandingsCell>

        <HistoryCell data-intro="bento">
          <BentoCard title="Results" accent="gold" delay={0}>
            <MatchHistoryTab />
          </BentoCard>
        </HistoryCell>

        <MobileTabsCell data-intro="bento">
          <MobileBentoTabs />
        </MobileTabsCell>

        <FooterCell data-intro="footer">
          <Footer />
        </FooterCell>

      </BentoPage>
    </AppShell>
  )
}
