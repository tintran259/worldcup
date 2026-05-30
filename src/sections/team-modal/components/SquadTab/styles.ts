import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const PositionGroup = styled.div``

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`

export const GroupLabel = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

export const GroupCount = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.disabled};
  background: ${(p) => p.theme.colors.bg.elevated};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 999px;
  padding: 1px 7px;
`

export const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  ${(p) => p.theme.mq.md}  { grid-template-columns: repeat(2, 1fr); }
  ${(p) => p.theme.mq.xl}  { grid-template-columns: repeat(3, 1fr); }
`

export const CardRoot = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s ease;
  &:hover { border-color: ${(p) => p.theme.colors.border.default}; }
`

export const CardMain = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
`

export const Avatar = styled.div<{ $color: string }>`
  width: 44px; height: 44px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 14px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  border: 2px solid rgba(255,255,255,0.30);
  letter-spacing: 0.02em;
  position: relative;
`

export const CaptainBadge = styled.span`
  position: absolute;
  bottom: -2px; right: -2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #f59e0b;
  border: 1px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 7px;
  line-height: 1;
`

export const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const PlayerName = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`

export const PlayerMeta = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const JerseyNum = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.disabled};
  min-width: 28px;
  text-align: right;
  flex-shrink: 0;
`

export const StatusBadge = styled.span<{ $s: string }>`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
`

export const StatsRow = styled(motion.div)`
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.elevated};
  padding: 10px 14px;
  display: flex;
  gap: 0;
  overflow: hidden;
`

export const StatChip = styled.div`
  flex: 1;
  text-align: center;
`

export const StatVal = styled.div<{ $color?: string }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.$color ?? p.theme.colors.text.primary};
  line-height: 1;
`

export const StatKey = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 2px;
`

export const RatingDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  margin-right: 3px;
  vertical-align: middle;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: ${(p) => p.theme.colors.text.disabled};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.sm};
`
