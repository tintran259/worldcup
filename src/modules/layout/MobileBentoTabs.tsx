'use client'

import { useState, useRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { LiveMatchesTab } from '@/modules/side-panel/tabs/LiveMatchesTab'
import { StandingsTab } from '@/modules/side-panel/tabs/StandingsTab'
import { MatchHistoryTab } from '@/modules/side-panel/tabs/MatchHistoryTab'
import { StatsTab } from '@/modules/side-panel/tabs/StatsTab'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'

// ── Tab config ────────────────────────────────────────────────────────────────

type TabId = 'live' | 'standings' | 'results' | 'stats'
type Accent = 'live' | 'mint' | 'gold' | 'cyan'

const ACCENT_COLOR: Record<Accent, string> = {
  live: 'var(--accent-live)',
  mint: 'var(--accent-trail)',
  gold: 'var(--accent-winner)',
  cyan: 'var(--accent-primary)',
}

interface TabConfig {
  id: TabId
  label: string
  accent: Accent
}

const TABS: TabConfig[] = [
  { id: 'live', label: 'Live', accent: 'live' },
  { id: 'standings', label: 'Standings', accent: 'mint' },
  { id: 'results', label: 'Results', accent: 'gold' },
  { id: 'stats', label: 'Stats', accent: 'cyan' },
]

// ── Styled ────────────────────────────────────────────────────────────────────

const Root = styled.div`
  flex: 1;          /* fills MobileTabsCell (flex column parent) */
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(18px);
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.card};
`

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TabBar = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(248, 250, 252, 0.95);
  padding: 0 4px;
  gap: 2px;
`

const TabBtn = styled.button<{ $active: boolean; $accent: Accent }>`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
  transition: background 0.15s ease, color 0.15s ease;
  padding: 0 4px;

  color: ${(p) =>
    p.$active
      ? ACCENT_COLOR[p.$accent]
      : p.theme.colors.text.muted};

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.03);
    color: ${(p) =>
    p.$active
      ? ACCENT_COLOR[p.$accent]
      : p.theme.colors.text.secondary};
  }

  /* Active indicator bar at bottom */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${(p) => p.$active ? ACCENT_COLOR[p.$accent] : 'transparent'};
    transition: background 0.18s ease;
  }
`

const TabLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  text-transform: uppercase;
  line-height: 1;
`

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--accent-live);
  color: #fff;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  line-height: 1;
  flex-shrink: 0;
`

// ── Content ───────────────────────────────────────────────────────────────────

const ContentWrap = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
`

const Panel = styled(motion.div)`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 16px;

  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.22) transparent;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.25);
    border-radius: 2px;
  }
`

// ── Tab content accent top-bar ─────────────────────────────────────────────────

const AccentBar = styled(motion.div) <{ $accent: Accent }>`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    ${(p) => ACCENT_COLOR[p.$accent]} 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
`

// ── Slide variants ────────────────────────────────────────────────────────────

const slide = (dir: number) => ({
  enter: { x: dir > 0 ? 24 : -24, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { x: dir > 0 ? -24 : 24, opacity: 0, transition: { duration: 0.16 } },
})

// ── Content renderer ──────────────────────────────────────────────────────────

function renderTab(id: TabId) {
  switch (id) {
    case 'live': return <LiveMatchesTab />
    case 'standings': return <StandingsTab />
    case 'results': return <MatchHistoryTab />
    case 'stats': return <StatsTab />
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileBentoTabs() {
  const [active, setActive] = useState<TabId>('live')
  const prevIdx = useRef(0)

  const liveCount = MOCK_ROUNDS
    .flatMap((r) => r.matches)
    .filter((m) => m.status === 'live').length

  const currentIdx = TABS.findIndex((t) => t.id === active)
  const dir = currentIdx >= prevIdx.current ? 1 : -1

  const handleTabClick = (id: TabId) => {
    prevIdx.current = currentIdx
    setActive(id)
  }

  const activeAccent = TABS.find((t) => t.id === active)!.accent

  return (
    <Root>
      {/* ── Tab bar ── */}
      <TabBar role="tablist" aria-label="Tournament sections">
        {TABS.map((tab) => (
          <TabBtn
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            $active={active === tab.id}
            $accent={tab.accent}
            onClick={() => handleTabClick(tab.id)}
          >
            <TabLabel>{tab.label}</TabLabel>
            {tab.id === 'live' && liveCount > 0 && (
              <LiveBadge>{liveCount}</LiveBadge>
            )}
          </TabBtn>
        ))}
      </TabBar>

      {/* ── Animated content ── */}
      <ContentWrap>
        <AccentBar
          key={active}
          $accent={activeAccent}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.28 }}
        />

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <Panel
            key={active}
            custom={dir}
            variants={slide(dir)}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {renderTab(active)}
          </Panel>
        </AnimatePresence>
      </ContentWrap>
    </Root>
  )
}
