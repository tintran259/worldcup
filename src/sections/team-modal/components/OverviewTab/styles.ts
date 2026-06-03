import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Root = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  ${(p) => p.theme.mq.md} { grid-template-columns: repeat(4, 1fr); }
`

export const InfoCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  padding: 14px 16px;
  ${(p) => p.theme.mq.maxSm} { padding: 12px 14px; }
`

export const InfoLabel = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 4px;
`

export const InfoValue = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 12px;
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  ${(p) => p.theme.mq.md} { grid-template-columns: repeat(4, 1fr); }
`

export const StatCard = styled(motion.div)<{ $accent?: string }>`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  ${(p) => p.theme.mq.maxSm} { padding: 12px 14px; }

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 12px; bottom: 12px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: ${(p) => p.$accent ?? 'transparent'};
  }
`

export const StatNumber = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

export const StatLabel = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 4px;
`

export const GroupCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  overflow: hidden;
`

export const GroupTitle = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.elevated};
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

export const GroupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  &:last-child { border-bottom: none; }
`

export const GroupPos = styled.span<{ $isTeam: boolean }>`
  width: 22px; height: 22px;
  border-radius: 50%;
  background: ${(p) => p.$isTeam ? p.theme.colors.accent.primary : p.theme.colors.bg.elevated};
  color: ${(p) => p.$isTeam ? '#fff' : p.theme.colors.text.muted};
  display: flex; align-items: center; justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  flex-shrink: 0;
`

export const GroupTeamName = styled.span<{ $isTeam: boolean }>`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.$isTeam ? p.theme.fontWeights.bold : p.theme.fontWeights.medium};
  color: ${(p) => p.$isTeam ? p.theme.colors.text.primary : p.theme.colors.text.secondary};
`

export const GroupStatCols = styled.div`
  display: flex;
  gap: 16px;
`

export const GroupStatCell = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  min-width: 18px;
  text-align: center;
`

export const GroupStatHeader = styled(GroupStatCols)`
  gap: 16px;
`

export const GroupStatHeadCell = styled(GroupStatCell)`
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.05em;
`

export const FormBadge = styled.span<{ $r: 'W' | 'D' | 'L' }>`
  width: 16px; height: 16px;
  border-radius: 3px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  display: inline-flex; align-items: center; justify-content: center;
  background: ${(p) =>
    p.$r === 'W' ? 'rgba(16,185,129,0.15)' :
    p.$r === 'D' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'};
  color: ${(p) =>
    p.$r === 'W' ? '#065f46' :
    p.$r === 'D' ? '#92400e' : '#991b1b'};
`

export const FormRow = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`
