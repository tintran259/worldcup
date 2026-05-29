'use client'

import React, { useCallback, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag }            from '@/ui/primitives/Flag'
import { LivePulse }       from '@/ui/primitives/LivePulse'
import { useScoreFlip }    from '@/lib/animation'
import { useBracketStore, usePanelStore, useRealtimeStore } from '@/store'
import type { Match } from '@/types/domain.types'
import { NODE_WIDTH } from '../types'

// ── Live card glow ─────────────────────────────────────────────────────────────

const liveGlow = keyframes`
  0%,100% {
    box-shadow:
      0 0 0 1px rgba(239,68,68,0.28),
      0 2px 12px rgba(239,68,68,0.10);
  }
  50% {
    box-shadow:
      0 0 0 2px rgba(239,68,68,0.52),
      0 4px 20px rgba(239,68,68,0.18),
      0 0 32px rgba(239,68,68,0.06);
  }
`

const winnerGlow = keyframes`
  0%,100% { box-shadow: 0 0 0 1px rgba(16,185,129,0.22), 0 2px 8px rgba(16,185,129,0.08); }
  50%      { box-shadow: 0 0 0 2px rgba(16,185,129,0.42), 0 4px 16px rgba(16,185,129,0.14); }
`

// ── Card wrapper ──────────────────────────────────────────────────────────────

const Card = styled(motion.article)<{
  $status:     Match['status']
  $isSelected: boolean
  $isDimmed:   boolean
}>`
  width:      ${NODE_WIDTH}px;
  min-height: 80px;
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.18s ease,
    box-shadow   0.18s ease,
    opacity      0.18s ease;

  /* Top accent bar */
  &::before {
    content: '';
    display: block;
    height: 2px;
    transition: background 0.28s ease;
    background: ${(p) => {
      if (p.$status === 'live')
        return `linear-gradient(90deg, ${p.theme.colors.accent.live} 0%, transparent 80%)`
      if (p.$isSelected)
        return `linear-gradient(90deg, ${p.theme.colors.accent.primary} 0%, transparent 80%)`
      if (p.$status === 'completed')
        return `linear-gradient(90deg, ${p.theme.colors.accent.winner} 0%, transparent 75%)`
      return 'transparent'
    }};
  }

  /* Live state — pulsing red glow */
  ${(p) =>
    p.$status === 'live' &&
    css`
      border-color: rgba(239, 68, 68, 0.35);
      background: linear-gradient(
        150deg,
        rgba(254, 226, 226, 0.80) 0%,
        ${p.theme.colors.bg.surface} 48%
      );
      animation: ${liveGlow} 2.2s ease-in-out infinite;
    `}

  /* Completed winner — subtle emerald glow */
  ${(p) =>
    p.$status === 'completed' &&
    !p.$isSelected &&
    css`
      animation: ${winnerGlow} 3.2s ease-in-out infinite;
    `}

  /* Selected — cyan ring */
  ${(p) =>
    p.$isSelected &&
    css`
      border-color: rgba(37, 99, 235, 0.50);
      box-shadow:
        0 0 0 2px rgba(37, 99, 235, 0.18),
        0 4px 16px rgba(37, 99, 235, 0.10);
    `}

  /* Dimmed — team highlight mode */
  ${(p) =>
    p.$isDimmed &&
    css`
      opacity: 0.22;
      pointer-events: none;
    `}

  /* Hover — only when not dimmed */
  ${(p) =>
    !p.$isDimmed &&
    css`
      &:hover {
        border-color: ${p.$status === 'live'
          ? 'rgba(239, 68, 68, 0.60)'
          : 'rgba(37, 99, 235, 0.40)'};
        box-shadow: ${p.theme.shadows.cardHover};
        transform: translateY(-1.5px) scale(1.005);
      }
      &:active {
        transform: translateY(0) scale(1);
      }
    `}
`

// ── Team row ──────────────────────────────────────────────────────────────────

const TeamRow = styled.div<{ $isWinner: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[3]};
  opacity: ${(p) => (p.$isWinner ? 1 : 0.62)};
  transition: background 0.10s ease;

  &:hover { background: rgba(0, 0, 0, 0.02); }

  ${(p) =>
    p.$isWinner &&
    css`
      background: rgba(16, 185, 129, 0.05);
    `}
`

const TeamName = styled.span<{ $isWinner: boolean }>`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) =>
    p.$isWinner ? p.theme.fontWeights.bold : p.theme.fontWeights.medium};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  color: ${(p) =>
    p.$isWinner ? p.theme.colors.accent.winner : p.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ScoreBox = styled.span<{ $isWinner: boolean }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  line-height: 1;
  min-width: 22px;
  text-align: center;
  color: ${(p) =>
    p.$isWinner ? p.theme.colors.text.primary : p.theme.colors.text.muted};
  display: inline-block;   /* required for GSAP transform */
  transform-origin: center;
`

const WinnerMark = styled.span`
  font-size: 9px;
  color: ${(p) => p.theme.colors.accent.winner};
  line-height: 1;
`

const TbdLabel = styled.span`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.disabled};
  font-style: italic;
  letter-spacing: 0.01em;
