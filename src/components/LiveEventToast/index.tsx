'use client'

import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEventFeedStore } from '@/stores'
import type { FeedEvent } from '@/types/events.types'
import { DismissBar, IconBadge, MinuteBadge, TextBlock, Toast, ToastStack, ToastSub, ToastTitle } from './styles'

// ── Config ────────────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 4500

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
