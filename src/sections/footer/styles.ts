import styled from 'styled-components'
import { motion } from 'framer-motion'

export const FooterRoot = styled(motion.footer)`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.card};
  width: 100%;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(p) => p.theme.space[5]};
  gap: ${(p) => p.theme.space[4]};

  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(37, 99, 235, 0.12) 40%,
      rgba(37, 99, 235, 0.12) 60%,
      transparent 100%
    );
  }

  ${(p) => p.theme.mq.md} {
    padding: 0 ${(p) => p.theme.space[6]};
  }
`

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
`

export const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
  margin-left: auto;
`

export const FooterText = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.disabled};
  text-transform: uppercase;
  white-space: nowrap;
`

export const FooterDivider = styled.div`
  width: 1px;
  height: 14px;
  background: ${(p) => p.theme.colors.border.subtle};
`

export const ShortcutHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1]};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.disabled};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  white-space: nowrap;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const KbdKey = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(255, 255, 255, 0.04);
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  color: ${(p) => p.theme.colors.text.muted};
  line-height: 1.4;
`

export const ZoomDisplay = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.muted};
  min-width: 36px;
  text-align: right;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const AccentDot = styled.div`
  width: 4px; height: 4px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.primary};
  opacity: 0.4;
`
