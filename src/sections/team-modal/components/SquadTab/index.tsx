'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ExtendedTeam, StarPlayer } from '@/lib/mock/types'
import {
  Root, PositionGroup, GroupHeader, GroupLabel, GroupCount,
  PlayerList, Row, PosBadge, JerseyCol, AvatarCol, AvatarImg, AvatarFallback,
  NameCol, PlayerName, PlayerMeta,
  StatsCol, StatItem, StatVal, StatKey, RatingPill, CaptainTag,
  EmptyState,
} from './styles'

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

// ── Position config — FIFA Online color scheme ───────────────────────────────

const POSITION_ORDER: StarPlayer['position'][] = ['GK', 'DEF', 'MID', 'FWD']

const POSITION_LABELS: Record<StarPlayer['position'], string> = {
  GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', FWD: 'Forwards',
}

// FIFA Online / FUT style position colors
const POSITION_COLORS: Record<StarPlayer['position'], { bg: string; text: string }> = {
  GK:  { bg: '#fbbf24', text: '#7c2d12' }, // amber — goalkeeper
  DEF: { bg: '#10b981', text: '#064e3b' }, // green — defender
  MID: { bg: '#3b82f6', text: '#1e3a8a' }, // blue  — midfielder
  FWD: { bg: '#ef4444', text: '#7f1d1d' }, // red   — forward
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ratingColor(r: number): string {
  if (r >= 9.0) return '#10b981'
  if (r >= 8.0) return '#3b82f6'
  if (r >= 7.0) return '#f59e0b'
  return '#ef4444'
}

// ── PlayerRow ────────────────────────────────────────────────────────────────

const rowHoverTransition = { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.6 }

function PlayerRow({
  player, teamColor, onOpen, index,
}: { player: StarPlayer; teamColor: string; onOpen: (id: string) => void; index: number }) {
  const pos = POSITION_COLORS[player.position]
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = player.photoUrl && !imgFailed

  return (
    <Row
      onClick={() => onOpen(player.id)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 2, transition: rowHoverTransition }}
      whileTap={{ scale: 0.995 }}
    >
      <PosBadge style={{ background: pos.bg, color: pos.text }}>
        {player.position}
      </PosBadge>

      <JerseyCol>{player.shirtNumber}</JerseyCol>

      <AvatarCol>
        {showImage ? (
          <AvatarImg
            src={player.photoUrl}
            alt={player.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <AvatarFallback $color={teamColor}>{initials(player.name)}</AvatarFallback>
        )}
      </AvatarCol>

      <NameCol>
        <PlayerName>
          {player.name}
          {player.isCaptain && <CaptainTag>C</CaptainTag>}
        </PlayerName>
        <PlayerMeta>{player.age}y · {player.club}</PlayerMeta>
      </NameCol>

      <StatsCol>
        <StatItem>
          <StatVal $color="#10b981">{player.tournamentGoals}</StatVal>
          <StatKey>G</StatKey>
        </StatItem>
        <StatItem>
          <StatVal $color="#3b82f6">{player.tournamentAssists}</StatVal>
          <StatKey>A</StatKey>
        </StatItem>
        <StatItem>
          <StatVal $color="#64748b">{player.matchesPlayed}</StatVal>
          <StatKey>MP</StatKey>
        </StatItem>
        {/* YC/RC ẩn trên maxSm — tap row mở drawer xem full stats */}
        <StatItem className="stat-extra">
          <StatVal $color="#f59e0b">{player.tournamentYellowCards}</StatVal>
          <StatKey>YC</StatKey>
        </StatItem>
        <StatItem className="stat-extra">
          <StatVal $color="#ef4444">{player.tournamentRedCards}</StatVal>
          <StatKey>RC</StatKey>
        </StatItem>
      </StatsCol>

      <RatingPill $color={ratingColor(player.rating)}>
        {player.rating.toFixed(1)}
      </RatingPill>
    </Row>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface SquadTabProps {
  team:          ExtendedTeam | null
  players:       StarPlayer[]
  onPlayerClick: (playerId: string) => void
}

export function SquadTab({ team, players, onPlayerClick }: SquadTabProps) {
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

  let runningIdx = 0

  return (
    <Root>
      {(Object.entries(grouped) as [StarPlayer['position'], StarPlayer[]][]).map(([pos, list]) => (
        <PositionGroup key={pos}>
          <GroupHeader>
            <GroupLabel>
              <span
                style={{
                  display: 'inline-block',
                  width: 6, height: 6, borderRadius: '50%',
                  background: POSITION_COLORS[pos].bg,
                  marginRight: 8,
                }}
              />
              {POSITION_LABELS[pos]}
            </GroupLabel>
            <GroupCount>{list.length}</GroupCount>
          </GroupHeader>

          <PlayerList>
            {list.map((player) => (
              <motion.div key={player.id}>
                <PlayerRow player={player} teamColor={teamColor} onOpen={onPlayerClick} index={runningIdx++} />
              </motion.div>
            ))}
          </PlayerList>
        </PositionGroup>
      ))}
    </Root>
  )
}
