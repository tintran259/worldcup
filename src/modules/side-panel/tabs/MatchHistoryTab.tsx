'use client'

import React from 'react'
import styled from 'styled-components'
import { Flag } from '@/ui/primitives/Flag'
import { Badge } from '@/ui/primitives/Badge'
import { usePanelStore } from '@/store'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'

const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[4]};
`

const MatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  cursor: pointer;
  transition: ${(p) => p.theme.transitions.normal};
  margin-bottom: ${(p) => p.theme.space[2]};

  &:hover {
    border-color: ${(p) => p.theme.colors.border.default};
    background: ${(p) => p.theme.colors.bg.overlay};
  }
`

const TeamBlock = styled.div<{ $align: 'left' | 'right' }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  flex-direction: ${(p) => (p.$align === 'right' ? 'row-reverse' : 'row')};
`

const TeamLabel = styled.span<{ $isWinner: boolean }>`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) =>
    p.$isWinner ? p.theme.fontWeights.bold : p.theme.fontWeights.regular};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) =>
    p.$isWinner ? p.theme.colors.text.primary : p.theme.colors.text.muted};
`

const ScoreCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1.5]};
`

const ScoreDigit = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  min-width: 14px;
  text-align: center;
  line-height: 1;
`

const ScoreDash = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
`

export function MatchHistoryTab() {
  const { openMatch } = usePanelStore()

  const completedMatches = MOCK_ROUNDS.flatMap((r) =>
    r.matches.filter((m) => m.status === 'completed')
  )

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
