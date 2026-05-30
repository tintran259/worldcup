import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Root = styled(motion.div)`
  position: absolute;
  bottom: ${(p) => p.theme.space[4]};
  right: ${(p) => p.theme.space[4]};
  z-index: ${(p) => p.theme.zIndex.card};
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${(p) => p.theme.radii.sm};
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(6,11,24,0.88);
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.30);
`

export const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: none;
  border: none;
  color: rgba(203,213,225,0.75);
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(37,99,235,0.14);
    color: #93b4fd;
  }
  &:active {
    background: rgba(37,99,235,0.22);
    transform: scale(0.94);
  }
  & + & {
    border-top: 1px solid rgba(255,255,255,0.05);
  }
`

export const ZoomPct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 8px;
  background: rgba(6,11,24,0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${(p) => p.theme.radii.sm};
  box-shadow: 0 4px 16px rgba(0,0,0,0.30);
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.05em;
  color: rgba(148,163,184,0.65);
  white-space: nowrap;
`

export const TooltipWrap = styled.div`
  position: relative;
  &:hover > span { opacity: 1; pointer-events: none; }
`

export const Tooltip = styled.span`
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(6,11,24,0.94);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 4px;
  padding: 3px 7px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: rgba(203,213,225,0.85);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
`
