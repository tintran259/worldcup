import { FeedEvent } from "@/types/events.types"
import { motion } from "framer-motion"
import styled, { css, keyframes } from "styled-components"


// ── Keyframes ─────────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

// ── Styled ────────────────────────────────────────────────────────────────────


export const ToastStack = styled.div`
  position: fixed;
  top: 72px;
  right: 16px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  width: 300px;

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    left: 16px;
    right: 16px;
  }
`

export const Toast = styled(motion.div) <{ $type: FeedEvent['type'] }>`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(6, 11, 24, 0.94);
  backdrop-filter: blur(20px);
  border: 1px solid ${(p) =>
    p.$type === 'goal'
      ? 'rgba(251, 191, 36, 0.45)'
      : p.$type === 'yellow-card'
        ? 'rgba(245, 158, 11, 0.45)'
        : p.$type === 'red-card'
          ? 'rgba(239, 68, 68, 0.45)'
          : 'rgba(37, 99, 235, 0.35)'};
  box-shadow: ${(p) =>
    p.$type === 'goal'
      ? '0 4px 24px rgba(251,191,36,0.18), 0 1px 8px rgba(0,0,0,0.35)'
      : '0 4px 20px rgba(0,0,0,0.30)'};
  cursor: pointer;
  overflow: hidden;

  ${(p) =>
    p.$type === 'goal' &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(251,191,36,0.08) 40%,
          rgba(251,191,36,0.14) 50%,
          rgba(251,191,36,0.08) 60%,
          transparent 100%
        );
        background-size: 200% auto;
        animation: ${shimmer} 2s linear infinite;
      }
    `}
`

export const IconBadge = styled.div<{ $type: FeedEvent['type'] }>`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: ${(p) =>
    p.$type === 'goal'
      ? 'rgba(251,191,36,0.18)'
      : p.$type === 'yellow-card'
        ? 'rgba(245,158,11,0.15)'
        : p.$type === 'red-card'
          ? 'rgba(239,68,68,0.15)'
          : 'rgba(37,99,235,0.15)'};
`

export const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
`

export const ToastTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #f0f4ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`

export const ToastSub = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: rgba(148, 163, 184, 0.75);
  letter-spacing: 0.03em;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const MinuteBadge = styled.span`
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: rgba(239, 68, 68, 0.90);
  letter-spacing: 0.04em;
  white-space: nowrap;
`

export const DismissBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 0 0 12px 12px;
  background: rgba(255,255,255,0.18);
  transform-origin: left;
`