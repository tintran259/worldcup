'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flag } from '@/components/Flag'
import {
  SectionTitle,
  Section,
  SummaryGrid,
  SummaryCard,
  SummaryValue,
  SummaryLabel,
  SummaryAccent,
  ScorerRow,
  ScorerRank,
  ScorerInfo,
  ScorerName,
  ScorerMeta,
  GoalCount,
  GoalNumber,
  GoalUnit,
  TeamBarRow,
  TeamBarInfo,
  TeamBarName,
  BarTrack,
  BarFill,
  BarValue,
} from './styles'

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
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
}

export function StatsTab() {
  return (
    <div>
      <SectionTitle>Tournament Summary</SectionTitle>
      <SummaryGrid>
        {[
          { value: '38', label: 'Goals Scored', color: 'var(--accent-primary)', delay: 0 },
          { value: '10', label: 'Matches Played', color: 'var(--accent-winner)', delay: 0.05 },
          { value: '3.8', label: 'Goals / Match', color: 'var(--accent-trail)', delay: 0.1 },
          { value: '32', label: 'Teams Remaining', color: 'var(--accent-live)', delay: 0.15 },
        ].map(({ value, label, color, delay }) => (
          <SummaryCard
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
          >
            <SummaryValue>{value}</SummaryValue>
            <SummaryLabel>{label}</SummaryLabel>
            <SummaryAccent $color={color} />
          </SummaryCard>
        ))}
      </SummaryGrid>

      <Section>
        <SectionTitle>Top Scorers</SectionTitle>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {TOP_SCORERS.map((player) => (
            <ScorerRow key={player.name} variants={itemVariants}>
              <ScorerRank $rank={player.rank}>{player.rank}</ScorerRank>
              <Flag countryCode={player.code} size="sm" />
              <ScorerInfo>
                <ScorerName>{player.name}</ScorerName>
                <ScorerMeta>{player.team} · {player.assists} ast</ScorerMeta>
              </ScorerInfo>
              <GoalCount>
                <GoalNumber>{player.goals}</GoalNumber>
                <GoalUnit>G</GoalUnit>
              </GoalCount>
            </ScorerRow>
          ))}
        </motion.div>
      </Section>

      <Section>
        <SectionTitle>Goals by Team</SectionTitle>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
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
                    idx === 0 ? 'var(--accent-primary)' :
                      idx === 1 ? 'var(--accent-trail)' :
                        'rgba(0,212,255,0.4)'
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
