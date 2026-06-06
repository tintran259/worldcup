'use client'

import { useMemo } from 'react'
import { Flag } from '@/components/Flag'
import { usePanelStore } from '@/stores'
import { useMatchHistory } from './hooks/useMatchHistory'
import { useFavorites } from '@/hooks/useFavorites'
import { LoadingState, EmptyState } from '@/components/SectionStatus'
import { formatMatchDate } from '@/utils/date'
import {
  SectionTitle,
  MatchRow,
  TeamBlock,
  TeamLabel,
  ScoreColumn,
  ScoreCenter,
  ScoreDigit,
  ScoreDash,
  MetaRow,
} from './styles'

export function MatchHistoryTab() {
  const { openMatch } = usePanelStore()
  const { completedMatches, isLoading } = useMatchHistory()
  const { hasActiveFilter } = useFavorites()

  // Sắp xếp trận gần nhất (kickoff time mới nhất) lên đầu
  const sorted = useMemo(
    () => [...completedMatches].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    ),
    [completedMatches],
  )

  const hasAny = sorted.length > 0

  return (
    <div>
      <SectionTitle>Completed Matches · {sorted.length}</SectionTitle>

      {isLoading && !hasAny && (
        <LoadingState
          title="Đang tải kết quả"
          sub="Đang lấy danh sách trận đã đấu."
        />
      )}

      {!isLoading && !hasAny && (
        <EmptyState
          icon="🏟️"
          title="Chưa có trận đã đấu"
          sub={
            hasActiveFilter
              ? 'Đội yêu thích của bạn chưa có trận đã kết thúc. Bỏ filter để xem tất cả.'
              : 'Giải đấu chưa diễn ra hoặc chưa có kết quả nào.'
          }
        />
      )}

      {sorted.map((match) => (
        <MatchRow key={match.id} onClick={() => openMatch(match.id)}>
          <TeamBlock $align="left">
            {match.homeTeam && (
              <>
                <Flag countryCode={match.homeTeam.code} flagUrl={match.homeTeam.flagUrl} size="xs" />
                <TeamLabel $isWinner={match.winnerId === match.homeTeam.id}>
                  {match.homeTeam.shortName}
                </TeamLabel>
              </>
            )}
          </TeamBlock>

          <ScoreColumn>
            <ScoreCenter>
              <ScoreDigit>{match.score?.home ?? '-'}</ScoreDigit>
              <ScoreDash>:</ScoreDash>
              <ScoreDigit>{match.score?.away ?? '-'}</ScoreDigit>
            </ScoreCenter>
            <MetaRow>
              {formatMatchDate(match.scheduledAt)}
            </MetaRow>
          </ScoreColumn>

          <TeamBlock $align="right">
            {match.awayTeam && (
              <>
                <Flag countryCode={match.awayTeam.code} flagUrl={match.awayTeam.flagUrl} size="xs" />
                <TeamLabel $isWinner={match.winnerId === match.awayTeam.id}>
                  {match.awayTeam.shortName}
                </TeamLabel>
              </>
            )}
          </TeamBlock>
        </MatchRow>
      ))}
    </div>
  )
}
