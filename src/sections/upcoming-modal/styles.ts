import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, rgba(15,23,42,0.92), rgba(2,6,23,0.96));
  backdrop-filter: blur(12px);
  /* Trên tất cả modal khác (StandingsModal 2000) */
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

export const Panel = styled(motion.div)`
  width: min(560px, 100%);
  background: ${(p) => p.theme.colors.bg.elevated};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 24px;
  padding: 36px 32px 28px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  ${(p) => p.theme.mq.maxMd} { padding: 28px 22px 22px; border-radius: 20px; }
`

export const GlowOrb = styled.div`
  position: absolute;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  width: 280px; height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59,130,246,0.20) 0%, transparent 65%);
  pointer-events: none;
`

export const BadgeTag = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(245,158,11,0.12);
  color: #f59e0b;
  border: 1px solid rgba(245,158,11,0.24);
  border-radius: 999px;
  padding: 5px 14px;
  position: relative;
  z-index: 1;
`

export const TournamentName = styled.h1`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.primary};
  margin: 16px 0 6px;
  position: relative;
  z-index: 1;
  ${(p) => p.theme.mq.maxMd} { font-size: ${(p) => p.theme.fontSizes['2xl']}; }
`

export const SubText = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
  ${(p) => p.theme.mq.maxMd} { margin-bottom: 22px; }
`

// ── Countdown ────────────────────────────────────────────────────────────────

export const CountdownLabel = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
`

export const CountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  position: relative;
  z-index: 1;
  ${(p) => p.theme.mq.maxSm} { gap: 6px; }
`

export const CountCard = styled.div`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  padding: 18px 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(p) => p.theme.mq.maxMd} { padding: 14px 6px 10px; border-radius: 12px; }
`

export const CountNum = styled(motion.div)`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['4xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
  font-variant-numeric: tabular-nums;
  ${(p) => p.theme.mq.maxMd} { font-size: ${(p) => p.theme.fontSizes['3xl']}; }
  ${(p) => p.theme.mq.maxSm} { font-size: ${(p) => p.theme.fontSizes['2xl']}; }
`

export const CountLabel = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 6px;
`

// ── Actions ──────────────────────────────────────────────────────────────────

export const StartDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 20px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  position: relative;
  z-index: 1;
`

export const StartDateValue = styled.span`
  color: ${(p) => p.theme.colors.text.secondary};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
`

export const ChooseAnotherBtn = styled(motion.button)`
  appearance: none;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.default};
  border-radius: 12px;
  padding: 14px 24px;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 180ms ease, border-color 180ms ease;
  position: relative;
  z-index: 1;

  &:hover {
    background: ${(p) => p.theme.colors.bg.elevated};
    border-color: ${(p) => p.theme.colors.accent.primary};
  }
`

export const StartingNowPulse = styled(motion.div)`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.accent.live};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 12px 0 24px;
  position: relative;
  z-index: 1;
`
