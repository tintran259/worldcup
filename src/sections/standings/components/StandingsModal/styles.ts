import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { GroupRow } from '../../types'

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

export const ModalPanel = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 960px;
  max-height: calc(100vh - 48px);
  border-radius: 18px;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  flex-shrink: 0;
`

export const ModalTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.text.primary};
  text-transform: uppercase;
`

export const ModalSub = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.05em;
  margin-left: 8px;
`

export const CloseBtn = styled(motion.button)`
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.35);
    color: #ef4444;
  }
`

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.border.subtle};
    border-radius: 3px;
  }
`

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`

export const ModalGroupCard = styled(motion.div)`
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 10px;
  padding: 12px;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-left: 3px solid ${(p) => p.theme.colors.accent.primary};
`

export const ModalGroupTitle = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
  margin-bottom: 8px;
`

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  flex-shrink: 0;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.03em;
`

export const LegendDot = styled.span<{ $s: GroupRow['advanceStatus'] }>`
  flex-shrink: 0;
  display: inline-block;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$s === 'qualified' ? p.theme.colors.accent.primary :
      p.$s === 'pending' ? '#f59e0b' : '#cbd5e1'};
`
