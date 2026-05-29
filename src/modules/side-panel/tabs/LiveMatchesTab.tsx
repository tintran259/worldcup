'use client'

import React from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { MatchCard } from '@/ui/components/MatchCard/MatchCard'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'

// ── Section label ─────────────────────────────────────────────────────────────

const SectionLabel = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[2]};
`

const LiveLabel = styled(SectionLabel)`
  color: ${(p) => p.theme.colors.accent.live};
`

// ── Section block ─────────────────────────────────────────────────────────────

const Section = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[2]};
  margin-bottom: ${(p) => p.theme.space[5]};
`

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[10]} 0;
  text-align: center;
`

const EmptyTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

const EmptySub = styled.p`
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.disabled};
`

// ── Live pulse dot decoration ─────────────────────────────────────────────────

const PulseDot = styled(motion.span)`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.live};
  margin-right: ${(p) => p.theme.space[2]};
  vertical-align: middle;
`

// ── Component ─────────────────────────────────────────────────────────────────

export function LiveMatchesTab() {
  const allMatches = MOCK_ROUNDS.flatMap((r) => r.matches)

  const liveMatches     = allMatches.filter((m) => m.status === 'live')
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming').slice(0, 6)
  const completedMatches = allMatches.filter((m) => m.status === 'completed').slice(0, 3)

  return (
    <div>
      {/* ── Live ── */}
      <AnimatePresence>
        {liveMatches.length > 0 && (
          <Section
            key="live"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LiveLabel>
              <PulseDot
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              Đang diễn ra · {liveMatches.length}
            </LiveLabel>

            {liveMatches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </Section>
        )}
      </AnimatePresence>

      {/* ── Upcoming ── */}
      {upcomingMatches.length > 0 && (
        <Section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <SectionLabel>Sắp diễn ra</SectionLabel>
          {upcomingMatches.map((match, i) => (
            <MatchCard
              key={match.id}
              match={match}
              index={liveMatches.length + i}
            />
          ))}
        </Section>
      )}

      {/* ── Completed ── */}
      {completedMatches.length > 0 && (
        <Section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.10 }}
        >
          <SectionLabel>Đã kết thúc</SectionLabel>
          {completedMatches.map((match, i) => (
            <MatchCard
              key={match.id}
              match={match}
              index={liveMatches.length + upcomingMatches.length + i}
            />
          ))}
        </Section>
      )}

      {/* ── No matches at all ── */}
      {!liveMatches.length && !upcomingMatches.length && !completedMatches.length && (
        <EmptyState>
          <EmptyTitle>Không có trận đấu</EmptyTitle>
          <EmptySub>Kiểm tra lại khi giải đấu bắt đầu.</EmptySub>
        </EmptyState>
      )}
    </div>
  )
}
