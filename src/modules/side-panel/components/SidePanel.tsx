'use client'

import React, { useRef, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { usePanelStore, PRIMARY_TABS } from '@/store'
import type { PrimaryTab } from '@/store'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { LivePulse } from '@/ui/primitives/LivePulse'
import { LiveMatchesTab } from '../tabs/LiveMatchesTab'
import { StandingsTab } from '../tabs/StandingsTab'
import { MatchHistoryTab } from '../tabs/MatchHistoryTab'
import { StatsTab } from '../tabs/StatsTab'
import { MatchDetailTab } from '../tabs/MatchDetailTab'
import { TeamStatsTab } from '../tabs/TeamStatsTab'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'

// ─── Tab config ───────────────────────────────────────────────────────────────

interface TabConfig {
  id: PrimaryTab
  label: string
  shortLabel: string
  icon: string
}

const TAB_CONFIG: TabConfig[] = [
  { id: 'live',      label: 'Live',      shortLabel: 'Live',   icon: '⬤' },
  { id: 'standings', label: 'Standings', shortLabel: 'Table',  icon: '▤' },
  { id: 'history',   label: 'History',   shortLabel: 'History', icon: '◷' },
  { id: 'stats',     label: 'Stats',     shortLabel: 'Stats',  icon: '▦' },
]

const TAB_ORDER = PRIMARY_TABS

// ─── Panel body (shared between desktop column and mobile/tablet drawer) ───────

const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TabBar = styled.nav`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(0, 0, 0, 0.25);
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const TabBtn = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  padding: 0 ${(p) => p.theme.space[2]};
  height: ${(p) => p.theme.componentSpacing.tabHeight};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  white-space: nowrap;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[1.5]};

  color: ${(p) =>
    p.$active ? p.theme.colors.text.primary : p.theme.colors.text.muted};

  &:hover:not(:disabled) {
    color: ${(p) => p.theme.colors.text.primary};
    background: rgba(255, 255, 255, 0.02);
  }

  /* Active underline bar */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${(p) => p.theme.space[2]};
    right: ${(p) => p.theme.space[2]};
    height: 2px;
    border-radius: 1px;
    background: ${(p) =>
      p.$active ? p.theme.colors.accent.primary : 'transparent'};
    box-shadow: ${(p) => (p.$active ? p.theme.glows.cyanSm : 'none')};
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }
`

const TabLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  text-transform: uppercase;
  line-height: 1;
`

const LiveDot = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.live};
  box-shadow: ${(p) => p.theme.glows.liveSm};
  animation: pulse-live 2s ease-in-out infinite;
  flex-shrink: 0;
`

// ─── Scrollable content area ──────────────────────────────────────────────────

const ContentArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

const TabContent = styled(motion.div)`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${(p) => p.theme.componentSpacing.panelPaddingY}
    ${(p) => p.theme.componentSpacing.panelPaddingX};

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`

// ─── Panel context header (shown when in match/team context tab) ──────────────

const ContextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.space[2]} ${(p) => p.theme.componentSpacing.panelPaddingX};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(0, 212, 255, 0.04);
  flex-shrink: 0;
`

const ContextLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
`

const ContextBack = styled.button`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  transition: color 0.15s ease;

  &:hover { color: ${(p) => p.theme.colors.text.primary}; }
`

// ─── DESKTOP variant — inline aside column ────────────────────────────────────

const DesktopAside = styled(motion.aside)`
  position: relative;
  width: var(--panel-width);
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.glass.frosted.background};
  backdrop-filter: ${(p) => p.theme.glass.frosted.backdropFilter};
  border-left: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.panel};
  overflow: hidden;
  z-index: ${(p) => p.theme.zIndex.panel};

  ${(p) => p.theme.mq['2xl']} {
    width: var(--panel-width-lg);
  }

  /* Only show as inline column on xl+ */
  ${(p) => p.theme.mq.maxXl} {
    display: none;
  }
`

// ─── TABLET variant — right-side overlay drawer ───────────────────────────────

const DrawerOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: ${(p) => p.theme.zIndex.modal - 1};

  /* Only on lg */
  ${(p) => p.theme.mq.maxLg} { display: none; }
  ${(p) => p.theme.mq.xl}    { display: none; }
`

const TabletDrawer = styled(motion.aside)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(var(--panel-width-lg), 90vw);
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.glass.frosted.background};
  backdrop-filter: ${(p) => p.theme.glass.frosted.backdropFilter};
  border-left: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.panel};
  overflow: hidden;
  z-index: ${(p) => p.theme.zIndex.modal};

  /* Only on lg (tablet landscape) */
  ${(p) => p.theme.mq.maxLg} { display: none; }
  ${(p) => p.theme.mq.xl}    { display: none; }
`

// ─── MOBILE variant — bottom sheet ───────────────────────────────────────────

const BottomSheetOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: ${(p) => p.theme.zIndex.modal - 1};

  /* Only on mobile */
  ${(p) => p.theme.mq.md} { display: none; }
