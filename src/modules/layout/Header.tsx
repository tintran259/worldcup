'use client'

import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { LivePulse } from '@/ui/primitives/LivePulse'
import { usePanelStore } from '@/store'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'
import { useBreakpoint } from '@/hooks/useBreakpoint'

// ─── Animations ─────────────────────────────────────────────────────────────

const shimmerSlide = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

// ─── Root ────────────────────────────────────────────────────────────────────

const HeaderRoot = styled(motion.header)`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.panel};
  width: 100%;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
  padding: 0 ${(p) => p.theme.space[5]};

  /* Glassmorphism surface */
  background: ${(p) => p.theme.glass.frosted.background};
  backdrop-filter: ${(p) => p.theme.glass.frosted.backdropFilter};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};

  /* Bottom accent line */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(37, 99, 235, 0.35) 30%,
      rgba(37, 99, 235, 0.15) 70%,
      transparent 100%
    );
  }

  ${(p) => p.theme.mq.md} {
    padding: 0 ${(p) => p.theme.space[6]};
  }
`

// ─── Logo section ────────────────────────────────────────────────────────────

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  flex-shrink: 0;
`

const LogoMark = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
`

const FifaWordmark = styled.span`
  font-family: ${(p) => p.theme.fonts.display};
  font-size: ${(p) => p.theme.fontSizes['4xl']};
  letter-spacing: ${(p) => p.theme.letterSpacings.stadium};
  line-height: 1;
  color: ${(p) => p.theme.colors.text.primary};
  text-transform: uppercase;
  /* Subtle shimmer on the FIFA text */
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.text.primary} 0%,
    rgba(255, 255, 255, 0.9) 40%,
    ${(p) => p.theme.colors.text.primary} 80%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmerSlide} 6s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: none;
    -webkit-text-fill-color: ${(p) => p.theme.colors.text.primary};
    color: ${(p) => p.theme.colors.text.primary};
  }
`

const HeaderDivider = styled.div`
  width: 1px;
  height: 28px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${(p) => p.theme.colors.border.default},
    transparent
  );
  flex-shrink: 0;
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
`

const TournamentYear = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.accent.primary};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  text-shadow: ${(p) => p.theme.glows.textCyan};
  line-height: 1;
`

const TournamentSubtitle = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.stadium};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  line-height: 1;
`

// ─── Center section ──────────────────────────────────────────────────────────

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};

  /* Hide on mobile */
  ${(p) => p.theme.mq.maxMd} {
    display: none;
  }
`

const PhasePill = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[4]};
  border-radius: ${(p) => p.theme.radii.pill};
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.18);
`

const PhaseLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
`

const PhaseProgress = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1]};
`

const ProgressDot = styled.div<{ $active: boolean; $done: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active
      ? p.theme.colors.accent.primary
      : p.$done
        ? 'rgba(0,212,255,0.35)'
        : p.theme.colors.border.subtle};
  box-shadow: ${(p) => (p.$active ? p.theme.glows.cyanSm : 'none')};
  transition: all 0.3s ease;
`

const CenterDivider = styled.div`
  width: 1px;
  height: 18px;
  background: ${(p) => p.theme.colors.border.subtle};
`

const MatchCounter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
`

const CountLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
`

const CountValue = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
`

// ─── Right section ───────────────────────────────────────────────────────────

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  flex-shrink: 0;
  margin-left: auto;
`

const ConnectionDot = styled(motion.div)<{ $status: 'connected' | 'disconnected' | 'idle' }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) =>
    p.$status === 'connected'
      ? p.theme.colors.accent.trail
      : p.$status === 'disconnected'
        ? p.theme.colors.accent.danger
        : p.theme.colors.text.disabled};
  box-shadow: ${(p) =>
    p.$status === 'connected' ? p.theme.glows.mintSm : 'none'};
`

const ConnectionLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;

  ${(p) => p.theme.mq.maxMd} {
    display: none;
  }
`

const ConnectionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1.5]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[2.5]};
  border-radius: ${(p) => p.theme.radii.pill};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(0, 0, 0, 0.2);
`

const PanelToggleBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.button};
  border: 1px solid ${(p) => p.theme.colors.border.glass};
  background: ${(p) => p.theme.glass.sm.background};
  backdrop-filter: ${(p) => p.theme.glass.sm.backdropFilter};
  color: ${(p) => p.theme.colors.text.secondary};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.border.active};
    color: ${(p) => p.theme.colors.text.primary};
    background: rgba(37, 99, 235, 0.06);
  }

  /* Hidden on mobile — mobile uses bottom-sheet trigger instead */
  ${(p) => p.theme.mq.maxMd} {
    display: none;
  }
`

const ToggleIcon = styled.span<{ $open: boolean }>`
  display: inline-block;
  width: 14px;
  height: 10px;
  position: relative;
  transition: transform 0.2s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1.5px;
    border-radius: 1px;
    background: currentColor;
    transition: transform 0.2s ease, opacity 0.2s ease, top 0.2s ease;
  }

  &::before {
    top: ${(p) => (p.$open ? '50%' : '0')};
    transform: ${(p) => (p.$open ? 'translateY(-50%) rotate(45deg)' : 'none')};
  }

  &::after {
    top: ${(p) => (p.$open ? '50%' : '100%')};
    transform: ${(p) => (p.$open ? 'translateY(-50%) rotate(-45deg)' : 'none')};
    opacity: ${(p) => (p.$open ? 1 : 1)};
  }
`

const MobilePanelBtn = styled(motion.button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.glass};
  background: ${(p) => p.theme.glass.sm.background};
  color: ${(p) => p.theme.colors.text.secondary};
  cursor: pointer;
  font-size: 16px;

  ${(p) => p.theme.mq.maxMd} {
    display: flex;
  }
`

// ─── Phases config ───────────────────────────────────────────────────────────

const TOURNAMENT_PHASES = ['GS', 'R32', 'R16', 'QF', 'SF', 'F'] as const
const CURRENT_PHASE_INDEX = 1 // R32

// ─── Component ───────────────────────────────────────────────────────────────

export function Header() {
  const { isCollapsed, toggleCollapse, openMobilePanel, isMobileOpen } = usePanelStore()
  const { isMobile } = useBreakpoint()

  const liveMatches = MOCK_ROUNDS.flatMap((r) =>
    r.matches.filter((m) => m.status === 'live')
  )
  const completedMatches = MOCK_ROUNDS.flatMap((r) =>
    r.matches.filter((m) => m.status === 'completed')
  )

  const handlePanelAction = () => {
    if (isMobile) {
      openMobilePanel()
    } else {
      toggleCollapse()
    }
  }

  const isPanelVisible = isMobile ? isMobileOpen : !isCollapsed

  return (
    <HeaderRoot
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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

      {/* ── Center ── */}
      <CenterSection>
        {/* Tournament phase indicator */}
        <PhasePill
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <PhaseLabel>Vòng 32 đội</PhaseLabel>
          <PhaseProgress>
            {TOURNAMENT_PHASES.map((phase, idx) => (
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

        {/* Match counts */}
        <MatchCounter>
          <CountLabel>Completed</CountLabel>
          <CountValue>{completedMatches.length}</CountValue>
        </MatchCounter>

        {/* Live count — only shown when live matches exist */}
        <AnimatePresence>
          {liveMatches.length > 0 && (
            <motion.div
              key="live-count"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CenterDivider />
              <LivePulse size="sm" showLabel />
              <CountValue style={{ color: 'var(--accent-live)', fontSize: '18px' }}>
                {liveMatches.length}
              </CountValue>
            </motion.div>
          )}
        </AnimatePresence>
      </CenterSection>

      {/* ── Right ── */}
      <RightSection>
        {/* Realtime connection status */}
        <ConnectionGroup>
          <ConnectionDot
            $status="connected"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <ConnectionLabel>Live</ConnectionLabel>
        </ConnectionGroup>

        {/* Desktop panel toggle */}
        <PanelToggleBtn
          onClick={handlePanelAction}
          whileTap={{ scale: 0.96 }}
        >
          <ToggleIcon $open={isPanelVisible} />
          {isPanelVisible ? 'Hide Panel' : 'Show Panel'}
        </PanelToggleBtn>

        {/* Mobile stats trigger */}
        <MobilePanelBtn
          onClick={handlePanelAction}
          whileTap={{ scale: 0.94 }}
        >
          ☰
        </MobilePanelBtn>
      </RightSection>
    </HeaderRoot>
  )
}
