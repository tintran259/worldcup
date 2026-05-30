'use client'

import { motion } from 'framer-motion'
import { TEAM_MAP }       from '@/lib/mock/teams'
import { getTeamPlayers } from '@/lib/mock/players'
import { MOCK_ROUNDS }    from '@/lib/mock'
import type { StarPlayer } from '@/lib/mock/types'
import type { Match }      from '@/types/domain.types'
import {
  Root, SectionTitle,
  LeaderGrid, LeaderCard, LeaderIcon, LeaderTitle, LeaderAvatar, LeaderName, LeaderStat, LeaderStatLabel,
  TableCard, TableHead, TH, TableRow, TD, PlayerNameCell, SmallAvatar, PlayerFullName, RatingChip,
  BarRow, BarLabel, BarTrack, BarFill, BarVal, SummaryCard,
} from './styles'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTeamMatches(teamId: string): Match[] {
  return MOCK_ROUNDS.flatMap(r => r.matches)
    .filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

function ratingColor(r: number): string {
  if (r >= 9.0) return '#10b981'
  if (r >= 8.0) return '#3b82f6'
  return '#f59e0b'
}

// ── Animation variants ────────────────────────────────────────────────────────

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  teamId: string
  onPlayerClick: (id: string) => void
}

export function TournamentStatsTab({ teamId, onPlayerClick }: Props) {
  const team      = TEAM_MAP.get(teamId)
  const players   = getTeamPlayers(teamId)
  const matches   = getTeamMatches(teamId)
  const teamColor = team?.homeColor ?? '#2563eb'

  if (!players.length) {
    return (
      <Root variants={stagger} initial="hidden" animate="visible">
        <motion.p variants={fadeUp} style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
          No player data available for this team.
        </motion.p>
      </Root>
    )
  }

  const sorted = {
    goals:   [...players].sort((a, b) => b.tournamentGoals   - a.tournamentGoals),
    assists: [...players].sort((a, b) => b.tournamentAssists - a.tournamentAssists),
    rating:  [...players].sort((a, b) => b.rating            - a.rating),
    minutes: [...players].sort((a, b) => b.minutesPlayed     - a.minutesPlayed),
  }

  const leaders = [
    { icon: '🏆', title: 'Top Scorer',  player: sorted.goals[0],   stat: sorted.goals[0]?.tournamentGoals,    label: 'goals',   accent: '#f59e0b' },
    { icon: '🎯', title: 'Top Assister',player: sorted.assists[0], stat: sorted.assists[0]?.tournamentAssists, label: 'assists', accent: '#3b82f6' },
    { icon: '⭐', title: 'Best Rated',  player: sorted.rating[0],  stat: sorted.rating[0]?.rating.toFixed(1), label: 'rating',  accent: '#10b981' },
    { icon: '⏱️', title: 'Most Minutes',player: sorted.minutes[0], stat: sorted.minutes[0]?.minutesPlayed,    label: 'mins',    accent: '#8b5cf6' },
  ]

  const totGoals   = players.reduce((s, p) => s + p.tournamentGoals, 0)
  const totAssists = players.reduce((s, p) => s + p.tournamentAssists, 0)
  const totYellow  = players.reduce((s, p) => s + p.tournamentYellowCards, 0)

  const completedMatches = matches.filter(m => m.status === 'completed')
  const totalMatchGoals  = completedMatches.reduce((s, m) => {
    if (!m.score) return s
    return s + (m.homeTeam?.id === teamId ? m.score.home : m.score.away)
  }, 0)

  return (
    <Root variants={stagger} initial="hidden" animate="visible">

      {/* Leaders */}
      <motion.div variants={fadeUp}>
        <SectionTitle>Tournament Leaders</SectionTitle>
        <LeaderGrid>
          {leaders.map(l => l.player && (
            <LeaderCard key={l.title} variants={fadeUp} $accent={l.accent}
              onClick={() => onPlayerClick(l.player!.id)}>
              <LeaderIcon>{l.icon}</LeaderIcon>
              <LeaderTitle>{l.title}</LeaderTitle>
              <LeaderAvatar $color={teamColor}>{initials(l.player.name)}</LeaderAvatar>
              <LeaderName>{l.player.name.split(' ').pop()}</LeaderName>
              <LeaderStat>{l.stat}</LeaderStat>
              <LeaderStatLabel>{l.label}</LeaderStatLabel>
            </LeaderCard>
          ))}
        </LeaderGrid>
      </motion.div>

      {/* Team totals */}
      <motion.div variants={fadeUp}>
        <SectionTitle>Team Totals</SectionTitle>
        <SummaryCard variants={fadeUp}>
          {[
            { label: 'Goals scored',   value: totalMatchGoals || totGoals, max: 10,  color: '#10b981', delay: 0   },
            { label: 'Assists',        value: totAssists,                  max: 10,  color: '#3b82f6', delay: 0.1 },
            { label: 'Yellow cards',   value: totYellow,                   max: 8,   color: '#f59e0b', delay: 0.2 },
            { label: 'Matches played', value: completedMatches.length,     max: 7,   color: '#8b5cf6', delay: 0.3 },
          ].map(({ label, value, max, color, delay }) => (
            <BarRow key={label}>
              <BarLabel>{label}</BarLabel>
              <BarTrack>
                <BarFill
                  $color={color}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(value / max * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                />
              </BarTrack>
              <BarVal>{value}</BarVal>
            </BarRow>
          ))}
        </SummaryCard>
      </motion.div>

      {/* All players table */}
      <motion.div variants={fadeUp}>
        <SectionTitle>All Player Stats</SectionTitle>
        <TableCard>
          <TableHead>
            <TH>Player</TH><TH>MP</TH><TH>G</TH><TH>A</TH><TH>YC</TH><TH>RC</TH><TH>Rating</TH>
          </TableHead>

          {sorted.goals.map((p, i) => (
            <TableRow key={p.id} $alt={i % 2 === 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onPlayerClick(p.id)}
            >
              <TD>
                <PlayerNameCell>
                  <SmallAvatar $color={teamColor}>{initials(p.name)}</SmallAvatar>
                  <PlayerFullName>{p.name}</PlayerFullName>
                </PlayerNameCell>
              </TD>
              <TD>{p.matchesPlayed}</TD>
              <TD style={{ color: '#10b981', fontWeight: 700 }}>{p.tournamentGoals}</TD>
              <TD style={{ color: '#3b82f6', fontWeight: 700 }}>{p.tournamentAssists}</TD>
              <TD style={{ color: '#f59e0b' }}>{p.tournamentYellowCards}</TD>
              <TD style={{ color: '#ef4444' }}>{p.tournamentRedCards}</TD>
              <TD>
                <RatingChip $color={ratingColor(p.rating)}>
                  {p.rating.toFixed(1)}
                </RatingChip>
              </TD>
            </TableRow>
          ))}
        </TableCard>
      </motion.div>
    </Root>
  )
}
