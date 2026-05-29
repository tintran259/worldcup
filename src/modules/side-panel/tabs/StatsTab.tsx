'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { Flag } from '@/ui/primitives/Flag'

// ─── Animations ───────────────────────────────────────────────────────────────

const fillBar = keyframes`
  from { width: 0%; }
`

// ─── Shared primitives ────────────────────────────────────────────────────────

const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[3]};
`

const Section = styled.div`
  margin-bottom: ${(p) => p.theme.space[6]};
`

// ─── Tournament Summary Cards ─────────────────────────────────────────────────

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(p) => p.theme.space[2]};
  margin-bottom: ${(p) => p.theme.space[6]};
`

const SummaryCard = styled(motion.div)`
  padding: ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[1]};
`

const SummaryValue = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['5xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

const SummaryLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

const SummaryAccent = styled.div<{ $color: string }>`
  width: 20px;
  height: 2px;
  border-radius: 1px;
  background: ${(p) => p.$color};
  box-shadow: 0 0 6px ${(p) => p.$color};
  margin-top: ${(p) => p.theme.space[1]};
`

// ─── Top Scorers ─────────────────────────────────────────────────────────────

const ScorerRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[2.5]} ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  margin-bottom: ${(p) => p.theme.space[2]};
  cursor: default;
  transition: ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.border.default};
    background: ${(p) => p.theme.colors.bg.overlay};
  }
`

const ScorerRank = styled.span<{ $rank: number }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) =>
    p.$rank === 1
      ? p.theme.colors.accent.winner
      : p.$rank === 2
        ? p.theme.colors.text.secondary
        : p.theme.colors.text.disabled};
  min-width: 18px;
  line-height: 1;
  text-shadow: ${(p) => (p.$rank === 1 ? p.theme.glows.textGold : 'none')};
`

const ScorerInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ScorerName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ScorerMeta = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

const GoalCount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`

const GoalNumber = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

const GoalUnit = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
`

// ─── Team Performance Bar ─────────────────────────────────────────────────────

const TeamBarRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  margin-bottom: ${(p) => p.theme.space[2.5]};
`

const TeamBarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  min-width: 80px;
`

const TeamBarName = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
`

const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.border.subtle};
  overflow: hidden;
`

const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  border-radius: 3px;
  background: ${(p) => p.$color};
  box-shadow: 0 0 6px ${(p) => p.$color};
  animation: ${fillBar} 0.8s ease-out forwards;
`

const BarValue = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.muted};
  min-width: 20px;
  text-align: right;
`

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOP_SCORERS = [
  { rank: 1, name: 'Vinícius Jr.', team: 'BRA', code: 'BR', goals: 4, assists: 2 },
  { rank: 2, name: 'Mbappé', team: 'FRA', code: 'FR', goals: 3, assists: 3 },
  { rank: 3, name: 'Messi', team: 'ARG', code: 'AR', goals: 3, assists: 1 },
  { rank: 4, name: 'Bellingham', team: 'ENG', code: 'GB', goals: 2, assists: 2 },
  { rank: 5, name: 'Modrić', team: 'CRO', code: 'HR', goals: 1, assists: 3 },
]

const TEAM_GOALS = [
  { name: 'BRA', code: 'BR', goals: 9, max: 9 },
  { name: 'FRA', code: 'FR', goals: 7, max: 9 },
  { name: 'ARG', code: 'AR', goals: 6, max: 9 },
  { name: 'ENG', code: 'GB', goals: 5, max: 9 },
  { name: 'ESP', code: 'ES', goals: 4, max: 9 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
}

// ─── Component ───────────────────────────────────────────────────────────────

export function StatsTab() {
  return (
    <div>
      {/* Tournament Summary */}
      <SectionTitle>Tournament Summary</SectionTitle>
      <SummaryGrid>
        <SummaryCard
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SummaryValue>38</SummaryValue>
          <SummaryLabel>Goals Scored</SummaryLabel>
          <SummaryAccent $color="var(--accent-primary)" />
        </SummaryCard>

        <SummaryCard
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <SummaryValue>10</SummaryValue>
          <SummaryLabel>Matches Played</SummaryLabel>
          <SummaryAccent $color="var(--accent-winner)" />
        </SummaryCard>

        <SummaryCard
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SummaryValue>3.8</SummaryValue>
          <SummaryLabel>Goals / Match</SummaryLabel>
          <SummaryAccent $color="var(--accent-trail)" />
        </SummaryCard>

        <SummaryCard
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <SummaryValue>32</SummaryValue>
          <SummaryLabel>Teams Remaining</SummaryLabel>
          <SummaryAccent $color="var(--accent-live)" />
        </SummaryCard>
      </SummaryGrid>

      {/* Top Scorers */}
      <Section>
        <SectionTitle>Top Scorers</SectionTitle>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {TOP_SCORERS.map((player) => (
            <ScorerRow key={player.name} variants={itemVariants}>
              <ScorerRank $rank={player.rank}>{player.rank}</ScorerRank>
              <Flag countryCode={player.code} size="sm" />
              <ScorerInfo>
                <ScorerName>{player.name}</ScorerName>
                <ScorerMeta>
                  {player.team} · {player.assists} ast
                </ScorerMeta>
              </ScorerInfo>
              <GoalCount>
                <GoalNumber>{player.goals}</GoalNumber>
                <GoalUnit>G</GoalUnit>
              </GoalCount>
            </ScorerRow>
          ))}
        </motion.div>
      </Section>

      {/* Team Goal Leaders */}
      <Section>
        <SectionTitle>Goals by Team</SectionTitle>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {TEAM_GOALS.map((team, idx) => (
            <TeamBarRow key={team.name} variants={itemVariants}>
              <TeamBarInfo>
                <Flag countryCode={team.code} size="xs" />
                <TeamBarName>{team.name}</TeamBarName>
              </TeamBarInfo>
              <BarTrack>
                <BarFill
                  $pct={(team.goals / team.max) * 100}
                  $color={
                    idx === 0
                      ? 'var(--accent-primary)'
                      : idx === 1
                        ? 'var(--accent-trail)'
                        : 'rgba(0,212,255,0.4)'
                  }
                />
              </BarTrack>
              <BarValue>{team.goals}</BarValue>
            </TeamBarRow>
          ))}
        </motion.div>
      </Section>
    </div>
  )
}
