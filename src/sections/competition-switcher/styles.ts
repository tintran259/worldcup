import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { CompetitionStatus } from '@/utils/competition'

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(6, 11, 24, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1200;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  ${(p) => p.theme.mq.md} { align-items: center; }
`

export const Sheet = styled(motion.div)`
  width: 100%;
  max-width: 540px;
  max-height: 88dvh;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.22);

  ${(p) => p.theme.mq.md} {
    border-radius: 20px;
    max-height: 82dvh;
  }
`

export const GrabHandle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border.default};
  margin: 8px auto 4px;
  flex-shrink: 0;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  flex-shrink: 0;
`

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Title = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
`

export const Subtitle = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${(p) => p.theme.colors.text.primary};
  }
`

// ── Competition list ──────────────────────────────────────────────────────────

export const List = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.25) transparent;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); border-radius: 2px; }
`

export const Card = styled(motion.button)<{ $selected: boolean; $status: CompetitionStatus; $disabled?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 2px solid ${(p) =>
    p.$selected ? p.theme.colors.accent.primary : p.theme.colors.border.subtle};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease, opacity 0.15s ease;

  /* Disabled state: fade out + tắt hover effect */
  opacity: ${(p) => (p.$disabled ? 0.55 : 1)};

  &:hover {
    border-color: ${(p) =>
    p.$disabled
      ? p.theme.colors.border.subtle
      : p.$selected
        ? p.theme.colors.accent.primary
        : p.theme.colors.border.default};
    background: ${(p) =>
    p.$disabled ? p.theme.colors.bg.surface : p.theme.colors.bg.overlay};
  }
`

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const CardName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.md};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StatusBadge = styled.span<{ $status: CompetitionStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;

  ${(p) =>
    p.$status === 'upcoming' &&
    `background: rgba(245,158,11,0.14); color: #b45309; border: 1px solid rgba(245,158,11,0.30);`}
  ${(p) =>
    p.$status === 'live' &&
    `background: rgba(239,68,68,0.14);  color: #991b1b; border: 1px solid rgba(239,68,68,0.30);`}
  ${(p) =>
    p.$status === 'finished' &&
    `background: rgba(100,116,139,0.10); color: ${p.theme.colors.text.muted}; border: 1px solid ${p.theme.colors.border.subtle};`}
`

export const DateRange = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.04em;
`

// ── Countdown display ─────────────────────────────────────────────────────────

export const Countdown = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
  margin-top: 4px;
  border-top: 1px dashed ${(p) => p.theme.colors.border.subtle};
`

export const CountdownLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

export const CountdownUnits = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`

export const CountUnit = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`

export const CountValue = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.md};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.accent.primary};
  font-variant-numeric: tabular-nums;
  line-height: 1;
`

export const CountSuffix = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

// Check icon khi selected
export const SelectedDot = styled.div<{ $visible: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: scale(${(p) => (p.$visible ? 1 : 0.6)});
  transition: opacity 0.15s ease, transform 0.15s ease;
`
