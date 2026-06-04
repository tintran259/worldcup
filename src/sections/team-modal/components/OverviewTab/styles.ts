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

