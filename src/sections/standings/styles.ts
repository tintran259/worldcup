import styled from 'styled-components'
import { motion } from 'framer-motion'

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.space[3]};
`

export const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

export const ViewAllBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(37,99,235,0.08);
    border-color: ${(p) => p.theme.colors.accent.primary};
    color: ${(p) => p.theme.colors.accent.primary};
  }

  svg { flex-shrink: 0; }
`

export const GroupBlock = styled.div`
  margin-bottom: ${(p) => p.theme.space[4]};
  &:last-child { margin-bottom: 0; }
`

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.space[2]};
`

export const GroupTitle = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
`

export const ExpandBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(37,99,235,0.08);
    border-color: ${(p) => p.theme.colors.accent.primary};
    color: ${(p) => p.theme.colors.accent.primary};
  }

  svg { display: block; }
`
