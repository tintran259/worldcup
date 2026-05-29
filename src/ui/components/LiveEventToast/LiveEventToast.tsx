'use client'

import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styled, { css, keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useEventFeedStore } from '@/store'
import type { FeedEvent } from '@/types/events.types'

// ── Config ────────────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 4500

// ── Keyframes ─────────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

// ── Styled ────────────────────────────────────────────────────────────────────

const ToastStack = styled.div`
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

const Toast = styled(motion.div)<{ $type: FeedEvent['type'] }>`
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

const IconBadge = styled.div<{ $type: FeedEvent['type'] }>`
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

const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
`

const ToastTitle = styled.p`
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

const ToastSub = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: rgba(148, 163, 184, 0.75);
  letter-spacing: 0.03em;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MinuteBadge = styled.span`
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: rgba(239, 68, 68, 0.90);
  letter-spacing: 0.04em;
  white-space: nowrap;
`

const DismissBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 0 0 12px 12px;
  background: rgba(255,255,255,0.18);
  transform-origin: left;
`

// ── Framer Motion variants ─────────────────────────────────────────────────────

const toastVariants = {
  initial: { opacity: 0, x: 60, scale: 0.92 },
  animate: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 380, damping: 28 },
  },
  exit: {
    opacity: 0, x: 60, scale: 0.90,
    transition: { duration: 0.20 },
  },
}

// ── Icon + text per event type ─────────────────────────────────────────────────

function getContent(event: FeedEvent): { icon: string; title: string; sub: string } {
  switch (event.type) {
    case 'goal':
      return {
        icon: '⚽',
        title: `${event.playerName ?? 'Goal!'}`,
        sub: event.homeTeamName && event.awayTeamName
          ? `${event.homeTeamName} ${event.homeScore ?? 0} – ${event.awayScore ?? 0} ${event.awayTeamName}`
          : 'Goal scored!',
      }
    case 'yellow-card':
      return {
        icon: '🟨',
        title: event.playerName ?? 'Yellow Card',
        sub: 'Yellow card shown',
      }
    case 'red-card':
      return {
        icon: '🟥',
        title: event.playerName ?? 'Red Card',
        sub: 'Player sent off',
      }
    case 'match-start':
      return {
        icon: '🏟',
        title: 'Match Started',
        sub: 'Kick-off!',
      }
    case 'match-end':
      return {
        icon: '🏁',
        title: 'Full Time',
        sub: event.homeScore !== undefined
          ? `${event.homeScore} – ${event.awayScore}`
          : 'Match finished',
      }
    default:
      return { icon: '📡', title: 'Event', sub: '' }
  }
}

// ── Single Toast item ──────────────────────────────────────────────────────────

interface ToastItemProps {
  event: FeedEvent
  onDismiss: (id: string) => void
}

function ToastItem({ event, onDismiss }: ToastItemProps) {
  const { icon, title, sub } = getContent(event)

  // Auto-dismiss after AUTO_DISMISS_MS
  useEffect(() => {
    const t = setTimeout(() => onDismiss(event.id), AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [event.id, onDismiss])

  return (
    <Toast
      key={event.id}
      $type={event.type}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      onClick={() => onDismiss(event.id)}
      role="alert"
      aria-live="polite"
    >
      <IconBadge $type={event.type}>{icon}</IconBadge>

      <TextBlock>
        <ToastTitle>{title}</ToastTitle>
        {sub && <ToastSub>{sub}</ToastSub>}
      </TextBlock>

      {event.minute !== undefined && (
        <MinuteBadge>{event.minute}&apos;</MinuteBadge>
      )}

      {/* Progress bar — shrinks to 0 over AUTO_DISMISS_MS */}
      <DismissBar
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
      />
    </Toast>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function LiveEventToast() {
  const { toastQueue, dismissToast } = useEventFeedStore()
  const dismiss = useCallback((id: string) => dismissToast(id), [dismissToast])

  // Only render client-side (portal)
  if (typeof document === 'undefined') return null

  return createPortal(
    <ToastStack>
      <AnimatePresence mode="sync" initial={false}>
        {toastQueue.map((event) => (
          <ToastItem key={event.id} event={event} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </ToastStack>,
    document.body,
  )
}
