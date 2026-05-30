'use client'

import { motion } from 'framer-motion'
import { TEAM_MAP } from '@/lib/mock/teams'
import { getTeamPlayers } from '@/lib/mock/players'
import { GROUP_STANDINGS } from '@/lib/mock'
import { MOCK_ROUNDS } from '@/lib/mock'
import type { ExtendedTeam } from '@/lib/mock/types'
import type { Match } from '@/types/domain.types'
import {
  Root, InfoGrid, InfoCard, InfoLabel, InfoValue,
  SectionTitle, StatsGrid, StatCard, StatNumber, StatLabel,
  GroupCard, GroupTitle, GroupRow, GroupPos, GroupTeamName,
  GroupStatCols, GroupStatCell, GroupStatHeader, GroupStatHeadCell,
  FormBadge, FormRow,
} from './styles'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTeamMatches(teamId: string): Match[] {
  return MOCK_ROUNDS
    .flatMap(r => r.matches)
    .filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
}

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
    else { scored += m.score.away; conceded += m.score.home }
  }
  return { scored, conceded }
}

// ── Animation variants ────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.30, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { teamId: string }

export function OverviewTab({ teamId }: Props) {
  const team    = TEAM_MAP.get(teamId) as ExtendedTeam | undefined
  const players = getTeamPlayers(teamId)
  const matches = getTeamMatches(teamId)

  if (!team) return null

  const totalGoals    = players.reduce((s, p) => s + p.tournamentGoals, 0)
  const totalAssists  = players.reduce((s, p) => s + p.tournamentAssists, 0)
  const avgAge        = players.length
    ? Math.round(players.reduce((s, p) => s + p.age, 0) / players.length)
    : 0
  const cleanSheets   = getCleanSheets(teamId, matches)
  const { scored, conceded } = getTeamGoals(teamId, matches)
  const completedCount = matches.filter(m => m.status === 'completed').length

  // Find group standings row for this team
  let groupStageName = `Group ${team.group}`
  let groupRows: {
    name: string; pos: number; played: number
    won: number; drawn: number; lost: number
    pts: number; form: ('W' | 'D' | 'L')[]
    isThisTeam: boolean
  }[] = []

  for (const stage of GROUP_STANDINGS) {
    const found = stage.teams.find(r => r.team.id === teamId)
    if (found) {
      groupStageName = stage.name
      groupRows = stage.teams.map(r => ({
        name: r.team.shortName, pos: r.position,
        played: r.played, won: r.won, drawn: r.drawn, lost: r.lost,
        pts: r.points, form: r.form,
        isThisTeam: r.team.id === teamId,
      }))
      break
    }
  }

  const stats = [
    { label: 'Matches',      value: completedCount,                                    accent: '#3b82f6' },
    { label: 'Goals Scored', value: scored || totalGoals,                              accent: '#10b981' },
    { label: 'Goals Against',value: conceded,                                          accent: '#ef4444' },
    { label: 'Assists',      value: totalAssists,                                      accent: '#8b5cf6' },
    { label: 'Clean Sheets', value: cleanSheets,                                       accent: '#06b6d4' },
    { label: 'Squad Goals',  value: totalGoals,                                        accent: '#f59e0b' },
    { label: 'Avg Age',      value: avgAge || '—',                                     accent: '#64748b' },
    { label: 'Top Scorers',  value: players.filter(p => p.tournamentGoals > 0).length, accent: '#ec4899' },
  ]

  return (
    <Root variants={container} initial="hidden" animate="visible">
      {/* Team info */}
      <motion.div variants={item}>
        <SectionTitle>Team Information</SectionTitle>
        <InfoGrid>
          <InfoCard variants={item}><InfoLabel>Coach</InfoLabel><InfoValue>{team.manager}</InfoValue></InfoCard>
          <InfoCard variants={item}><InfoLabel>Captain</InfoLabel><InfoValue>{team.captain}</InfoValue></InfoCard>
          <InfoCard variants={item}><InfoLabel>Confederation</InfoLabel><InfoValue>{team.confederation}</InfoValue></InfoCard>
          <InfoCard variants={item}><InfoLabel>FIFA Ranking</InfoLabel><InfoValue>#{team.fifaRank} World</InfoValue></InfoCard>
        </InfoGrid>
      </motion.div>

      {/* Tournament stats */}
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

      {/* Group standings */}
      {groupRows.length > 0 && (
        <motion.div variants={item}>
          <SectionTitle>{groupStageName} — Standing</SectionTitle>
          <GroupCard variants={item}>
            <GroupTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Team</span>
                <GroupStatHeader>
                  <GroupStatHeadCell>P</GroupStatHeadCell>
                  <GroupStatHeadCell>W</GroupStatHeadCell>
                  <GroupStatHeadCell>D</GroupStatHeadCell>
                  <GroupStatHeadCell>L</GroupStatHeadCell>
                  <GroupStatHeadCell>Pts</GroupStatHeadCell>
                </GroupStatHeader>
              </div>
            </GroupTitle>

            {groupRows.map(row => (
              <GroupRow key={row.name}>
                <GroupPos $isTeam={row.isThisTeam}>{row.pos}</GroupPos>
                <GroupTeamName $isTeam={row.isThisTeam}>{row.name}</GroupTeamName>
                <FormRow>
                  {row.form.slice(-3).map((r, i) => (
                    <FormBadge key={i} $r={r}>{r}</FormBadge>
                  ))}
                </FormRow>
                <GroupStatCols>
                  <GroupStatCell>{row.played}</GroupStatCell>
                  <GroupStatCell>{row.won}</GroupStatCell>
                  <GroupStatCell>{row.drawn}</GroupStatCell>
                  <GroupStatCell>{row.lost}</GroupStatCell>
                  <GroupStatCell style={{ fontWeight: 700, color: '#0f172a' }}>{row.pts}</GroupStatCell>
                </GroupStatCols>
              </GroupRow>
            ))}
          </GroupCard>
        </motion.div>
      )}
    </Root>
  )
}
