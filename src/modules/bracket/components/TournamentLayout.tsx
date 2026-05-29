'use client'

import { useRef } from 'react'
import styled from 'styled-components'
import { AppShell }          from '@/modules/layout/AppShell'
import { Header }            from '@/modules/layout/Header'
import { Footer }            from '@/modules/layout/Footer'
import { BentoCard }         from '@/modules/layout/BentoCard'
import { MobileBentoTabs }   from '@/modules/layout/MobileBentoTabs'
import { BracketCanvas }     from './BracketCanvas'
import { LiveMatchesTab }    from '@/modules/side-panel/tabs/LiveMatchesTab'
import { StandingsTab }      from '@/modules/side-panel/tabs/StandingsTab'
import { MatchHistoryTab }   from '@/modules/side-panel/tabs/MatchHistoryTab'
import { StatsTab }          from '@/modules/side-panel/tabs/StatsTab'
import { FloatingParticles } from '@/ui/components/FloatingParticles/FloatingParticles'
import { useGSAPIntro }      from '@/lib/animation'
import { MOCK_ROUNDS }       from '@/lib/constants/mockData'

// ── Grid constants ─────────────────────────────────────────────────────────────

const GAP       = 10
const RIGHT_COL = '290px'

// ── Bento page grid ───────────────────────────────────────────────────────────

const BentoPage = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  padding: ${GAP}px;
  gap: ${GAP}px;

  /* Desktop xl+: 3 columns, 4 rows */
  grid-template-columns: 1fr ${RIGHT_COL} ${RIGHT_COL};
  grid-template-rows: 60px 1fr 1fr 40px;
  grid-template-areas:
    'header   header    header'
    'bracket  live      stats'
    'bracket  standings history'
    'footer   footer    footer';

  /* Tablet lg (1024–1279): 2 columns */
  ${(p) => p.theme.mq.maxXl} {
    grid-template-columns: 1fr ${RIGHT_COL};
    grid-template-rows: 60px 1fr 1fr auto 40px;
    grid-template-areas:
      'header   header'
      'bracket  live'
      'bracket  standings'
      'history  stats'
      'footer   footer';
  }

  /* Mobile <md: single column — side cards collapse into a tab switcher */
  ${(p) => p.theme.mq.maxMd} {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 340px auto 40px;
    grid-template-areas:
      'header'
      'bracket'
      'tabs'
      'footer';
    height: auto;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
`

// ── Grid area cells ────────────────────────────────────────────────────────────

const HeaderCell = styled.div`
  grid-area: header;
  border-radius: 14px;
  overflow: hidden;
  & > header {
    height: 100%;
    border-radius: 14px;
  }
`

// Bracket hero — plain div so GSAP controls the intro (no FM conflict)
const BracketCell = styled.div`
  grid-area: bracket;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.card};

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 16px 16px 0 0;
    background: linear-gradient(90deg, rgba(37,99,235,0.48) 0%, transparent 55%);
    z-index: 1;
    pointer-events: none;
  }
`

const BracketOverlay = styled.div`
  position: absolute;
  top: 12px; left: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.90);
  backdrop-filter: blur(8px);
  border: 1px solid ${(p) => p.theme.colors.border.default};
  box-shadow: ${(p) => p.theme.shadows.xs};
  pointer-events: none;
`

const OverlayDot = styled.div`
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: 0 0 6px var(--accent-primary);
`

const OverlayLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

// Desktop/tablet-only side cells — hidden on mobile via CSS
const LiveCell = styled.div`
  grid-area: live;
  display: flex;
  flex-direction: column;
  min-height: 0;

  ${(p) => p.theme.mq.maxMd} { display: none; }
`
const StatsCell = styled.div`
  grid-area: stats;
  display: flex;
  flex-direction: column;
  min-height: 0;

  ${(p) => p.theme.mq.maxMd} { display: none; }
`
const StandingsCell = styled.div`
  grid-area: standings;
  display: flex;
  flex-direction: column;
  min-height: 0;

  ${(p) => p.theme.mq.maxMd} { display: none; }
`
const HistoryCell = styled.div`
  grid-area: history;
  display: flex;
  flex-direction: column;
  min-height: 0;

  ${(p) => p.theme.mq.maxMd} { display: none; }
`

// Mobile-only tab switcher — hidden on tablet/desktop
const MobileTabsCell = styled.div`
  grid-area: tabs;
  display: none;
  flex-direction: column;
  min-height: 360px;

  ${(p) => p.theme.mq.maxMd} { display: flex; }
`

const FooterCell = styled.div`
  grid-area: footer;
  border-radius: 10px;
  overflow: hidden;
  & > footer { height: 100%; border-radius: 10px; }
`

// ── Component ─────────────────────────────────────────────────────────────────

export function TournamentLayout() {
  const allMatches     = MOCK_ROUNDS.flatMap((r) => r.matches)
  const hasLiveMatches = allMatches.some((m) => m.status === 'live')
  const liveCount      = allMatches.filter((m) => m.status === 'live').length

  const containerRef = useRef<HTMLDivElement>(null)
  useGSAPIntro(containerRef)

  return (
    <AppShell hasLiveMatches={hasLiveMatches}>
      <BentoPage ref={containerRef}>

        {/* ── Header ── */}
        <HeaderCell data-intro="header">
          <Header />
        </HeaderCell>

        {/* ── Bracket hero ── */}
        <BracketCell data-intro="bracket">
          <FloatingParticles count={20} style={{ zIndex: 0 }} />
          <BracketOverlay>
            <OverlayDot />
            <OverlayLabel>Bracket Explorer</OverlayLabel>
          </BracketOverlay>
          <BracketCanvas rounds={MOCK_ROUNDS} />
        </BracketCell>

        {/* ── Desktop/tablet side cards ── */}
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

        {/* ── Mobile tab switcher (replaces the 4 cards above) ── */}
        <MobileTabsCell data-intro="bento">
          <MobileBentoTabs />
        </MobileTabsCell>

        {/* ── Footer ── */}
        <FooterCell data-intro="footer">
          <Footer />
        </FooterCell>

      </BentoPage>
    </AppShell>
  )
}