`

const BottomSheet = styled(motion.aside)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 82dvh;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.glass.frosted.background};
  backdrop-filter: ${(p) => p.theme.glass.frosted.backdropFilter};
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: ${(p) => p.theme.radii['2xl']} ${(p) => p.theme.radii['2xl']} 0 0;
  box-shadow: 0 -8px 48px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  z-index: ${(p) => p.theme.zIndex.modal};

  /* Only on mobile */
  ${(p) => p.theme.mq.md} { display: none; }
`

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  flex-shrink: 0;
  cursor: grab;
  &:active { cursor: grabbing; }
`

const DragBar = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border.default};
`

// ─── Animation variants ───────────────────────────────────────────────────────

const panelSlideVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: 'easeOut' as const },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.24, ease: 'easeIn' as const },
  },
}

const sheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { duration: 0.38, ease: 'easeOut' as const },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.28, ease: 'easeIn' as const },
  },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const tabContentVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: 'easeOut' as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    transition: { duration: 0.16, ease: 'easeIn' as const },
  }),
}

// ─── Shared panel inner contents ──────────────────────────────────────────────

function PanelContents() {
  const { activeTab, previousTab, setTab } = usePanelStore()

  const currentIndex = TAB_ORDER.indexOf(activeTab as PrimaryTab)
  const prevIndex = previousTab
    ? TAB_ORDER.indexOf(previousTab as PrimaryTab)
    : currentIndex
  const direction = currentIndex >= prevIndex ? 1 : -1

  const liveCount = MOCK_ROUNDS.flatMap((r) =>
    r.matches.filter((m) => m.status === 'live')
  ).length

  // Context tabs override the normal tab content but we keep the tab bar active
  const isContextTab = activeTab === 'match' || activeTab === 'team'

  const renderContent = () => {
    switch (activeTab) {
      case 'live':      return <LiveMatchesTab />
      case 'standings': return <StandingsTab />
      case 'history':   return <MatchHistoryTab />
      case 'stats':     return <StatsTab />
      case 'match':     return <MatchDetailTab />
      case 'team':      return <TeamStatsTab />
    }
  }

  return (
    <PanelBody>
      {/* Context sub-header — back button when viewing match/team detail */}
      <AnimatePresence>
        {isContextTab && (
          <motion.div
            key="ctx-header"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', flexShrink: 0 }}
          >
            <ContextHeader>
              <ContextLabel>
                {activeTab === 'match' ? 'Match Detail' : 'Team Profile'}
              </ContextLabel>
              <ContextBack
                onClick={() =>
                  setTab(
                    (previousTab as PrimaryTab) ??
                    ('live' as PrimaryTab)
                  )
                }
              >
                ← Back
              </ContextBack>
            </ContextHeader>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab navigation bar */}
      <TabBar role="tablist" aria-label="Tournament information">
        {TAB_CONFIG.map((tab) => (
          <TabBtn
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            $active={activeTab === tab.id || (isContextTab && previousTab === tab.id)}
            onClick={() => setTab(tab.id)}
          >
            {tab.id === 'live' && liveCount > 0 && <LiveDot aria-hidden="true" />}
            <TabLabel>{tab.shortLabel}</TabLabel>
          </TabBtn>
        ))}
      </TabBar>

      {/* Tab content with slide animation */}
      <ContentArea>
        <AnimatePresence mode="wait" custom={direction}>
          <TabContent
            key={activeTab}
            custom={direction}
            variants={tabContentVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {renderContent()}
          </TabContent>
        </AnimatePresence>
      </ContentArea>
    </PanelBody>
  )
}

// ─── Exported component ───────────────────────────────────────────────────────

export function SidePanel() {
  const { isCollapsed, isMobileOpen, closeMobilePanel } = usePanelStore()
  const { hasSidePanel, isTablet, isMobile } = useBreakpoint()

  return (
    <>
      {/* ── DESKTOP: inline aside (xl+) ── */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <DesktopAside
            key="desktop-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'var(--panel-width)', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <PanelContents />
          </DesktopAside>
        )}
      </AnimatePresence>

      {/* ── TABLET: right-side overlay drawer (lg) ── */}
      <AnimatePresence>
        {isMobileOpen && isTablet && (
          <>
            <DrawerOverlay
              key="tablet-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMobilePanel}
            />
            <TabletDrawer
              key="tablet-drawer"
              variants={panelSlideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PanelContents />
            </TabletDrawer>
          </>
        )}
      </AnimatePresence>

      {/* ── MOBILE: bottom sheet (sm/md) ── */}
      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <>
            <BottomSheetOverlay
              key="mobile-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMobilePanel}
            />
            <BottomSheet
              key="mobile-sheet"
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DragHandle onClick={closeMobilePanel}>
                <DragBar />
              </DragHandle>
              <PanelContents />
            </BottomSheet>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
