import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

export type BentoAccent = 'cyan' | 'live' | 'gold' | 'mint' | 'none'

const ACCENT_VARS: Record<Exclude<BentoAccent, 'none'>, string> = {
  cyan: 'var(--accent-primary)',
  live: 'var(--accent-live)',
  gold: 'var(--accent-winner)',
  mint: 'var(--accent-trail)',
}

export function accentVar(accent: BentoAccent): string {
  return accent === 'none' ? 'transparent' : ACCENT_VARS[accent]
}

export const Root = styled(motion.div)<{ $accent: BentoAccent }>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.card};
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 16px 16px 0 0;
    background: linear-gradient(
      90deg,
      ${(p) => accentVar(p.$accent)} 0%,
      transparent 65%
    );
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.border.default};
    box-shadow: ${(p) => p.theme.shadows.md};
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  flex-shrink: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

export const AccentDot = styled.div<{ $accent: BentoAccent }>`
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => accentVar(p.$accent)};

  ${(p) =>
    p.$accent === 'live' &&
    css`
      animation: pulse-live 1.8s ease-in-out infinite;
    `}

  ${(p) =>
    p.$accent !== 'none' &&
    css`
      box-shadow: 0 0 6px ${accentVar(p.$accent)};
    `}
`

export const Title = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

export const Badge = styled.span<{ $accent: BentoAccent }>`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  padding: 1px 7px;
  border-radius: 999px;
  background: ${(p) =>
    p.$accent === 'none' ? 'rgba(255,255,255,0.06)' : `${accentVar(p.$accent)}22`};
  color: ${(p) =>
    p.$accent === 'none' ? p.theme.colors.text.muted : accentVar(p.$accent)};
  border: 1px solid
    ${(p) =>
    p.$accent === 'none'
      ? 'rgba(255,255,255,0.08)'
      : `${accentVar(p.$accent)}35`};
`

export const Body = styled.div<{ $pad: boolean }>`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: ${(p) => (p.$pad ? '12px 16px 16px' : '0')};

  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.25) transparent;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.28);
    border-radius: 2px;
  }
`
