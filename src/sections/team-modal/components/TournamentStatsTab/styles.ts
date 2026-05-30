import styled from 'styled-components'
import { motion } from 'framer-motion'

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
  margin-bottom: 12px;
`

export const LeaderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  ${(p) => p.theme.mq.md} { grid-template-columns: repeat(4, 1fr); }
`

export const LeaderCard = styled(motion.div)<{ $accent: string }>`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover { transform: translateY(-2px); box-shadow: ${(p) => p.theme.shadows.md}; }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${(p) => p.$accent};
  }
`

export const LeaderIcon = styled.div`
  font-size: 22px;
  margin-bottom: 8px;
  line-height: 1;
`

export const LeaderTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 8px;
`

export const LeaderAvatar = styled.div<{ $color: string }>`
  width: 36px; height: 36px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex; align-items: center; justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 12px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  margin-bottom: 8px;
`

export const LeaderName = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`

export const LeaderStat = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
  margin-top: 6px;
`

export const LeaderStatLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const TableCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  overflow: hidden;
`

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 36px 36px 36px 36px 36px 52px;
  gap: 4px;
  padding: 8px 14px;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
`

export const TH = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.disabled};
  text-align: center;
  &:first-child { text-align: left; }
`

export const TableRow = styled(motion.div)<{ $alt: boolean }>`
  display: grid;
  grid-template-columns: 1fr 36px 36px 36px 36px 36px 52px;
  gap: 4px;
  padding: 9px 14px;
  background: ${(p) => p.$alt ? p.theme.colors.bg.elevated : 'transparent'};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  align-items: center;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(37,99,235,0.03); cursor: pointer; }
`

export const TD = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.secondary};
  text-align: center;
  &:first-child { text-align: left; }
`

export const PlayerNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const SmallAvatar = styled.div<{ $color: string }>`
  width: 26px; height: 26px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex; align-items: center; justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 8px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  flex-shrink: 0;
`

export const PlayerFullName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.medium};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RatingChip = styled.span<{ $color: string }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}18;
  border-radius: 6px;
  padding: 2px 6px;
  text-align: center;
  display: inline-block;
  width: 100%;
`

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

export const BarLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.04em;
  min-width: 80px;
`

export const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-radius: 3px;
  overflow: hidden;
`

export const BarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  border-radius: 3px;
  background: ${(p) => p.$color};
`

export const BarVal = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  min-width: 30px;
  text-align: right;
`

export const SummaryCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  padding: 16px 18px;
`