`

// ── Divider ───────────────────────────────────────────────────────────────────

const Divider = styled.div`
  height: 1px;
  margin: 0 ${(p) => p.theme.space[3]};
  background: ${(p) => p.theme.colors.border.subtle};
`

// ── Footer ────────────────────────────────────────────────────────────────────

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.space[1]} ${(p) => p.theme.space[3]};
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.elevated};
`

const FooterLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
`

const LiveMinute = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.accent.live};
  letter-spacing: 0.04em;
  text-shadow: 0 0 8px rgba(239,68,68,0.40);
`

const ScheduleTag = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.accent.primary};
  letter-spacing: 0.02em;
  white-space: nowrap;
`

function formatSchedule(iso: string): string {
  const d = new Date(iso)
  const day = d.getUTCDate().toString().padStart(2, '0')
  const mon = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  const hh  = d.getUTCHours().toString().padStart(2, '0')
  const mm  = d.getUTCMinutes().toString().padStart(2, '0')
  return `${day}/${mon} · ${hh}:${mm}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface MatchCardProps {
  match: Match
  index: number
}

export function MatchCard({ match, index }: MatchCardProps) {
  const { selectedMatchId, selectMatch, highlightedTeamId, highlightTeam } =
    useBracketStore()
  const { openMatch }  = usePanelStore()
  const scoreUpdates   = useRealtimeStore((s) => s.scoreUpdates)

  const rt        = scoreUpdates[match.id]
  const homeScore = rt?.homeScore ?? match.score?.home
  const awayScore = rt?.awayScore ?? match.score?.away
  const liveMin   = rt?.minute ?? match.minute

  const isSelected    = selectedMatchId === match.id
  const isHighlighted = highlightedTeamId !== null &&
    (match.homeTeam?.id === highlightedTeamId || match.awayTeam?.id === highlightedTeamId)
  const isDimmed      = highlightedTeamId !== null && !isHighlighted

  const homeIsWinner = !!match.winnerId && match.winnerId === match.homeTeam?.id
  const awayIsWinner = !!match.winnerId && match.winnerId === match.awayTeam?.id

  // Refs for GSAP score flash
  const homeScoreRef = useRef<HTMLSpanElement>(null)
  const awayScoreRef = useRef<HTMLSpanElement>(null)
  useScoreFlip(homeScoreRef, homeScore)
  useScoreFlip(awayScoreRef, awayScore)

  const handleClick = useCallback(() => {
    selectMatch(match.id)
    openMatch(match.id)
  }, [match.id, selectMatch, openMatch])

  const handleTeamClick = useCallback(
    (e: React.MouseEvent, teamId: string) => {
      e.stopPropagation()
      highlightTeam(highlightedTeamId === teamId ? null : teamId)
    },
    [highlightedTeamId, highlightTeam],
  )

  return (
    <Card
      $status={match.status}
      $isSelected={isSelected}
      $isDimmed={isDimmed}
      onClick={handleClick}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Home team */}
      <TeamRow
        $isWinner={homeIsWinner}
        onClick={(e) => match.homeTeam && handleTeamClick(e, match.homeTeam.id)}
      >
        {match.homeTeam ? (
          <>
            <Flag countryCode={match.homeTeam.code} countryName={match.homeTeam.name} size="sm" />
            <TeamName $isWinner={homeIsWinner}>{match.homeTeam.shortName}</TeamName>
            {homeScore !== undefined && (
              <ScoreBox ref={homeScoreRef} $isWinner={homeIsWinner}>
                {homeScore}
              </ScoreBox>
            )}
            {homeIsWinner && <WinnerMark>★</WinnerMark>}
          </>
        ) : (
          <TbdLabel>Chưa xác định</TbdLabel>
        )}
      </TeamRow>

      <Divider />

      {/* Away team */}
      <TeamRow
        $isWinner={awayIsWinner}
        onClick={(e) => match.awayTeam && handleTeamClick(e, match.awayTeam.id)}
      >
        {match.awayTeam ? (
          <>
            <Flag countryCode={match.awayTeam.code} countryName={match.awayTeam.name} size="sm" />
            <TeamName $isWinner={awayIsWinner}>{match.awayTeam.shortName}</TeamName>
            {awayScore !== undefined && (
              <ScoreBox ref={awayScoreRef} $isWinner={awayIsWinner}>
                {awayScore}
              </ScoreBox>
            )}
            {awayIsWinner && <WinnerMark>★</WinnerMark>}
          </>
        ) : (
          <TbdLabel>Chưa xác định</TbdLabel>
        )}
      </TeamRow>

      {/* Footer */}
      <CardFooter>
        <FooterLabel>{match.roundDisplay}</FooterLabel>

        {match.status === 'live' && liveMin ? (
          <LiveMinute>{liveMin}&apos;</LiveMinute>
        ) : match.status === 'live' ? (
          <LivePulse size="sm" showLabel={false} />
        ) : match.status === 'upcoming' ? (
          <ScheduleTag>{formatSchedule(match.scheduledAt)}</ScheduleTag>
        ) : (
          <FooterLabel>{match.city}</FooterLabel>
        )}
      </CardFooter>
    </Card>
  )
}
