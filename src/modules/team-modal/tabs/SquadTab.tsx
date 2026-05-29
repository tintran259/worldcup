'use client'

import { useState } from 'react'
import styled        from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { TEAM_MAP }      from '@/lib/mock/teams'
import { getTeamPlayers } from '@/lib/mock/players'
import type { StarPlayer }  from '@/lib/mock/types'

// ── Player status ──────────────────────────────────────────────────────────────

type PlayerStatus = 'available' | 'yellow-risk' | 'suspended' | 'injured' | 'out'

function getStatus(p: StarPlayer): PlayerStatus {
  if (p.tournamentRedCards > 0)    return 'suspended'
  if (p.tournamentYellowCards >= 2) return 'yellow-risk'
  // Deterministic variety via player id seed
  const seed = parseInt(p.id.replace('p', '')) || 0
  if (seed % 11 === 0) return 'injured'
  return 'available'
}

const STATUS: Record<PlayerStatus, { icon: string; label: string; bg: string; color: string }> = {
  'available':   { icon: '🟢', label: 'Available',    bg: 'rgba(16,185,129,0.10)', color: '#065f46' },
  'yellow-risk': { icon: '🟡', label: 'Yellow Risk',  bg: 'rgba(245,158,11,0.10)', color: '#92400e' },
  'suspended':   { icon: '🔴', label: 'Suspended',    bg: 'rgba(239,68,68,0.10)',  color: '#991b1b' },
  'injured':     { icon: '⚠️', label: 'Injured',      bg: 'rgba(249,115,22,0.10)', color: '#9a3412' },
  'out':         { icon: '❌', label: 'Out',           bg: 'rgba(107,114,128,0.10)','color': '#374151' },
}

const POSITION_ORDER: StarPlayer['position'][] = ['GK', 'DEF', 'MID', 'FWD']
const POSITION_LABELS: Record<StarPlayer['position'], string> = {
  GK:  'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  FWD: 'Forwards',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

function ratingColor(r: number): string {
  if (r >= 9.0) return '#10b981'
  if (r >= 8.0) return '#3b82f6'
  if (r >= 7.0) return '#f59e0b'
  return '#ef4444'
}

// ── Styled ─────────────────────────────────────────────────────────────────────

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const PositionGroup = styled.div``

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`

const GroupLabel = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

const GroupCount = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.disabled};
  background: ${(p) => p.theme.colors.bg.elevated};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 999px;
  padding: 1px 7px;
`

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  ${(p) => p.theme.mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${(p) => p.theme.mq.xl} {
    grid-template-columns: repeat(3, 1fr);
  }
`

// ── Player card ────────────────────────────────────────────────────────────────

const CardRoot = styled(motion.div)`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.border.default};
  }
`

const CardMain = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
`

const Avatar = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 14px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  border: 2px solid rgba(255,255,255,0.30);
  letter-spacing: 0.02em;
  position: relative;
`

const CaptainBadge = styled.span`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f59e0b;
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  line-height: 1;
`

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const PlayerName = styled.p`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`

const PlayerMeta = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const JerseyNum = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.disabled};
  min-width: 28px;
  text-align: right;
  flex-shrink: 0;
`

const StatusBadge = styled.span<{ $s: PlayerStatus }>`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 999px;
  background: ${(p) => STATUS[p.$s].bg};
  color: ${(p) => STATUS[p.$s].color};
  white-space: nowrap;
  flex-shrink: 0;
`

// Expanded stats row
const StatsRow = styled(motion.div)`
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.elevated};
  padding: 10px 14px;
  display: flex;
  gap: 0;
  overflow: hidden;
`

const StatChip = styled.div`
  flex: 1;
  text-align: center;
`

const StatVal = styled.div<{ $color?: string }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.$color ?? p.theme.colors.text.primary};
  line-height: 1;
`

const StatKey = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 2px;
`

const RatingDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  margin-right: 3px;
  vertical-align: middle;
`

// Empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: ${(p) => p.theme.colors.text.disabled};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.sm};
`

// ── Player Card Component ──────────────────────────────────────────────────────

function PlayerCard({
  player,
  teamColor,
  onOpen,
}: {
  player: StarPlayer
  teamColor: string
  onOpen: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const status = getStatus(player)

  return (
    <CardRoot
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.15 }}
      onClick={() => onOpen(player.id)}
    >
      <CardMain>
        <Avatar $color={teamColor}>
          {initials(player.name)}
          {player.isCaptain && <CaptainBadge>C</CaptainBadge>}
        </Avatar>

        <PlayerInfo>
          <PlayerName>{player.name}</PlayerName>
          <PlayerMeta>{player.age}y · {player.club}</PlayerMeta>
        </PlayerInfo>

        <StatusBadge $s={status}>
          {STATUS[status].icon} {STATUS[status].label}
        </StatusBadge>

        <JerseyNum>#{player.shirtNumber}</JerseyNum>
      </CardMain>

      <AnimatePresence>
        {hovered && (
          <StatsRow
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <StatChip>
              <StatVal>{player.matchesPlayed}</StatVal>
              <StatKey>MP</StatKey>
            </StatChip>
            <StatChip>
              <StatVal $color="#10b981">{player.tournamentGoals}</StatVal>
              <StatKey>Goals</StatKey>
            </StatChip>
            <StatChip>
              <StatVal $color="#3b82f6">{player.tournamentAssists}</StatVal>
              <StatKey>Assists</StatKey>
            </StatChip>
            <StatChip>
              <StatVal $color="#f59e0b">{player.tournamentYellowCards}</StatVal>
              <StatKey>YC</StatKey>
            </StatChip>
            <StatChip>
              <StatVal $color="#ef4444">{player.tournamentRedCards}</StatVal>
              <StatKey>RC</StatKey>
            </StatChip>
            <StatChip>
              <StatVal>
                <RatingDot $color={ratingColor(player.rating)} />
                {player.rating.toFixed(1)}
              </StatVal>
              <StatKey>Rating</StatKey>
            </StatChip>
          </StatsRow>
        )}
      </AnimatePresence>
    </CardRoot>
  )
}

// ── Main tab ──────────────────────────────────────────────────────────────────

interface Props {
  teamId: string
  onPlayerClick: (playerId: string) => void
}

export function SquadTab({ teamId, onPlayerClick }: Props) {
  const team    = TEAM_MAP.get(teamId)
  const players = getTeamPlayers(teamId)
  const teamColor = team?.homeColor ?? '#2563eb'

  if (!players.length) {
    return (
      <EmptyState>
        <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
        <div>Squad data not yet available for this team.</div>
      </EmptyState>
    )
  }

  const grouped = POSITION_ORDER.reduce<Record<string, StarPlayer[]>>(
    (acc, pos) => {
      const list = players.filter(p => p.position === pos)
      if (list.length) acc[pos] = list
      return acc
    },
    {},
  )

  return (
    <Root>
      {(Object.entries(grouped) as [StarPlayer['position'], StarPlayer[]][]).map(([pos, list]) => (
        <PositionGroup key={pos}>
          <GroupHeader>
            <GroupLabel>{POSITION_LABELS[pos]}</GroupLabel>
            <GroupCount>{list.length}</GroupCount>
          </GroupHeader>

          <PlayerGrid>
            {list.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: i * 0.04 }}
              >
                <PlayerCard
                  player={player}
                  teamColor={teamColor}
                  onOpen={onPlayerClick}
                />
              </motion.div>
            ))}
          </PlayerGrid>
        </PositionGroup>
      ))}
    </Root>
  )
}
