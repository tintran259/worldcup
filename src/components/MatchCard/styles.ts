'use client'

import styled, { css, keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import type { MatchStatus } from '@/types/domain.types'

// ── Dark glass design tokens (self-contained, independent of light theme) ─────

export const DK = {
  bg: 'rgba(6,  11, 24, 0.94)',
  bgHover: 'rgba(9,  15, 32, 0.97)',
  surface: 'rgba(13, 20, 40, 0.80)',
  border: {
    default: 'rgba(255,255,255,0.07)',
    live: 'rgba(239, 68,  68,  0.65)',
    upcoming: 'rgba(37,  99,  235, 0.45)',
    completed: 'rgba(16,  185, 129, 0.38)',
  },
  glow: {
    live: '0 0 0 1px rgba(239,68,68,0.22), 0 4px 28px rgba(239,68,68,0.18), 0 12px 48px rgba(239,68,68,0.07)',
    upcoming: '0 0 0 1px rgba(37,99,235,0.14),  0 4px 20px rgba(37,99,235,0.10)',
    completed: '0 0 0 1px rgba(16,185,129,0.12), 0 4px 16px rgba(16,185,129,0.07)',
    hover: '0 16px 48px rgba(0,0,0,0.45),    0 4px 16px rgba(0,0,0,0.28)',
  },
  text: {
    primary: '#eef2ff',
    secondary: '#c8d4e8',
    muted: '#6b7fa3',
    faint: '#3d4f6e',
    live: '#f87171',
    winner: '#fbbf24',
    upcoming: '#93b4fd',
  },
  accent: {
    live: '#ef4444',
    upcoming: '#2563eb',
    completed: '#10b981',
  },
} as const

// ── Keyframes ─────────────────────────────────────────────────────────────────

export const kfBorderPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.40; }
`

export const kfDotPulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.55); opacity: 0.45; }
`

export const kfScoreFlash = keyframes`
  0%   { transform: scale(1); }
  28%  { transform: scale(1.28); }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); }
`

// ── Framer Motion variant sets ────────────────────────────────────────────────

export const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.40,
      delay: i * 0.07,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
  hover: {
    y: -5,
    transition: { duration: 0.22, ease: 'easeOut' as const },
  },
  tap: {
    scale: 0.982,
    transition: { duration: 0.10 },
  },
} as const

export const scoreVariants = {
  initial: { opacity: 0, y: -12, scale: 0.55 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 640, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 1.45,
    transition: { duration: 0.11 },
  },
} as const

export const badgeVariants = {
  hidden: { opacity: 0, x: 10, scale: 0.88 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -8, scale: 0.88, transition: { duration: 0.15 } },
} as const

// ── Root card ─────────────────────────────────────────────────────────────────

export const CardRoot = styled(motion.article) <{
  $status: MatchStatus
  $isSelected: boolean
}>`
  position: relative;
  width: 100%;
  border-radius: 14px;
  background: ${DK.bg};
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);

  border: 1.5px solid ${(p) =>
    p.$status === 'live' ? DK.border.live :
      p.$status === 'completed' ? DK.border.completed :
        DK.border.upcoming};

  box-shadow: ${(p) =>
    p.$status === 'live' ? DK.glow.live :
      p.$status === 'completed' ? DK.glow.completed :
        DK.glow.upcoming};

  overflow: hidden;
  cursor: pointer;
  user-select: none;
  isolation: isolate;
  transition: border-color 0.22s ease, box-shadow 0.22s ease;

  ${(p) =>
    p.$status === 'live' &&
    css`animation: ${kfBorderPulse} 2.4s ease-in-out infinite;`}

  /* Selected overrides live animation */
  ${(p) =>
    p.$isSelected &&
    css`
      border-color: ${DK.border.upcoming} !important;
      box-shadow: 0 0 0 1px rgba(37,99,235,0.28),
                  0 4px 28px rgba(37,99,235,0.22),
                  0 8px 48px rgba(37,99,235,0.10) !important;
      animation: none !important;
    `}

  &:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.65);
    outline-offset: 2px;
  }
`

// ── Hover overlay shimmer ─────────────────────────────────────────────────────

export const HoverShimmer = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.045) 0%,
    transparent 55%
  );
