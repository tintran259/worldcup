'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { TEAM_MAP }         from '@/lib/mock/teams'
import { getTeamPlayers }   from '@/lib/mock/players'
import { GROUP_STANDINGS }  from '@/lib/mock'
import { MOCK_ROUNDS }      from '@/lib/constants/mockData'
import type { ExtendedTeam } from '@/lib/mock/types'
import type { Match }        from '@/types/domain.types'

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

// ── Stagger animation ──────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.30, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Styled ─────────────────────────────────────────────────────────────────────

const Root = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

// ── Info section ──────────────────────────────────────────────────────────────

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  ${(p) => p.theme.mq.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const InfoCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  padding: 14px 16px;
`

const InfoLabel = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 4px;
`

const InfoValue = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

// ── Stats grid ─────────────────────────────────────────────────────────────────

const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 12px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  ${(p) => p.theme.mq.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StatCard = styled(motion.div)<{ $accent?: string }>`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;

  /* Left accent line */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 12px; bottom: 12px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: ${(p) => p.$accent ?? 'transparent'};
  }
`

const StatNumber = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

const StatLabel = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 4px;
`

// ── Group standings row ────────────────────────────────────────────────────────

const GroupCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  overflow: hidden;
`

const GroupTitle = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.elevated};
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

const GroupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};

  &:last-child { border-bottom: none; }
`

const GroupPos = styled.span<{ $isTeam: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(p) => p.$isTeam ? p.theme.colors.accent.primary : p.theme.colors.bg.elevated};
  color: ${(p) => p.$isTeam ? '#fff' : p.theme.colors.text.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  flex-shrink: 0;
`

const GroupTeamName = styled.span<{ $isTeam: boolean }>`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.$isTeam ? p.theme.fontWeights.bold : p.theme.fontWeights.medium};
  color: ${(p) => p.$isTeam ? p.theme.colors.text.primary : p.theme.colors.text.secondary};
`

const GroupStatCols = styled.div`
  display: flex;
  gap: 16px;
`

const GroupStatCell = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  min-width: 18px;
  text-align: center;
`

const GroupStatHeader = styled(GroupStatCols)`
  gap: 16px;
`

const GroupStatHeadCell = styled(GroupStatCell)`
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.05em;
`

const FormBadge = styled.span<{ $r: 'W' | 'D' | 'L' }>`
  width: 16px; height: 16px;
  border-radius: 3px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  display: inline-flex; align-items: center; justify-content: center;
  background: ${(p) =>
    p.$r === 'W' ? 'rgba(16,185,129,0.15)' :
    p.$r === 'D' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'};
  color: ${(p) =>
    p.$r === 'W' ? '#065f46' :
    p.$r === 'D' ? '#92400e' : '#991b1b'};
`

const FormRow = styled.div`
  display: flex; gap: 3px; align-items: center;
`

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { teamId: string }

export function OverviewTab({ teamId }: Props) {
  const team    = TEAM_MAP.get(teamId) as ExtendedTeam | undefined
  const players = getTeamPlayers(teamId)
  const matches = getTeamMatches(teamId)

  if (!team) return null

  // Derive stats
  const totalGoals    = players.reduce((s, p) => s + p.tournamentGoals, 0)
  const totalAssists  = players.reduce((s, p) => s + p.tournamentAssists, 0)
  const avgAge        = players.length
    ? Math.round(players.reduce((s, p) => s + p.age, 0) / players.length)
    : 0
  const cleanSheets   = getCleanSheets(teamId, matches)
  const { scored, conceded } = getTeamGoals(teamId, matches)
  const completedCount = matches.filter(m => m.status === 'completed').length

  // Find group row
  let groupStageName = `Group ${team.group}`
  let groupRows: { name: string; pos: number; played: number; won: number; drawn: number; lost: number; pts: number; form: ('W'|'D'|'L')[]; isThisTeam: boolean }[] = []

  for (const stage of GROUP_STANDINGS) {
    const found = stage.teams.find(r => r.team.id === teamId)
    if (found) {
      groupStageName = stage.name
      groupRows = stage.teams.map(r => ({
        name:      r.team.shortName,
        pos:       r.position,
        played:    r.played,
        won:       r.won,
        drawn:     r.drawn,
        lost:      r.lost,
        pts:       r.points,
        form:      r.form,
        isThisTeam: r.team.id === teamId,
      }))
      break
    }
  }

  const stats = [
    { label: 'Matches',      value: completedCount,              accent: '#3b82f6' },
    { label: 'Goals Scored', value: scored || totalGoals,        accent: '#10b981' },
    { label: 'Goals Against',value: conceded,                    accent: '#ef4444' },
    { label: 'Assists',      value: totalAssists,                accent: '#8b5cf6' },
    { label: 'Clean Sheets', value: cleanSheets,                 accent: '#06b6d4' },
    { label: 'Squad Goals',  value: totalGoals,                  accent: '#f59e0b' },
    { label: 'Avg Age',      value: avgAge || '—',               accent: '#64748b' },
    { label: 'Top Scorers',  value: players.filter(p => p.tournamentGoals > 0).length, accent: '#ec4899' },
  ]

  return (
    <Root variants={container} initial="hidden" animate="visible">
      {/* Team info cards */}
      <motion.div variants={item}>
        <SectionTitle>Team Information</SectionTitle>
        <InfoGrid>
          <InfoCard variants={item}>
            <InfoLabel>Coach</InfoLabel>
            <InfoValue>{team.manager}</InfoValue>
          </InfoCard>
          <InfoCard variants={item}>
            <InfoLabel>Captain</InfoLabel>
            <InfoValue>{team.captain}</InfoValue>
          </InfoCard>
          <InfoCard variants={item}>
            <InfoLabel>Confederation</InfoLabel>
            <InfoValue>{team.confederation}</InfoValue>
          </InfoCard>
          <InfoCard variants={item}>
            <InfoLabel>FIFA Ranking</InfoLabel>
            <InfoValue>#{team.fifaRank} World</InfoValue>
          </InfoCard>
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
