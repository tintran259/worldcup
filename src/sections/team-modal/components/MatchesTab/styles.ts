import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { Match } from '@/types/domain.types'

export const Root = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 10px;
`

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const MatchCard = styled(motion.div)<{ $status: Match['status'] }>`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) =>
    p.$status === 'live' ? 'rgba(239,68,68,0.35)' : p.theme.colors.border.subtle};
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  ${(p) => p.$status === 'live' && `
    background: linear-gradient(150deg, rgba(254,226,226,0.60) 0%, white 50%);
    &::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: #ef4444;
    }
  `}
`

export const ResultBadge = styled.div<{ $r: 'W' | 'D' | 'L' | null }>`
  width: 28px; height: 28px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 11px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  background: ${(p) =>
    p.$r === 'W' ? 'rgba(16,185,129,0.12)' :
    p.$r === 'L' ? 'rgba(239,68,68,0.12)'  :
    p.$r === 'D' ? 'rgba(245,158,11,0.12)' : 'transparent'};
  color: ${(p) =>
    p.$r === 'W' ? '#065f46' :
    p.$r === 'L' ? '#991b1b' :
    p.$r === 'D' ? '#92400e' : '#94a3b8'};
  border: 1px solid ${(p) =>
    p.$r === 'W' ? 'rgba(16,185,129,0.22)' :
    p.$r === 'L' ? 'rgba(239,68,68,0.22)'  :
    p.$r === 'D' ? 'rgba(245,158,11,0.22)' : '#e2e8f0'};
`

export const MatchMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const OpponentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

export const OpponentFlag = styled.span`
  font-size: 18px;
  line-height: 1;
`

export const OpponentName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
`

export const HomeBadge = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: ${(p) => p.theme.colors.bg.elevated};
  color: ${(p) => p.theme.colors.text.muted};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 4px;
  padding: 1px 5px;
`

export const MatchMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
`

export const MetaText = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.03em;
`

export const MetaDot = styled.span`
  width: 3px; height: 3px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.text.disabled};
`

export const ScoreBlock = styled.div`
  text-align: right;
  flex-shrink: 0;
`

export const ScoreText = styled.div<{ $status: Match['status'] }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.$status === 'live' ? p.theme.colors.accent.live : p.theme.colors.text.primary};
  line-height: 1;
  letter-spacing: 0.02em;
`

export const LivePill = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(239,68,68,0.12);
  color: #ef4444;
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 999px;
  padding: 2px 7px;
  margin-top: 4px;
  display: inline-block;
`

export const ScheduleBlock = styled.div`
  text-align: right;
  flex-shrink: 0;
`

export const ScheduleDate = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1.2;
`

export const ScheduleTime = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.accent.primary};
  margin-top: 2px;
`

export const RoundTag = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(37,99,235,0.08);
  color: ${(p) => p.theme.colors.accent.primary};
  border: 1px solid rgba(37,99,235,0.16);
  border-radius: 4px;
  padding: 1px 6px;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${(p) => p.theme.colors.text.disabled};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.sm};
`
