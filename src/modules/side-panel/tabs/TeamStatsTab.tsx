'use client'

import React from 'react'
import styled from 'styled-components'
import { Flag } from '@/ui/primitives/Flag'
import { usePanelStore, useBracketStore } from '@/store'

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

const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[4]};
`

const TeamHero = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
  padding: ${(p) => p.theme.space[4]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  margin-bottom: ${(p) => p.theme.space[4]};
`

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[1]};
`

const TeamFullName = styled.span`
  font-family: ${(p) => p.theme.fonts.display};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.text.primary};
  text-transform: uppercase;
  line-height: 1;
`

const TeamMeta = styled.span`
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(p) => p.theme.space[3]};
`

const StatBox = styled.div`
  padding: ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[1]};
`

const StatValue = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['4xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

const StatLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

export function TeamStatsTab() {
  const { selectedTeamId } = usePanelStore()

  if (!selectedTeamId) {
    return (
      <Placeholder>
        <PlaceholderTitle>Select a Team</PlaceholderTitle>
        <PlaceholderSub>Click any team name in the bracket to view stats.</PlaceholderSub>
      </Placeholder>
    )
  }

  return (
    <div>
      <SectionTitle>Team Profile</SectionTitle>
      <TeamHero>
        <Flag countryCode="BR" countryName="Brazil" size="xl" />
        <TeamInfo>
          <TeamFullName>Brazil</TeamFullName>
          <TeamMeta>Group B · FIFA Rank #1</TeamMeta>
        </TeamInfo>
      </TeamHero>
      <StatGrid>
        <StatBox>
          <StatValue>9</StatValue>
          <StatLabel>Goals Scored</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>3</StatValue>
          <StatLabel>Matches Won</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>0</StatValue>
          <StatLabel>Goals Conceded</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>+9</StatValue>
          <StatLabel>Goal Difference</StatLabel>
        </StatBox>
      </StatGrid>
    </div>
  )
}
