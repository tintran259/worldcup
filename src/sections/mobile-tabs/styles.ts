import styled from 'styled-components'
import { motion } from 'framer-motion'

type Accent = 'live' | 'mint' | 'gold' | 'cyan'

export const ACCENT_COLOR: Record<Accent, string> = {
  live: 'var(--accent-live)',
  mint: 'var(--accent-trail)',
  gold: 'var(--accent-winner)',
  cyan: 'var(--accent-primary)',
}

export const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(18px);
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.card};
`

export const TabBar = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(248, 250, 252, 0.95);
  padding: 0 4px;
  gap: 2px;
`

export const TabBtn = styled.button<{ $active: boolean; $accent: Accent }>`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
  transition: background 0.15s ease, color 0.15s ease;
  padding: 0 4px;

  color: ${(p) => p.$active ? ACCENT_COLOR[p.$accent] : p.theme.colors.text.muted};

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.03);
    color: ${(p) => p.$active ? ACCENT_COLOR[p.$accent] : p.theme.colors.text.secondary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 8px; right: 8px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${(p) => p.$active ? ACCENT_COLOR[p.$accent] : 'transparent'};
    transition: background 0.18s ease;
  }
`

export const TabLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  text-transform: uppercase;
  line-height: 1;
`

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--accent-live);
  color: #fff;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  line-height: 1;
  flex-shrink: 0;
`

export const ContentWrap = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
`

export const Panel = styled(motion.div)`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 16px;

  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.22) transparent;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.25);
    border-radius: 2px;
  }
`

export const AccentBar = styled(motion.div)<{ $accent: Accent }>`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${(p) => ACCENT_COLOR[p.$accent]} 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
`
