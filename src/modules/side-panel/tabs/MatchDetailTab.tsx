'use client'

import React from 'react'
import styled from 'styled-components'
import { Flag } from '@/ui/primitives/Flag'
import { LivePulse } from '@/ui/primitives/LivePulse'
import { Badge } from '@/ui/primitives/Badge'
import { usePanelStore } from '@/store'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[12]} 0;
  text-align: center;
`

const PlaceholderTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

const PlaceholderSub = styled.p`
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.disabled};
`

const MatchHeader = styled.div`
  padding: ${(p) => p.theme.space[4]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  margin-bottom: ${(p) => p.theme.space[4]};
`

const MatchMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.space[3]};
`

const RoundLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

const ScoreRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
`

const TeamColumn = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.$align === 'left' ? 'flex-start' : 'flex-end')};
  gap: ${(p) => p.theme.space[2]};
`

const TeamNameLarge = styled.span`
  font-family: ${(p) => p.theme.fonts.display};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.text.primary};
  text-transform: uppercase;
  line-height: 1;
`

const ScoreCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
`

const ScoreNumber = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['6xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
  min-width: 32px;
  text-align: center;
`

const ScoreDash = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xl};
  color: ${(p) => p.theme.colors.text.muted};
`

const VenueLine = styled.p`
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  text-align: center;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  margin-top: ${(p) => p.theme.space[3]};
`

const SectionTitle = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[3]};
`

const StatBar = styled.div`
  margin-bottom: ${(p) => p.theme.space[3]};
`

const StatBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.space[1]};
`

const StatBarName = styled.span`
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
`

const StatBarValue = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.secondary};
  font-weight: ${(p) => p.theme.fontWeights.bold};
`

const BarTrack = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border.subtle};
  position: relative;
  overflow: hidden;
`

const BarFill = styled.div<{ $pct: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${(p) => p.$pct}%;
  border-radius: 2px;
  background: linear-gradient(90deg, ${(p) => p.theme.colors.accent.primary}, ${(p) => p.theme.colors.accent.trail});
`

export function MatchDetailTab() {
  const { selectedMatchId } = usePanelStore()

  if (!selectedMatchId) {
    return (
      <Placeholder>
        <PlaceholderTitle>No Match Selected</PlaceholderTitle>
        <PlaceholderSub>Click any match card in the bracket.</PlaceholderSub>
      </Placeholder>
    )
  }

  const match = MOCK_ROUNDS.flatMap((r) => r.matches).find((m) => m.id === selectedMatchId)

  if (!match) {
    return (
      <Placeholder>
        <PlaceholderTitle>Match Not Found</PlaceholderTitle>
      </Placeholder>
    )
  }

  return (
    <div>
      <MatchHeader>
        <MatchMeta>
          <RoundLabel>{match.roundDisplay}</RoundLabel>
          {match.status === 'live' ? (
            <LivePulse size="sm" showLabel />
          ) : (
            <Badge $variant={match.status === 'completed' ? 'completed' : 'upcoming'}>
              {match.status}
            </Badge>
          )}
        </MatchMeta>

        <ScoreRow>
          <TeamColumn $align="left">
            {match.homeTeam && (
              <>
                <Flag countryCode={match.homeTeam.code} size="lg" />
                <TeamNameLarge>{match.homeTeam.shortName}</TeamNameLarge>
              </>
            )}
          </TeamColumn>

          <ScoreCenter>
            <ScoreNumber>{match.score?.home ?? '-'}</ScoreNumber>
            <ScoreDash>:</ScoreDash>
            <ScoreNumber>{match.score?.away ?? '-'}</ScoreNumber>
          </ScoreCenter>

          <TeamColumn $align="right">
            {match.awayTeam && (
              <>
                <Flag countryCode={match.awayTeam.code} size="lg" />
                <TeamNameLarge>{match.awayTeam.shortName}</TeamNameLarge>
              </>
            )}
          </TeamColumn>
        </ScoreRow>

        <VenueLine>{match.venue} · {match.city}</VenueLine>
      </MatchHeader>

      {match.status !== 'upcoming' && (
        <>
          <SectionTitle>Match Stats</SectionTitle>
          {[
            { label: 'Possession', home: 58, away: 42 },
            { label: 'Shots', home: 12, away: 7 },
            { label: 'Shots on Target', home: 5, away: 3 },
            { label: 'Corners', home: 6, away: 4 },
          ].map((stat) => (
            <StatBar key={stat.label}>
              <StatBarLabel>
                <StatBarValue>{stat.home}{stat.label === 'Possession' ? '%' : ''}</StatBarValue>
                <StatBarName>{stat.label}</StatBarName>
                <StatBarValue>{stat.away}{stat.label === 'Possession' ? '%' : ''}</StatBarValue>
              </StatBarLabel>
              <BarTrack>
                <BarFill $pct={(stat.home / (stat.home + stat.away)) * 100} />
              </BarTrack>
            </StatBar>
          ))}
        </>
      )}
    </div>
  )
}
