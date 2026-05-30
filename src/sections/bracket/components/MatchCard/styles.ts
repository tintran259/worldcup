import styled, { css, keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { NODE_WIDTH } from '../../types'
import type { Match } from '../../types'

const liveGlow = keyframes`
  0%,100% {
    box-shadow:
      0 0 0 1px rgba(239,68,68,0.28),
      0 2px 12px rgba(239,68,68,0.10);
  }
  50% {
    box-shadow:
      0 0 0 2px rgba(239,68,68,0.52),
      0 4px 20px rgba(239,68,68,0.18),
      0 0 32px rgba(239,68,68,0.06);
  }
`

const winnerGlow = keyframes`
  0%,100% { box-shadow: 0 0 0 1px rgba(16,185,129,0.22), 0 2px 8px rgba(16,185,129,0.08); }
  50%      { box-shadow: 0 0 0 2px rgba(16,185,129,0.42), 0 4px 16px rgba(16,185,129,0.14); }
`

export const Card = styled(motion.article)<{
  $status:     Match['status']
  $isSelected: boolean
  $isDimmed:   boolean
}>`
  width:      ${NODE_WIDTH}px;
  min-height: 80px;
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.18s ease,
    box-shadow   0.18s ease,
    opacity      0.18s ease;

  &::before {
    content: '';
    display: block;
    height: 2px;
    transition: background 0.28s ease;
    background: ${(p) => {
      if (p.$status === 'live')
        return `linear-gradient(90deg, ${p.theme.colors.accent.live} 0%, transparent 80%)`
      if (p.$isSelected)
        return `linear-gradient(90deg, ${p.theme.colors.accent.primary} 0%, transparent 80%)`
      if (p.$status === 'completed')
        return `linear-gradient(90deg, ${p.theme.colors.accent.winner} 0%, transparent 75%)`
      return 'transparent'
    }};
  }

  ${(p) =>
    p.$status === 'live' &&
    css`
      border-color: rgba(239, 68, 68, 0.35);
      background: linear-gradient(
        150deg,
        rgba(254, 226, 226, 0.80) 0%,
        ${p.theme.colors.bg.surface} 48%
      );
      animation: ${liveGlow} 2.2s ease-in-out infinite;
    `}

  ${(p) =>
    p.$status === 'completed' &&
    !p.$isSelected &&
    css`
      animation: ${winnerGlow} 3.2s ease-in-out infinite;
    `}

  ${(p) =>
    p.$isSelected &&
    css`
      border-color: rgba(37, 99, 235, 0.50);
      box-shadow:
        0 0 0 2px rgba(37, 99, 235, 0.18),
        0 4px 16px rgba(37, 99, 235, 0.10);
    `}

  ${(p) =>
    p.$isDimmed &&
    css`
      opacity: 0.22;
      pointer-events: none;
    `}

  ${(p) =>
    !p.$isDimmed &&
    css`
      &:hover {
        border-color: ${p.$status === 'live'
          ? 'rgba(239, 68, 68, 0.60)'
          : 'rgba(37, 99, 235, 0.40)'};
        box-shadow: ${p.theme.shadows.cardHover};
        transform: translateY(-1.5px) scale(1.005);
      }
      &:active {
        transform: translateY(0) scale(1);
      }
    `}
`

export const TeamRow = styled.div<{ $isWinner: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[3]};
  opacity: ${(p) => (p.$isWinner ? 1 : 0.62)};
  transition: background 0.10s ease;

  &:hover { background: rgba(0, 0, 0, 0.02); }

  ${(p) =>
    p.$isWinner &&
    css`
      background: rgba(16, 185, 129, 0.05);
    `}
`

export const TeamName = styled.span<{ $isWinner: boolean }>`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) =>
    p.$isWinner ? p.theme.fontWeights.bold : p.theme.fontWeights.medium};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  color: ${(p) =>
    p.$isWinner ? p.theme.colors.accent.winner : p.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ScoreBox = styled.span<{ $isWinner: boolean }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  line-height: 1;
  min-width: 22px;
  text-align: center;
  color: ${(p) =>
    p.$isWinner ? p.theme.colors.text.primary : p.theme.colors.text.muted};
  display: inline-block;
  transform-origin: center;
`

export const WinnerMark = styled.span`
  font-size: 9px;
  color: ${(p) => p.theme.colors.accent.winner};
  line-height: 1;
`

export const TbdLabel = styled.span`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.disabled};
  font-style: italic;
  letter-spacing: 0.01em;
`

export const Divider = styled.div`
  height: 1px;
  margin: 0 ${(p) => p.theme.space[3]};
  background: ${(p) => p.theme.colors.border.subtle};
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.space[1]} ${(p) => p.theme.space[3]};
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.elevated};
`

export const FooterLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
`

export const LiveMinute = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.accent.live};
  letter-spacing: 0.04em;
  text-shadow: 0 0 8px rgba(239,68,68,0.40);
`

export const ScheduleTag = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.accent.primary};
  letter-spacing: 0.02em;
  white-space: nowrap;
`
