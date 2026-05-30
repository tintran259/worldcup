'use client'

import { useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LiveMatchesTab } from '@/sections/live-matches'
import { StandingsTab } from '@/sections/standings'
import { MatchHistoryTab } from '@/sections/match-history'
import { StatsTab } from '@/sections/stats'
import { useHeaderStats }   from '@/sections/header/hooks/useHeaderStats'
import { tabPanelSlide }    from './animations/tabs'
import {
  Root,
  TabBar,
  TabBtn,
  TabLabel,
  LiveBadge,
  ContentWrap,
  Panel,
  AccentBar,
} from './styles'

type TabId = 'live' | 'standings' | 'results' | 'stats'
type Accent = 'live' | 'mint' | 'gold' | 'cyan'

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

function renderTab(id: TabId) {
  switch (id) {
    case 'live': return <LiveMatchesTab />
    case 'standings': return <StandingsTab />
    case 'results': return <MatchHistoryTab />
    case 'stats': return <StatsTab />
  }
}


export function MobileBentoTabs() {
  const [active, setActive] = useState<TabId>('live')
  const prevIdx = useRef(0)

  const { liveCount } = useHeaderStats()

  const currentIdx = TABS.findIndex((t) => t.id === active)
  const dir = currentIdx >= prevIdx.current ? 1 : -1
  const activeAccent = TABS.find((t) => t.id === active)!.accent

  const handleTabClick = (id: TabId) => {
    prevIdx.current = currentIdx
    setActive(id)
  }

  return (
    <Root>
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
            variants={tabPanelSlide(dir)}
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
