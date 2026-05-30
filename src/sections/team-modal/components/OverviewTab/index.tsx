'use client'

import { motion } from 'framer-motion'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'
import type { Match } from '@/types/domain.types'
import {
  Root, InfoGrid, InfoCard, InfoLabel, InfoValue,
  SectionTitle, StatsGrid, StatCard, StatNumber, StatLabel,
} from './styles'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCleanSheets(teamId: string, matches: Match[]): number {
  return matches.filter(m => {
    if (m.status !== 'completed' || !m.score) return false
    return m.homeTeam?.id === teamId ? m.score.away === 0 : m.score.home === 0
  }).length
}

function getTeamGoals(teamId: string, matches: Match[]): { scored: number; conceded: number } {
  let scored = 0, conceded = 0
  for (const m of matches) {
    if (m.status !== 'completed' || !m.score) continue
    if (m.homeTeam?.id === teamId) { scored += m.score.home; conceded += m.score.away }
    else                            { scored += m.score.away; conceded += m.score.home }
  }
  return { scored, conceded }
}

// ── Animation variants ────────────────────────────────────────────────────────

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const item = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.30, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface OverviewTabProps {
  team:     ExtendedTeam | null
  players:  StarPlayer[]
  matches:  Match[]
}

export function OverviewTab({ team, players, matches }: OverviewTabProps) {
  if (!team) return null

  const totalGoals    = players.reduce((s, p) => s + p.tournamentGoals, 0)
  const totalAssists  = players.reduce((s, p) => s + p.tournamentAssists, 0)
  const avgAge        = players.length
    ? Math.round(players.reduce((s, p) => s + p.age, 0) / players.length)
    : 0
  const cleanSheets   = getCleanSheets(team.id, matches)
  const { scored, conceded } = getTeamGoals(team.id, matches)
  const completedCount = matches.filter(m => m.status === 'completed').length

  const stats = [
    { label: 'Matches',       value: completedCount,                                       accent: '#3b82f6' },
    { label: 'Goals Scored',  value: scored || totalGoals,                                 accent: '#10b981' },
    { label: 'Goals Against', value: conceded,                                             accent: '#ef4444' },
    { label: 'Assists',       value: totalAssists,                                         accent: '#8b5cf6' },
    { label: 'Clean Sheets',  value: cleanSheets,                                          accent: '#06b6d4' },
    { label: 'Squad Size',    value: players.length,                                       accent: '#f59e0b' },
    { label: 'Avg Age',       value: avgAge || '—',                                        accent: '#64748b' },
    { label: 'Top Scorers',   value: players.filter(p => p.tournamentGoals > 0).length,    accent: '#ec4899' },
  ]

  return (
    <Root variants={container} initial="hidden" animate="visible">
      <motion.div variants={item}>
        <SectionTitle>Team Information</SectionTitle>
        <InfoGrid>
          {team.manager && (
            <InfoCard variants={item}><InfoLabel>Coach</InfoLabel><InfoValue>{team.manager}</InfoValue></InfoCard>
          )}
          {team.captain && (
            <InfoCard variants={item}><InfoLabel>Captain</InfoLabel><InfoValue>{team.captain}</InfoValue></InfoCard>
          )}
          {team.confederation && (
            <InfoCard variants={item}><InfoLabel>Confederation</InfoLabel><InfoValue>{team.confederation}</InfoValue></InfoCard>
          )}
          {team.fifaRank > 0 && (
            <InfoCard variants={item}><InfoLabel>FIFA Ranking</InfoLabel><InfoValue>#{team.fifaRank} World</InfoValue></InfoCard>
          )}
        </InfoGrid>
      </motion.div>

      <motion.div variants={item}>
        <SectionTitle>Tournament Performance</SectionTitle>
        <StatsGrid>
          {stats.map(s => (
            <StatCard key={s.label} variants={item} $accent={s.accent}>
              <StatNumber>{s.value}</StatNumber>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </motion.div>
    </Root>
  )
}
