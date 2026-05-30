import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

const fillBar = keyframes`
  from { width: 0%; }
`

export const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[3]};
`

export const Section = styled.div`
  margin-bottom: ${(p) => p.theme.space[6]};
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(p) => p.theme.space[2]};
  margin-bottom: ${(p) => p.theme.space[6]};
`

export const SummaryCard = styled(motion.div)`
  padding: ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[1]};
`

export const SummaryValue = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['5xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

export const SummaryLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

export const SummaryAccent = styled.div<{ $color: string }>`
  width: 20px;
  height: 2px;
  border-radius: 1px;
  background: ${(p) => p.$color};
  box-shadow: 0 0 6px ${(p) => p.$color};
  margin-top: ${(p) => p.theme.space[1]};
`

export const ScorerRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[2.5]} ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  margin-bottom: ${(p) => p.theme.space[2]};
  cursor: default;
  transition: ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.border.default};
    background: ${(p) => p.theme.colors.bg.overlay};
  }
`

export const ScorerRank = styled.span<{ $rank: number }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) =>
    p.$rank === 1
      ? p.theme.colors.accent.winner
      : p.$rank === 2
        ? p.theme.colors.text.secondary
        : p.theme.colors.text.disabled};
  min-width: 18px;
  line-height: 1;
  text-shadow: ${(p) => (p.$rank === 1 ? p.theme.glows.textGold : 'none')};
`

export const ScorerInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const ScorerName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ScorerMeta = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

export const GoalCount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`

export const GoalNumber = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

export const GoalUnit = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
`

export const TeamBarRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  margin-bottom: ${(p) => p.theme.space[2.5]};
`

export const TeamBarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  min-width: 80px;
`

export const TeamBarName = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
`

export const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.border.subtle};
  overflow: hidden;
`

export const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  border-radius: 3px;
  background: ${(p) => p.$color};
  box-shadow: 0 0 6px ${(p) => p.$color};
  animation: ${fillBar} 0.8s ease-out forwards;
`

export const BarValue = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.muted};
  min-width: 20px;
  text-align: right;
`
