'use client'

import { Flag } from '@/components/Flag'
import { usePanelStore } from '@/stores'
import { useMatchHistory } from './hooks/useMatchHistory'
import {
  SectionTitle,
  MatchRow,
  TeamBlock,
  TeamLabel,
  ScoreCenter,
  ScoreDigit,
  ScoreDash,
} from './styles'

export function MatchHistoryTab() {
  const { openMatch } = usePanelStore()
  const { completedMatches } = useMatchHistory()

  return (
    <div>
      <SectionTitle>Completed Matches · {completedMatches.length}</SectionTitle>

      {completedMatches.map((match) => (
        <MatchRow key={match.id} onClick={() => openMatch(match.id)}>
          <TeamBlock $align="left">
            {match.homeTeam && (
              <>
                <Flag countryCode={match.homeTeam.code} size="xs" />
                <TeamLabel $isWinner={match.winnerId === match.homeTeam.id}>
                  {match.homeTeam.shortName}
                </TeamLabel>
              </>
            )}
          </TeamBlock>

          <ScoreCenter>
            <ScoreDigit>{match.score?.home ?? '-'}</ScoreDigit>
            <ScoreDash>:</ScoreDash>
            <ScoreDigit>{match.score?.away ?? '-'}</ScoreDigit>
          </ScoreCenter>

          <TeamBlock $align="right">
            {match.awayTeam && (
              <>
                <Flag countryCode={match.awayTeam.code} size="xs" />
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
