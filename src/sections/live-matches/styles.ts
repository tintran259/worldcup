import styled from 'styled-components'
import { motion } from 'framer-motion'

export const SectionLabel = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[2]};
`

export const LiveLabel = styled(SectionLabel)`
  color: ${(p) => p.theme.colors.accent.live};
`

export const Section = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[2]};
  margin-bottom: ${(p) => p.theme.space[5]};
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[10]} 0;
  text-align: center;
`

export const EmptyTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

export const EmptySub = styled.p`
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.disabled};
`

export const PulseDot = styled(motion.span)`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.live};
  margin-right: ${(p) => p.theme.space[2]};
  vertical-align: middle;
`
