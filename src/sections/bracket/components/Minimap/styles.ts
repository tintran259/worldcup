import styled from 'styled-components'
import { motion } from 'framer-motion'

export const MM_WIDTH = 160
export const MM_PAD   = 4

export const Root = styled(motion.div)`
  position: absolute;
  bottom: ${(p) => p.theme.space[4]};
  left: ${(p) => p.theme.space[4]};
  z-index: ${(p) => p.theme.zIndex.card};
  width: ${MM_WIDTH}px;
  border-radius: ${(p) => p.theme.radii.card};
  background: rgba(6, 11, 24, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  overflow: hidden;
  user-select: none;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 4px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`

export const Label = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 9px;
  letter-spacing: 0.10em;
  color: rgba(148,163,184,0.70);
  text-transform: uppercase;
`

export const CollapseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  color: rgba(148,163,184,0.55);
  cursor: pointer;
  padding: 0;
  font-size: 10px;
  line-height: 1;
  &:hover { color: rgba(148,163,184,1); }
`

export const Canvas = styled.div`
  position: relative;
  padding: ${MM_PAD}px;
  cursor: pointer;
`
