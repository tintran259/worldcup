'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { LivePulse }           from '@/components/LivePulse'
import { usePanelStore, useFavoritesStore, useCompetitionStore } from '@/stores'
import { useBreakpoint }        from '@/hooks/useBreakpoint'
import { useCompetition }       from '@/hooks/useCompetition'
import { useHeaderStats }       from './hooks/useHeaderStats'
import {
  TOURNAMENT_ROUNDS,
  ROUND_SHORT_LABELS,
  ROUND_LABELS_VI,
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
  TitleButton,
  TitleBlock,
  TitleChevron,
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
  FilterBtn,
  FilterBadge,
  FilterLabel,
} from './styles'

// Vòng đấu hiển thị trên progress dot trail (GS → R32 → R16 → QF → SF → F)
// Bỏ 'third-place' vì không nằm trong main path của bracket.
const DISPLAY_ROUNDS = TOURNAMENT_ROUNDS.filter((r) => r !== 'third-place')
const DISPLAY_LABELS = DISPLAY_ROUNDS.map((r) => ROUND_SHORT_LABELS[r])

export function Header() {
  const { isCollapsed, toggleCollapse, openMobilePanel, isMobileOpen } = usePanelStore()
  const { isMobile }                   = useBreakpoint()
  const {
    liveCount,
    completedCount,
    currentRound,
    isFinished,
  } = useHeaderStats()
  const competition                    = useCompetition()

  // Label trên phase pill — dynamic theo current round
  const phaseLabel = isFinished
    ? 'Đã kết thúc'
    : ROUND_LABELS_VI[currentRound]

  // Index của currentRound trong DISPLAY_ROUNDS (cho progress dots).
  // Nếu giải đã xong → coi như cuối cùng (active dot cuối).
  const displayPhaseIndex = isFinished
    ? DISPLAY_ROUNDS.length - 1
    : Math.max(0, DISPLAY_ROUNDS.indexOf(currentRound === 'third-place' ? 'final' : currentRound))

  // Competition switcher — mở modal chọn giải
  const openCompetitionSwitcher = useCompetitionStore((s) => s.openModal)

  // Favorites filter — số đội đã chọn + mở modal
  const { teamIds: favoriteIds, openModal: openFavorites } = useFavoritesStore()
  const favCount = favoriteIds.length

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
        <TitleButton
          onClick={openCompetitionSwitcher}
          whileTap={{ scale: 0.96 }}
          title="Đổi giải đấu"
          aria-label="Chọn giải đấu khác"
        >
          <TitleBlock>
            <TournamentYear>{competition.year}</TournamentYear>
            <TournamentSubtitle>
              {competition.title.replace(/^FIFA\s+/, '')}
            </TournamentSubtitle>
          </TitleBlock>
          <TitleChevron aria-hidden="true">▾</TitleChevron>
        </TitleButton>
      </LogoSection>

      {/* ── Center: phase indicator + match counts ── */}
      <CenterSection>
        <PhasePill
          variants={phasePillEntrance}
          initial="hidden"
          animate="visible"
        >
          <PhaseLabel>{phaseLabel}</PhaseLabel>
          <PhaseProgress>
            {DISPLAY_LABELS.map((phase, idx) => (
              <ProgressDot
                key={phase}
                $active={idx === displayPhaseIndex}
                $done={idx < displayPhaseIndex}
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

      {/* ── Right: filter + connection status + panel toggle ── */}
      <RightSection>
        <FilterBtn
          onClick={openFavorites}
          whileTap={{ scale: 0.95 }}
          $active={favCount > 0}
          aria-label="Filter favorite teams"
          title="Lọc theo đội yêu thích"
        >
          {/* Funnel icon */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M1 1.5h11l-4.2 5v4.5l-2.6-1.3V6.5L1 1.5z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <FilterLabel>Đội yêu thích</FilterLabel>
          {favCount > 0 && <FilterBadge>{favCount}</FilterBadge>}
        </FilterBtn>

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
