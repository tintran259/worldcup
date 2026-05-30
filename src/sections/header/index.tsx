'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { LivePulse }           from '@/components/LivePulse'
import { usePanelStore }        from '@/stores'
import { useBreakpoint }        from '@/hooks/useBreakpoint'
import { useHeaderStats }       from './hooks/useHeaderStats'
import {
  TOURNAMENT_ROUNDS,
  ROUND_SHORT_LABELS,
  CURRENT_PHASE_INDEX,
} from '@/constants/tournament'
import {
  headerEntrance,
  phasePillEntrance,
  liveCountEntrance,
} from './animations/header'
import {
  HeaderRoot,
  LogoSection,
  LogoMark,
  FifaWordmark,
  HeaderDivider,
  TitleBlock,
  TournamentYear,
  TournamentSubtitle,
  CenterSection,
  PhasePill,
  PhaseLabel,
  PhaseProgress,
  ProgressDot,
  CenterDivider,
  MatchCounter,
  CountLabel,
  CountValue,
  RightSection,
  ConnectionDot,
  ConnectionLabel,
  ConnectionGroup,
  PanelToggleBtn,
  ToggleIcon,
  MobilePanelBtn,
} from './styles'

// Phases shown in the progress dot trail (GS → R32 → R16 → QF → SF → F)
const DISPLAY_PHASES = TOURNAMENT_ROUNDS
  .filter((r) => r !== 'third-place')
  .map((r) => ROUND_SHORT_LABELS[r])

export function Header() {
  const { isCollapsed, toggleCollapse, openMobilePanel, isMobileOpen } = usePanelStore()
  const { isMobile }                   = useBreakpoint()
  const { liveCount, completedCount }  = useHeaderStats()

  const handlePanelAction = () => {
    if (isMobile) openMobilePanel()
    else toggleCollapse()
  }

  const isPanelVisible = isMobile ? isMobileOpen : !isCollapsed

  return (
    <HeaderRoot
      variants={headerEntrance}
      initial="hidden"
      animate="visible"
    >
      {/* ── Logo ── */}
      <LogoSection>
        <LogoMark>
          <FifaWordmark>FIFA</FifaWordmark>
        </LogoMark>
        <HeaderDivider />
        <TitleBlock>
          <TournamentYear>2026</TournamentYear>
          <TournamentSubtitle>World Cup</TournamentSubtitle>
        </TitleBlock>
      </LogoSection>

      {/* ── Center: phase indicator + match counts ── */}
      <CenterSection>
        <PhasePill
          variants={phasePillEntrance}
          initial="hidden"
          animate="visible"
        >
          <PhaseLabel>Vòng 32 đội</PhaseLabel>
          <PhaseProgress>
            {DISPLAY_PHASES.map((phase, idx) => (
              <ProgressDot
                key={phase}
                $active={idx === CURRENT_PHASE_INDEX}
                $done={idx < CURRENT_PHASE_INDEX}
                title={phase}
              />
            ))}
          </PhaseProgress>
        </PhasePill>

        <CenterDivider />

        <MatchCounter>
          <CountLabel>Completed</CountLabel>
          <CountValue>{completedCount}</CountValue>
        </MatchCounter>

        {/* Live count — animates in/out as live matches start/end */}
        <AnimatePresence>
          {liveCount > 0 && (
            <motion.div
              key="live-count"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              variants={liveCountEntrance}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CenterDivider />
              <LivePulse size="sm" showLabel />
              <CountValue style={{ color: 'var(--accent-live)', fontSize: '18px' }}>
                {liveCount}
              </CountValue>
            </motion.div>
          )}
        </AnimatePresence>
      </CenterSection>

      {/* ── Right: connection status + panel toggle ── */}
      <RightSection>
        <ConnectionGroup>
          <ConnectionDot
            $status="connected"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <ConnectionLabel>Live</ConnectionLabel>
        </ConnectionGroup>

        <PanelToggleBtn onClick={handlePanelAction} whileTap={{ scale: 0.96 }}>
          <ToggleIcon $open={isPanelVisible} />
          {isPanelVisible ? 'Hide Panel' : 'Show Panel'}
        </PanelToggleBtn>

        <MobilePanelBtn onClick={handlePanelAction} whileTap={{ scale: 0.94 }}>
          ☰
        </MobilePanelBtn>
      </RightSection>
    </HeaderRoot>
  )
}
