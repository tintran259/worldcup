'use client'

import { motion } from 'framer-motion'
import { Flag } from '@/components/Flag'
import { useStats } from './hooks/useStats'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
}

const SUMMARY_CARDS = [
  { key: 'goalsScored', label: 'Goals Scored', color: 'var(--accent-primary)', delay: 0 },
  { key: 'matchesPlayed', label: 'Matches Played', color: 'var(--accent-winner)', delay: 0.05 },
  { key: 'goalsPerMatch', label: 'Goals / Match', color: 'var(--accent-trail)', delay: 0.1 },
  { key: 'teamsRemaining', label: 'Teams Remaining', color: 'var(--accent-live)', delay: 0.15 },
] as const

export function StatsTab() {
  const { summary, topScorers, teamGoals } = useStats()

  // Max goals làm thước đo bar (tránh chia 0 nếu chưa có data)
  const maxTeamGoals = Math.max(1, ...teamGoals.map(t => t.goals))

  return (
    <div>
      {/* ── Summary ── */}
      <SectionTitle>Tournament Summary</SectionTitle>
      <SummaryGrid>
        {SUMMARY_CARDS.map(({ key, label, color, delay }) => (
          <SummaryCard
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
          >
            <SummaryValue>{summary[key as keyof typeof summary]}</SummaryValue>
            <SummaryLabel>{label}</SummaryLabel>
            <SummaryAccent $color={color} />
          </SummaryCard>
        ))}
      </SummaryGrid>

      {/* ── Top Scorers ── */}
      {topScorers.length > 0 && (
        <Section>
          <SectionTitle>Top Scorers</SectionTitle>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {topScorers.map((p) => (
              <ScorerRow key={p.player.id} variants={itemVariants}>
                <ScorerRank $rank={p.rank}>{p.rank}</ScorerRank>
                <Flag countryCode={p.team.code} flagUrl={p.team.flagUrl} size="sm" />
                <ScorerInfo>
                  <ScorerName>{p.player.name}</ScorerName>
                  <ScorerMeta>{p.team.shortName} · {p.assists} ast</ScorerMeta>
                </ScorerInfo>
                <GoalCount>
                  <GoalNumber>{p.goals}</GoalNumber>
                  <GoalUnit>G</GoalUnit>
                </GoalCount>
              </ScorerRow>
            ))}
          </motion.div>
        </Section>
      )}

      {/* ── Goals by Team ── */}
      {teamGoals.length > 0 && (
        <Section>
          <SectionTitle>Goals by Team</SectionTitle>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {teamGoals.map((team, idx) => (
              <TeamBarRow key={team.name} variants={itemVariants}>
                <TeamBarInfo>
                  <Flag countryCode={team.code} flagUrl={team.flagUrl} size="xs" />
                  <TeamBarName>{team.name}</TeamBarName>
                </TeamBarInfo>
                <BarTrack>
                  <BarFill
                    $pct={(team.goals / maxTeamGoals) * 100}
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
      )}
    </div>
  )
}
