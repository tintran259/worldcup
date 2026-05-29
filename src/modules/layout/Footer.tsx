'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useBracketStore } from '@/store'

// ─── Styled ───────────────────────────────────────────────────────────────────

const FooterRoot = styled(motion.footer)`
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

  /* Top accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
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

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
`

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
  margin-left: auto;
`

const FooterText = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.disabled};
  text-transform: uppercase;
  white-space: nowrap;
`

const FooterDivider = styled.div`
  width: 1px;
  height: 14px;
  background: ${(p) => p.theme.colors.border.subtle};
`

const ShortcutHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1]};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.disabled};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  white-space: nowrap;

  /* Hide on small screens */
  ${(p) => p.theme.mq.maxMd} {
    display: none;
  }
`

const KbdKey = styled.kbd`
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

const ZoomDisplay = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.muted};
  min-width: 36px;
  text-align: right;

  ${(p) => p.theme.mq.maxMd} {
    display: none;
  }
`

const AccentDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.primary};
  opacity: 0.4;
`

// ─── Component ───────────────────────────────────────────────────────────────

export function Footer() {
  const { zoom } = useBracketStore()
  const zoomPct = Math.round(zoom * 100)

  return (
    <FooterRoot
      initial={{ y: 36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <FooterLeft>
        <AccentDot />
        <FooterText>FIFA World Cup 2026</FooterText>
        <FooterDivider />
        <FooterText>USA · Canada · Mexico</FooterText>
      </FooterLeft>

      <FooterRight>
        <ShortcutHint>
          <KbdKey>Drag</KbdKey>
          to pan bracket
        </ShortcutHint>

        <FooterDivider />

        <ShortcutHint>
          <KbdKey>Scroll</KbdKey>
          to zoom
        </ShortcutHint>

        <FooterDivider />

        <ZoomDisplay>{zoomPct}%</ZoomDisplay>
      </FooterRight>
    </FooterRoot>
  )
}
