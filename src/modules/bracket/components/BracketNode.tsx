'use client'

import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import { Flag } from '@/ui/primitives/Flag'
import { LivePulse } from '@/ui/primitives/LivePulse'
import { useBracketStore, usePanelStore } from '@/store'
import { useRealtimeStore } from '@/store'
import type { Match } from '@/types/domain.types'
import { NODE_WIDTH, NODE_HEIGHT } from '../types'

interface NodeVariantProps {
  $status: Match['status']
  $isSelected: boolean
  $isHighlighted: boolean
  $isDimmed: boolean
}

const NodeWrapper = styled(motion.div)<NodeVariantProps>`
  position: absolute;
  width: ${NODE_WIDTH}px;
  min-height: ${NODE_HEIGHT}px;
  border-radius: ${(p) => p.theme.radii.card};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.surface};
  cursor: pointer;
  overflow: hidden;
  transition: ${(p) => p.theme.transitions.normal};
  user-select: none;

  /* Top accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 2px 2px 0 0;
    transition: background 0.3s ease;
    background: ${(p) => {
      if (p.$status === 'live') return `linear-gradient(90deg, ${p.theme.colors.accent.live}, transparent)`
      if (p.$isSelected) return `linear-gradient(90deg, ${p.theme.colors.accent.primary}, transparent)`
      return 'transparent'
    }};
  }

  ${(p) =>
    p.$status === 'live' &&
    css`
      border-color: rgba(255, 61, 0, 0.35);
      background: linear-gradient(
        135deg,
        rgba(74, 10, 10, 0.45) 0%,
        ${p.theme.colors.bg.surface} 55%
      );
      animation: live-border-breathe 2s ease-in-out infinite;
    `}

  ${(p) =>
    p.$isSelected &&
    css`
      border-color: rgba(0, 212, 255, 0.5);
      box-shadow: ${p.theme.glows.cyanMd};
    `}

  ${(p) =>
    p.$isDimmed &&
    css`
      opacity: 0.35;
    `}

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) =>
      p.$status === 'live' ? 'rgba(255,61,0,0.6)' : 'rgba(0,212,255,0.35)'};
    box-shadow: ${(p) => p.theme.shadows.cardHover};
  }

  &:active { transform: translateY(0); }
`

const NodeInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(p) => p.theme.space[2]} ${(p) => p.theme.space[3]};
  gap: ${(p) => p.theme.space[1.5]};
`

const TeamRow = styled.div<{ $isWinner: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1]} 0;

  opacity: ${(p) => (p.$isWinner ? 1 : 0.65)};
`

const TeamName = styled.span<{ $isWinner: boolean }>`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => (p.$isWinner ? p.theme.fontWeights.bold : p.theme.fontWeights.medium)};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  color: ${(p) => (p.$isWinner ? p.theme.colors.text.primary : p.theme.colors.text.secondary)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Score = styled.span<{ $isWinner: boolean }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  line-height: 1;
  min-width: 20px;
  text-align: center;
  color: ${(p) => (p.$isWinner ? p.theme.colors.text.primary : p.theme.colors.text.muted)};
`

const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.border.subtle};
  margin: 0 ${(p) => p.theme.space[1]};
`

const NodeFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.space[1]} ${(p) => p.theme.space[3]};
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(0, 0, 0, 0.2);
`

const MatchInfo = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
`

const MatchMinute = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.accent.live};
  letter-spacing: 0.04em;
  text-shadow: ${(p) => p.theme.glows.textLive};
`

const PlaceholderTeam = styled.div`
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: ${(p) => p.theme.radii.xs};
`

interface BracketNodeProps {
  match: Match
  x: number
  y: number
  index: number
}

export function BracketNode({ match, x, y, index }: BracketNodeProps) {
  const { selectedMatchId, selectMatch, highlightedTeamId, highlightTeam } = useBracketStore()
  const { openMatch } = usePanelStore()
  const scoreUpdates = useRealtimeStore((s) => s.scoreUpdates)

  const realtimeScore = scoreUpdates[match.id]
  const homeScore = realtimeScore?.homeScore ?? match.score?.home
  const awayScore = realtimeScore?.awayScore ?? match.score?.away
  const liveMinute = realtimeScore?.minute ?? match.minute

  const isSelected = selectedMatchId === match.id
  const isHighlighted =
    highlightedTeamId !== null &&
    (match.homeTeam?.id === highlightedTeamId || match.awayTeam?.id === highlightedTeamId)
  const isDimmed = highlightedTeamId !== null && !isHighlighted

  const homeIsWinner = match.winnerId === match.homeTeam?.id
  const awayIsWinner = match.winnerId === match.awayTeam?.id

  const handleClick = useCallback(() => {
    selectMatch(match.id)
    openMatch(match.id)
  }, [match.id, selectMatch, openMatch])

  const handleTeamClick = useCallback(
    (e: React.MouseEvent, teamId: string) => {
      e.stopPropagation()
      highlightTeam(highlightedTeamId === teamId ? null : teamId)
    },
    [highlightedTeamId, highlightTeam]
  )

  return (
    <NodeWrapper
      $status={match.status}
      $isSelected={isSelected}
      $isHighlighted={isHighlighted}
      $isDimmed={isDimmed}
      style={{ left: x, top: y }}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <NodeInner>
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
                <Score $isWinner={homeIsWinner}>{homeScore}</Score>
              )}
            </>
          ) : (
            <PlaceholderTeam />
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
                <Score $isWinner={awayIsWinner}>{awayScore}</Score>
              )}
            </>
          ) : (
            <PlaceholderTeam />
          )}
        </TeamRow>
      </NodeInner>

      <NodeFooter>
        <MatchInfo>{match.roundDisplay}</MatchInfo>
        {match.status === 'live' && liveMinute ? (
          <MatchMinute>{liveMinute}&apos;</MatchMinute>
        ) : match.status === 'live' ? (
          <LivePulse size="sm" showLabel={false} />
        ) : (
          <MatchInfo>{match.city}</MatchInfo>
        )}
      </NodeFooter>
    </NodeWrapper>
  )
}
