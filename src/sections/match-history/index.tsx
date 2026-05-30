'use client'

import { useMemo } from 'react'
import { Flag }              from '@/components/Flag'
import { usePanelStore }     from '@/stores'
import { useMatchHistory }   from './hooks/useMatchHistory'
import { formatMatchDate }   from '@/utils/date'
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
  const { completedMatches } = useMatchHistory()

  // Sắp xếp trận gần nhất (kickoff time mới nhất) lên đầu
  const sorted = useMemo(
    () => [...completedMatches].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    ),
    [completedMatches],
  )

  return (
    <div>
      <SectionTitle>Completed Matches · {sorted.length}</SectionTitle>

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
