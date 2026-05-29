'use client'

import styled        from 'styled-components'
import { motion }    from 'framer-motion'
import { TEAM_MAP }       from '@/lib/mock/teams'
import { getTeamPlayers } from '@/lib/mock/players'
import { MOCK_ROUNDS }    from '@/lib/constants/mockData'
import type { StarPlayer } from '@/lib/mock/types'
import type { Match }      from '@/types/domain.types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTeamMatches(teamId: string): Match[] {
  return MOCK_ROUNDS.flatMap(r => r.matches)
    .filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

// ── Animations ─────────────────────────────────────────────────────────────────

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Styled ─────────────────────────────────────────────────────────────────────

const Root = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 12px;
`

// ── Leaders cards ─────────────────────────────────────────────────────────────

const LeaderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  ${(p) => p.theme.mq.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const LeaderCard = styled(motion.div)<{ $accent: string }>`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(p) => p.theme.shadows.md};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${(p) => p.$accent};
  }
`

const LeaderIcon = styled.div`
  font-size: 22px;
  margin-bottom: 8px;
  line-height: 1;
`

const LeaderTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 8px;
`

const LeaderAvatar = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 12px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  margin-bottom: 8px;
`

const LeaderName = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`

const LeaderStat = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
  margin-top: 6px;
`

const LeaderStatLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

// ── All players table ─────────────────────────────────────────────────────────

const TableCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  overflow: hidden;
`

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 36px 36px 36px 36px 36px 52px;
  gap: 4px;
  padding: 8px 14px;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
`

const TH = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.disabled};
  text-align: center;
  &:first-child { text-align: left; }
`

const TableRow = styled(motion.div)<{ $alt: boolean }>`
  display: grid;
  grid-template-columns: 1fr 36px 36px 36px 36px 36px 52px;
  gap: 4px;
  padding: 9px 14px;
  background: ${(p) => p.$alt ? p.theme.colors.bg.elevated : 'transparent'};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  align-items: center;

  &:last-child { border-bottom: none; }

  &:hover { background: rgba(37,99,235,0.03); cursor: pointer; }
`

const TD = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.secondary};
  text-align: center;
  &:first-child { text-align: left; }
`

const PlayerNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const SmallAvatar = styled.div<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 8px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  flex-shrink: 0;
`

const PlayerFullName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.medium};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const RatingChip = styled.span<{ $color: string }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}18;
  border-radius: 6px;
  padding: 2px 6px;
  text-align: center;
  display: inline-block;
  width: 100%;
`

// ── Bar stat ───────────────────────────────────────────────────────────────────

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

const BarLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.04em;
  min-width: 80px;
`

const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-radius: 3px;
  overflow: hidden;
`

const BarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  border-radius: 3px;
  background: ${(p) => p.$color};
`

const BarVal = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  min-width: 30px;
  text-align: right;
`

const SummaryCard = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 14px;
  padding: 16px 18px;
`

// ── Component ─────────────────────────────────────────────────────────────────

function ratingColor(r: number): string {
  if (r >= 9.0) return '#10b981'
  if (r >= 8.0) return '#3b82f6'
  return '#f59e0b'
}

interface Props {
  teamId: string
  onPlayerClick: (id: string) => void
}

export function TournamentStatsTab({ teamId, onPlayerClick }: Props) {
  const team    = TEAM_MAP.get(teamId)
  const players = getTeamPlayers(teamId)
  const matches = getTeamMatches(teamId)
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
    goals:   [...players].sort((a, b) => b.tournamentGoals    - a.tournamentGoals),
    assists: [...players].sort((a, b) => b.tournamentAssists  - a.tournamentAssists),
    rating:  [...players].sort((a, b) => b.rating             - a.rating),
    minutes: [...players].sort((a, b) => b.minutesPlayed      - a.minutesPlayed),
  }

  const leaders = [
    { icon: '🏆', title: 'Top Scorer',       player: sorted.goals[0],   stat: sorted.goals[0]?.tournamentGoals,   label: 'goals',   accent: '#f59e0b' },
    { icon: '🎯', title: 'Top Assister',      player: sorted.assists[0], stat: sorted.assists[0]?.tournamentAssists,label: 'assists', accent: '#3b82f6' },
    { icon: '⭐', title: 'Best Rated',        player: sorted.rating[0],  stat: sorted.rating[0]?.rating.toFixed(1),label: 'rating',  accent: '#10b981' },
    { icon: '⏱️', title: 'Most Minutes',      player: sorted.minutes[0], stat: sorted.minutes[0]?.minutesPlayed,   label: 'mins',    accent: '#8b5cf6' },
  ]

  // Team aggregate bars
  const totGoals   = players.reduce((s, p) => s + p.tournamentGoals, 0)
  const totAssists = players.reduce((s, p) => s + p.tournamentAssists, 0)
  const totYellow  = players.reduce((s, p) => s + p.tournamentYellowCards, 0)
  const maxGoals   = 10  // normalised
  const maxAssists = 10

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
            <LeaderCard
              key={l.title}
              variants={fadeUp}
              $accent={l.accent}
              onClick={() => onPlayerClick(l.player!.id)}
            >
              <LeaderIcon>{l.icon}</LeaderIcon>
              <LeaderTitle>{l.title}</LeaderTitle>
              <LeaderAvatar $color={teamColor}>
                {initials(l.player.name)}
              </LeaderAvatar>
              <LeaderName>{l.player.name.split(' ').pop()}</LeaderName>
              <LeaderStat>{l.stat}</LeaderStat>
              <LeaderStatLabel>{l.label}</LeaderStatLabel>
            </LeaderCard>
          ))}
        </LeaderGrid>
      </motion.div>

      {/* Team aggregate */}
      <motion.div variants={fadeUp}>
        <SectionTitle>Team Totals</SectionTitle>
        <SummaryCard variants={fadeUp}>
          <BarRow>
            <BarLabel>Goals scored</BarLabel>
            <BarTrack>
              <BarFill
                $color="#10b981"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalMatchGoals || totGoals) / maxGoals * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </BarTrack>
            <BarVal>{totalMatchGoals || totGoals}</BarVal>
          </BarRow>
          <BarRow>
            <BarLabel>Assists</BarLabel>
            <BarTrack>
              <BarFill
                $color="#3b82f6"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totAssists / maxAssists * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </BarTrack>
            <BarVal>{totAssists}</BarVal>
          </BarRow>
          <BarRow>
            <BarLabel>Yellow cards</BarLabel>
            <BarTrack>
              <BarFill
                $color="#f59e0b"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totYellow / 8 * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </BarTrack>
            <BarVal>{totYellow}</BarVal>
          </BarRow>
          <BarRow>
            <BarLabel>Matches played</BarLabel>
            <BarTrack>
              <BarFill
                $color="#8b5cf6"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(completedMatches.length / 7 * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </BarTrack>
            <BarVal>{completedMatches.length}</BarVal>
          </BarRow>
        </SummaryCard>
      </motion.div>

      {/* All players table */}
      <motion.div variants={fadeUp}>
        <SectionTitle>All Player Stats</SectionTitle>
        <TableCard>
          <TableHead>
            <TH>Player</TH>
            <TH>MP</TH>
            <TH>G</TH>
            <TH>A</TH>
            <TH>YC</TH>
            <TH>RC</TH>
            <TH>Rating</TH>
          </TableHead>

          {sorted.goals.map((p, i) => (
            <TableRow
              key={p.id}
              $alt={i % 2 === 1}
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
