import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

// Pulse animation cho icon cảnh báo
const warningPulse = keyframes`
  0%, 100% { opacity: 0.85; }
  50%      { opacity: 1; }
`

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(6, 11, 24, 0.45);
  backdrop-filter: blur(3px);
  z-index: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`

export const Popup = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22), 0 0 0 1px ${(p) => p.theme.colors.border.subtle};
  display: flex;
  flex-direction: column;
`

// Header với accent color amber/red theo severity
export const Header = styled.div<{ $severity: 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: ${(p) =>
    p.$severity === 'warning'
      ? 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(217,119,6,0.06) 100%)'
      : 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(29,78,216,0.04) 100%)'};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
`

export const IconCircle = styled.div<{ $severity: 'warning' | 'info' }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
  background: ${(p) =>
    p.$severity === 'warning'
      ? 'rgba(245,158,11,0.16)'
      : 'rgba(37,99,235,0.12)'};
  color: ${(p) =>
    p.$severity === 'warning'
      ? '#b45309'
      : p.theme.colors.accent.primary};
  animation: ${warningPulse} 2s ease-in-out infinite;
`

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`

export const Title = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  letter-spacing: 0.01em;
`

export const Subtitle = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${(p) => p.theme.colors.text.primary};
  }
`

// ── Body ─────────────────────────────────────────────────────────────────────

export const Body = styled.div`
  padding: 18px 20px 6px;
`

export const Description = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  line-height: 1.55;
  color: ${(p) => p.theme.colors.text.secondary};
  margin-bottom: 14px;
`

export const InfoCard = styled.div`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InfoLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.text.disabled};
  text-transform: uppercase;
`

export const InfoValue = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.primary};
  word-break: break-word;
  line-height: 1.5;

  /* Inline code snippets */
  & code {
    font-family: ${(p) => p.theme.fonts.mono};
    font-size: 12px;
    padding: 1px 6px;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.bg.elevated};
    border: 1px solid ${(p) => p.theme.colors.border.subtle};
    color: ${(p) => p.theme.colors.accent.primary};
  }
`

// ── Footer ───────────────────────────────────────────────────────────────────

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px 18px;
`

export const PrimaryBtn = styled(motion.button)`
  background: ${(p) => p.theme.colors.accent.primary};
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  cursor: pointer;
`

export const SecondaryBtn = styled(motion.button)`
  background: transparent;
  color: ${(p) => p.theme.colors.text.secondary};
  border: 1px solid ${(p) => p.theme.colors.border.default};
  padding: 8px 14px;
  border-radius: 8px;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  cursor: pointer;

  &:hover {
    border-color: ${(p) => p.theme.colors.text.muted};
    color: ${(p) => p.theme.colors.text.primary};
  }
`