`

// ── Top accent bar ────────────────────────────────────────────────────────────

export const AccentBar = styled.div<{ $status: MatchStatus }>`
  position: relative;
  z-index: 1;
  height: 2px;
  width: 100%;
  background: ${(p) =>
    p.$status === 'live'
      ? 'linear-gradient(90deg, #ef4444 0%, rgba(239,68,68,0.5) 50%, transparent 100%)'
      : p.$status === 'completed'
        ? 'linear-gradient(90deg, #10b981 0%, rgba(16,185,129,0.4) 50%, transparent 100%)'
        : 'linear-gradient(90deg, #2563eb 0%, rgba(37,99,235,0.4) 50%, transparent 100%)'};
`

// ── Header ────────────────────────────────────────────────────────────────────

export const CardHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 4px;
  gap: 6px;
`

export const RoundBadge = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${DK.text.muted};
  text-transform: uppercase;
`

export const StatusPill = styled(motion.span) <{ $status: MatchStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.09em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;

  ${(p) =>
    p.$status === 'live' &&
    css`
      background: rgba(239, 68, 68, 0.14);
      border: 1px solid rgba(239, 68, 68, 0.38);
      color: ${DK.text.live};
    `}

  ${(p) =>
    p.$status === 'upcoming' &&
    css`
      background: rgba(37, 99, 235, 0.12);
      border: 1px solid rgba(37, 99, 235, 0.28);
      color: ${DK.text.upcoming};
    `}

  ${(p) =>
    p.$status === 'completed' &&
    css`
      background: rgba(16, 185, 129, 0.10);
      border: 1px solid rgba(16, 185, 129, 0.28);
      color: #6ee7b7;
    `}
`

export const LiveDotEl = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${DK.text.live};
  flex-shrink: 0;
  animation: ${kfDotPulse} 1.5s ease-in-out infinite;
`

// ── Card body ─────────────────────────────────────────────────────────────────

export const CardBody = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px 10px;
`

export const TeamSide = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  flex-direction: ${(p) => (p.$align === 'right' ? 'row-reverse' : 'row')};
`

export const TeamInfo = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  text-align: ${(p) => (p.$align === 'right' ? 'right' : 'left')};
`

export const TeamName = styled.span<{ $isWinner: boolean }>`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) =>
    p.$isWinner ? p.theme.fontWeights.bold : p.theme.fontWeights.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${(p) => (p.$isWinner ? DK.text.winner : DK.text.secondary)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.18s ease;
`

export const TeamCode = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${DK.text.faint};
  letter-spacing: 0.07em;
  text-transform: uppercase;
`

export const TbdTeam = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-style: italic;
  color: ${DK.text.faint};
  white-space: nowrap;
  letter-spacing: 0.01em;
`

// ── Score / kickoff center ────────────────────────────────────────────────────

export const ScoreCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;
  min-width: 76px;
`

export const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const ScoreNum = styled(motion.span) <{ $isWinner: boolean }>`
  display: inline-block;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 30px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  line-height: 1;
  min-width: 22px;
  text-align: center;
  color: ${(p) => (p.$isWinner ? DK.text.primary : DK.text.muted)};
  transition: color 0.2s ease;

  &[data-flash='true'] {
    animation: ${kfScoreFlash} 0.45s ease-out forwards;
  }
`

export const ScoreDivider = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 20px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${DK.text.faint};
  line-height: 1;
  letter-spacing: -0.02em;
`

export const ScorePenalty = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${DK.text.muted};
  letter-spacing: 0.04em;
`

export const KickoffBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

export const KickoffTime = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 26px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${DK.text.secondary};
  line-height: 1;
  letter-spacing: 0.02em;
`

export const KickoffDate = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.08em;
  color: ${DK.text.muted};
  text-transform: uppercase;
`

export const VsLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${DK.text.faint};
  letter-spacing: 0.10em;
  text-transform: uppercase;
`

// ── Live minute bar ───────────────────────────────────────────────────────────

export const MinuteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`

export const MinuteNum = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${DK.text.live};
  letter-spacing: 0.04em;
`

// ── Footer ────────────────────────────────────────────────────────────────────

export const CardFooter = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 14px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  gap: 8px;
`

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  flex: 1;
`

export const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
`

export const FooterText = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${DK.text.muted};
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FooterIcon = styled.span`
  font-size: 9px;
  opacity: 0.45;
  flex-shrink: 0;
  line-height: 1;
`

export const LiveMinuteTag = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${DK.text.live};
  letter-spacing: 0.04em;
`

export const WinnerStar = styled.span<{ $side: 'left' | 'right' }>`
  font-size: 10px;
  color: ${DK.text.winner};
  line-height: 1;
  order: ${(p) => (p.$side === 'right' ? -1 : 'initial')};
  flex-shrink: 0;
`
