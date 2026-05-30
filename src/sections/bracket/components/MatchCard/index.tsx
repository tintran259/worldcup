'use client'

import React, { useCallback, useRef } from 'react'
import { Flag } from '@/components/Flag'
import { LivePulse } from '@/components/LivePulse'
import { useScoreFlip } from '@/hooks/useScoreFlip'
import { useBracketStore, usePanelStore, useRealtimeStore } from '@/stores'
import type { Match } from '@/types/domain.types'
import {
  Card,
  TeamRow,
  TeamName,
  ScoreBox,
  WinnerMark,
  TbdLabel,
  Divider,
  CardFooter,
  FooterLabel,
  LiveMinute,
  ScheduleTag,
} from './styles'

function formatSchedule(iso: string): string {
  const d = new Date(iso)
  const day = d.getUTCDate().toString().padStart(2, '0')
  const mon = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  const hh = d.getUTCHours().toString().padStart(2, '0')
  const mm = d.getUTCMinutes().toString().padStart(2, '0')
  return `${day}/${mon} · ${hh}:${mm}`
}

export interface MatchCardProps {
  match: Match
  index: number
}

export function MatchCard({ match, index }: MatchCardProps) {
  const { selectedMatchId, selectMatch, highlightedTeamId, highlightTeam } =
    useBracketStore()
  const { openMatch } = usePanelStore()
  const scoreUpdates = useRealtimeStore((s) => s.scoreUpdates)

  const rt = scoreUpdates[match.id]
  const homeScore = rt?.homeScore ?? match.score?.home
  const awayScore = rt?.awayScore ?? match.score?.away
  const liveMin = rt?.minute ?? match.minute

  const isSelected = selectedMatchId === match.id
  const isHighlighted = highlightedTeamId !== null &&
    (match.homeTeam?.id === highlightedTeamId || match.awayTeam?.id === highlightedTeamId)
  const isDimmed = highlightedTeamId !== null && !isHighlighted

  const homeIsWinner = !!match.winnerId && match.winnerId === match.homeTeam?.id
  const awayIsWinner = !!match.winnerId && match.winnerId === match.awayTeam?.id

  // Refs for GSAP score flash animation
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
      {/* Home team row */}
      <TeamRow
        $isWinner={homeIsWinner}
        onClick={(e) => match.homeTeam && handleTeamClick(e, match.homeTeam.id)}
      >
        {match.homeTeam ? (
          <>
            <Flag countryCode={match.homeTeam.code} countryName={match.homeTeam.name} flagUrl={match.homeTeam.flagUrl} size="sm" />
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

      {/* Away team row */}
      <TeamRow
        $isWinner={awayIsWinner}
        onClick={(e) => match.awayTeam && handleTeamClick(e, match.awayTeam.id)}
      >
        {match.awayTeam ? (
          <>
            <Flag countryCode={match.awayTeam.code} countryName={match.awayTeam.name} flagUrl={match.awayTeam.flagUrl} size="sm" />
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

      {/* Footer: round info + live minute / schedule */}
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
