'use client'

import React, { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Flag } from '@/components/Flag'
import { useBracketStore, usePanelStore, useRealtimeStore } from '@/stores'
import type { Match } from '@/types/domain.types'
import {
  CardRoot,
  HoverShimmer,
  AccentBar,
  CardHeader,
  RoundBadge,
  StatusPill,
  LiveDotEl,
  CardBody,
  TeamSide,
  TeamInfo,
  TeamName,
  TeamCode,
  TbdTeam,
  ScoreCenter,
  ScoreRow,
  ScoreNum,
  ScoreDivider,
  ScorePenalty,
  KickoffBlock,
  KickoffTime,
  KickoffDate,
  VsLabel,
  MinuteRow,
  MinuteNum,
  CardFooter,
  FooterLeft,
  FooterRight,
  FooterText,
  FooterIcon,
  LiveMinuteTag,
  WinnerStar,
  cardVariants,
  scoreVariants,
  badgeVariants,
} from './styles'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MatchCardProps {
  match: Match
  /** Stagger index for entrance animation */
  index?: number
  /** Whether to show the round label in the header */
  showRound?: boolean
  /** Extra click handler (selectMatch + openMatch always fire) */
  onClick?: (match: Match) => void
  className?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSchedule(iso: string) {
  const d = new Date(iso)
  const hh = d.getUTCHours().toString().padStart(2, '0')
  const mm = d.getUTCMinutes().toString().padStart(2, '0')
  const dd = d.getUTCDate().toString().padStart(2, '0')
  const mo = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  return { time: `${hh}:${mm}`, date: `${dd}/${mo}` }
}

function statusLabel(status: Match['status']): string {
  if (status === 'live') return 'Live'
  if (status === 'completed') return 'Kết thúc'
  return 'Sắp diễn ra'
}

// ── Animated score digit ──────────────────────────────────────────────────────

interface AnimScoreProps {
  value: number | undefined
  isWinner: boolean
}

function AnimScore({ value, isWinner }: AnimScoreProps) {
  if (value === undefined) return null
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <ScoreNum
        key={value}
        $isWinner={isWinner}
        variants={scoreVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {value}
      </ScoreNum>
    </AnimatePresence>
  )
}

// ── Live dot ──────────────────────────────────────────────────────────────────

function LiveDot() {
  return <LiveDotEl aria-hidden="true" />
}

// ── Main component ────────────────────────────────────────────────────────────

export function MatchCard({
  match,
  index = 0,
  showRound = true,
  onClick,
  className,
}: MatchCardProps) {
  const { selectedMatchId, selectMatch } = useBracketStore()
  const { openMatch } = usePanelStore()
  const scoreUpdates = useRealtimeStore((s) => s.scoreUpdates)

  const rt = scoreUpdates[match.id]
  const homeScore = rt?.homeScore ?? match.score?.home
  const awayScore = rt?.awayScore ?? match.score?.away
  const liveMinute = rt?.minute ?? match.minute

  const isSelected = selectedMatchId === match.id
  const homeIsWinner = !!match.winnerId && match.winnerId === match.homeTeam?.id
  const awayIsWinner = !!match.winnerId && match.winnerId === match.awayTeam?.id

  const hasPens = match.score?.homePenalties !== undefined
  const schedule = parseSchedule(match.scheduledAt)

  const handleClick = useCallback(() => {
    selectMatch(match.id)
    openMatch(match.id)
    onClick?.(match)
  }, [match, selectMatch, openMatch, onClick])

  return (
    <CardRoot
      $status={match.status}
      $isSelected={isSelected}
      className={className}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`${match.homeTeam?.name ?? 'Chưa xác định'} vs ${match.awayTeam?.name ?? 'Chưa xác định'}`}
    >
      {/* ── Hover shimmer (inherits "hover" variant from parent) ── */}
      <HoverShimmer
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.20 } },
        }}
      />

      {/* ── Top accent stripe ── */}
      <AccentBar $status={match.status} />

      {/* ── Header: round label + status pill ── */}
      <CardHeader>
        {showRound && <RoundBadge>{match.roundDisplay}</RoundBadge>}

        <AnimatePresence mode="wait">
          <StatusPill
            key={match.status}
            $status={match.status}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {match.status === 'live' && <LiveDot />}
            {statusLabel(match.status)}
          </StatusPill>
        </AnimatePresence>
      </CardHeader>

      {/* ── Body: home · center · away ── */}
      <CardBody>
        {/* Home team */}
        <TeamSide $align="left">
          {match.homeTeam ? (
            <>
              <Flag countryCode={match.homeTeam.code} flagUrl={match.homeTeam.flagUrl} size="md" />
              <TeamInfo $align="left">
                <TeamName $isWinner={homeIsWinner}>
                  {match.homeTeam.shortName}
                  {homeIsWinner && <WinnerStar $side="left"> ★</WinnerStar>}
                </TeamName>
                <TeamCode>{match.homeTeam.id}</TeamCode>
              </TeamInfo>
            </>
          ) : (
            <TbdTeam>Chưa xác định</TbdTeam>
          )}
        </TeamSide>

        {/* Center: score for live/completed, kickoff time for upcoming */}
        <ScoreCenter>
          {match.status === 'upcoming' ? (
            <KickoffBlock>
              <KickoffTime>{schedule.time}</KickoffTime>
              <KickoffDate>{schedule.date} · UTC</KickoffDate>
              <VsLabel>vs</VsLabel>
            </KickoffBlock>
          ) : (
            <>
              <ScoreRow>
                <AnimScore value={homeScore} isWinner={homeIsWinner} />
                <ScoreDivider>:</ScoreDivider>
                <AnimScore value={awayScore} isWinner={awayIsWinner} />
              </ScoreRow>

              {hasPens && (
                <ScorePenalty>
                  ({match.score!.homePenalties} – {match.score!.awayPenalties}) pen
                </ScorePenalty>
              )}

              {match.status === 'live' && liveMinute && (
                <MinuteRow>
                  <LiveDot />
                  <MinuteNum>{liveMinute}&apos;</MinuteNum>
                </MinuteRow>
              )}
            </>
          )}
        </ScoreCenter>

        {/* Away team */}
        <TeamSide $align="right">
          {match.awayTeam ? (
            <>
              <TeamInfo $align="right">
                <TeamName $isWinner={awayIsWinner}>
                  {awayIsWinner && <WinnerStar $side="right">★ </WinnerStar>}
                  {match.awayTeam.shortName}
                </TeamName>
                <TeamCode>{match.awayTeam.id}</TeamCode>
              </TeamInfo>
              <Flag countryCode={match.awayTeam.code} flagUrl={match.awayTeam.flagUrl} size="md" />
            </>
          ) : (
            <TbdTeam>Chưa xác định</TbdTeam>
          )}
        </TeamSide>
      </CardBody>

      {/* ── Footer: venue left, time/status right ── */}
      <CardFooter>
        <FooterLeft>
          <FooterIcon>📍</FooterIcon>
          <FooterText title={`${match.venue}, ${match.city}`}>
            {match.venue}
          </FooterText>
        </FooterLeft>

        <FooterRight>
          {match.status === 'live' && liveMinute ? (
            <>
              <FooterIcon>⏱</FooterIcon>
              <LiveMinuteTag>{liveMinute}&apos;</LiveMinuteTag>
            </>
          ) : match.status === 'completed' ? (
            <>
              <FooterIcon>✓</FooterIcon>
              <FooterText>Full Time</FooterText>
            </>
          ) : (
            <>
              <FooterIcon>🕐</FooterIcon>
              <FooterText>{schedule.time} UTC</FooterText>
            </>
          )}
        </FooterRight>
      </CardFooter>
    </CardRoot>
  )
}
