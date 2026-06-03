'use client'

import { AnimatePresence } from 'framer-motion'
import { MatchCard } from '@/components/MatchCard'
import { useLiveMatches } from './hooks/useLiveMatches'
import { useFavorites } from '@/hooks/useFavorites'
import {
  liveSection,
  upcomingSection,
  pulseDotAnimate,
  pulseDotTransition,
} from './animations/feed'
import {
  SectionLabel,
  LiveLabel,
  Section,
  EmptyState,
  EmptyTitle,
  EmptySub,
  PulseDot,
} from './styles'

export function LiveMatchesTab() {
  const { liveMatches, upcomingMatches } = useLiveMatches()
  const { hasActiveFilter } = useFavorites()

  const hasAny = liveMatches.length > 0 || upcomingMatches.length > 0

  return (
    <div>
      {/* Live section — AnimatePresence so it fades out when there are no live matches */}
      <AnimatePresence>
        {liveMatches.length > 0 && (
          <Section
            key="live"
            variants={liveSection}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <LiveLabel>
              <PulseDot
                animate={pulseDotAnimate}
                transition={pulseDotTransition}
              />
              Đang diễn ra · {liveMatches.length}
            </LiveLabel>
            {liveMatches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </Section>
        )}
      </AnimatePresence>

      {upcomingMatches.length > 0 && (
        <Section
          variants={upcomingSection}
          initial="hidden"
          animate="visible"
        >
          <SectionLabel>Sắp diễn ra</SectionLabel>
          {upcomingMatches.map((match, i) => (
            <MatchCard key={match.id} match={match} index={liveMatches.length + i} />
          ))}
        </Section>
      )}
      {!hasAny && (
        <EmptyState>
          <EmptyTitle>Không có trận đấu</EmptyTitle>
          <EmptySub>
            {hasActiveFilter
              ? 'Đội yêu thích của bạn không có trận sắp tới. Bỏ filter để xem tất cả.'
              : 'Kiểm tra lại khi giải đấu bắt đầu.'}
          </EmptySub>
        </EmptyState>
      )}
    </div>
  )
}
