'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEAM_MAP }       from '@/lib/mock/teams'
import { getTeamPlayers } from '@/lib/mock/players'
import type { StarPlayer } from '@/lib/mock/types'
import {
  Root, PositionGroup, GroupHeader, GroupLabel, GroupCount,
  PlayerGrid, CardRoot, CardMain, Avatar, CaptainBadge,
  PlayerInfo, PlayerName, PlayerMeta, JerseyNum, StatusBadge,
  StatsRow, StatChip, StatVal, StatKey, RatingDot, EmptyState,
} from './styles'

// ── Player status ─────────────────────────────────────────────────────────────

type PlayerStatus = 'available' | 'yellow-risk' | 'suspended' | 'injured' | 'out'

function getStatus(p: StarPlayer): PlayerStatus {
  if (p.tournamentRedCards > 0)     return 'suspended'
  if (p.tournamentYellowCards >= 2) return 'yellow-risk'
  const seed = parseInt(p.id.replace('p', '')) || 0
  if (seed % 11 === 0)              return 'injured'
  return 'available'
}

const STATUS: Record<PlayerStatus, { icon: string; label: string; bg: string; color: string }> = {
  'available':   { icon: '🟢', label: 'Available',   bg: 'rgba(16,185,129,0.10)', color: '#065f46' },
  'yellow-risk': { icon: '🟡', label: 'Yellow Risk', bg: 'rgba(245,158,11,0.10)', color: '#92400e' },
  'suspended':   { icon: '🔴', label: 'Suspended',   bg: 'rgba(239,68,68,0.10)',  color: '#991b1b' },
  'injured':     { icon: '⚠️', label: 'Injured',     bg: 'rgba(249,115,22,0.10)', color: '#9a3412' },
  'out':         { icon: '❌', label: 'Out',          bg: 'rgba(107,114,128,0.10)', color: '#374151' },
}

const POSITION_ORDER: StarPlayer['position'][] = ['GK', 'DEF', 'MID', 'FWD']
const POSITION_LABELS: Record<StarPlayer['position'], string> = {
  GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', FWD: 'Forwards',
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

// ── PlayerCard sub-component ──────────────────────────────────────────────────

function PlayerCard({
  player, teamColor, onOpen,
}: { player: StarPlayer; teamColor: string; onOpen: (id: string) => void }) {
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

        <StatusBadge
          $s={status}
          style={{ background: STATUS[status].bg, color: STATUS[status].color }}
        >
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
            <StatChip><StatVal>{player.matchesPlayed}</StatVal><StatKey>MP</StatKey></StatChip>
            <StatChip><StatVal $color="#10b981">{player.tournamentGoals}</StatVal><StatKey>Goals</StatKey></StatChip>
            <StatChip><StatVal $color="#3b82f6">{player.tournamentAssists}</StatVal><StatKey>Assists</StatKey></StatChip>
            <StatChip><StatVal $color="#f59e0b">{player.tournamentYellowCards}</StatVal><StatKey>YC</StatKey></StatChip>
            <StatChip><StatVal $color="#ef4444">{player.tournamentRedCards}</StatVal><StatKey>RC</StatKey></StatChip>
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

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  teamId: string
  onPlayerClick: (playerId: string) => void
}

export function SquadTab({ teamId, onPlayerClick }: Props) {
  const team      = TEAM_MAP.get(teamId)
  const players   = getTeamPlayers(teamId)
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
                <PlayerCard player={player} teamColor={teamColor} onOpen={onPlayerClick} />
              </motion.div>
            ))}
          </PlayerGrid>
        </PositionGroup>
      ))}
    </Root>
  )
}
