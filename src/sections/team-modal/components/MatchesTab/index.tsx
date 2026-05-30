'use client'

import { motion } from 'framer-motion'
import type { Match } from '@/types/domain.types'
import {
  Root, SectionTitle, MatchList, MatchCard, ResultBadge,
  MatchMain, OpponentRow, OpponentFlag, OpponentName, HomeBadge,
  MatchMeta, MetaText, MetaDot, ScoreBlock, ScoreText, LivePill,
  ScheduleBlock, ScheduleDate, ScheduleTime, RoundTag, EmptyState,
} from './styles'

// ── Helpers ───────────────────────────────────────────────────────────────────

function flag(code: string): string {
  return code.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  })
}

function getResult(match: Match, teamId: string): 'W' | 'D' | 'L' | null {
  if (match.status !== 'completed' || !match.score) return null
  if (match.winnerId) return match.winnerId === teamId ? 'W' : 'L'
  const isHome = match.homeTeam?.id === teamId
  const ts = isHome ? match.score.home : match.score.away
  const os = isHome ? match.score.away : match.score.home
  if (ts > os) return 'W'
  if (ts < os) return 'L'
  return 'D'
}

function getScoreDisplay(match: Match, teamId: string): string {
  if (!match.score) return '— : —'
  const isHome = match.homeTeam?.id === teamId
  return isHome
    ? `${match.score.home} — ${match.score.away}`
    : `${match.score.away} — ${match.score.home}`
}

function getOpponent(match: Match, teamId: string) {
  const opp = match.homeTeam?.id === teamId ? match.awayTeam : match.homeTeam
  if (!opp) return null
  return { name: opp.shortName, code: opp.code }
}

// ── Animation variants ────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const } },
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface MatchesTabProps {
  teamId:  string
  matches: Match[]
}

export function MatchesTab({ teamId, matches }: MatchesTabProps) {
  // Matches đã được filter theo teamId từ BFF (/api/matches?teamId=)
  // nhưng nếu data có nhiều hơn — vẫn filter để an toàn
  const all = matches.filter((m) => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)

  const completed = all.filter((m) => m.status === 'completed')
  const live      = all.filter((m) => m.status === 'live')
  const upcoming  = all.filter((m) => m.status === 'upcoming')

  return (
    <Root variants={stagger} initial="hidden" animate="visible">

      {/* Live */}
      {live.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>🔴 Live Now</SectionTitle>
          <MatchList>
            {live.map((m) => {
              const opp = getOpponent(m, teamId)
              const isHome = m.homeTeam?.id === teamId
              return (
                <MatchCard key={m.id} $status="live" variants={fadeUp}>
                  <ResultBadge $r={null}>⬤</ResultBadge>
                  <MatchMain>
                    <OpponentRow>
                      {opp && <OpponentFlag>{flag(opp.code)}</OpponentFlag>}
                      <OpponentName>{opp?.name ?? 'TBD'}</OpponentName>
                      <HomeBadge>{isHome ? 'HOME' : 'AWAY'}</HomeBadge>
                    </OpponentRow>
                    <MatchMeta>
                      <RoundTag>{m.roundDisplay}</RoundTag>
                      <MetaDot /><MetaText>{m.venue}</MetaText>
                    </MatchMeta>
                  </MatchMain>
                  <ScoreBlock>
                    <ScoreText $status="live">{getScoreDisplay(m, teamId)}</ScoreText>
                    <LivePill>{m.minute}&apos;</LivePill>
                  </ScoreBlock>
                </MatchCard>
              )
            })}
          </MatchList>
        </motion.div>
      )}

      {/* Completed */}
      <motion.div variants={fadeUp}>
        <SectionTitle>Recent Results</SectionTitle>
        {completed.length === 0 ? (
          <EmptyState>No completed matches yet.</EmptyState>
        ) : (
          <MatchList>
            {[...completed].reverse().map((m) => {
              const opp = getOpponent(m, teamId)
              const result = getResult(m, teamId)
              const isHome = m.homeTeam?.id === teamId
              return (
                <MatchCard key={m.id} $status="completed" variants={fadeUp}>
                  <ResultBadge $r={result}>{result ?? '—'}</ResultBadge>
                  <MatchMain>
                    <OpponentRow>
                      {opp && <OpponentFlag>{flag(opp.code)}</OpponentFlag>}
                      <OpponentName>{opp?.name ?? 'TBD'}</OpponentName>
                      <HomeBadge>{isHome ? 'HOME' : 'AWAY'}</HomeBadge>
                    </OpponentRow>
                    <MatchMeta>
                      <RoundTag>{m.roundDisplay}</RoundTag>
                      <MetaDot /><MetaText>{formatDate(m.scheduledAt)}</MetaText>
                      <MetaDot /><MetaText>{m.city}</MetaText>
                    </MatchMeta>
                  </MatchMain>
                  <ScoreBlock>
                    <ScoreText $status="completed">{getScoreDisplay(m, teamId)}</ScoreText>
                  </ScoreBlock>
                </MatchCard>
              )
            })}
          </MatchList>
        )}
      </motion.div>

      {/* Upcoming */}
      <motion.div variants={fadeUp}>
        <SectionTitle>Upcoming Fixtures</SectionTitle>
        {upcoming.length === 0 ? (
          <EmptyState>No upcoming fixtures scheduled.</EmptyState>
        ) : (
          <MatchList>
            {upcoming.map((m) => {
              const opp = getOpponent(m, teamId)
              const isHome = m.homeTeam?.id === teamId
              return (
                <MatchCard key={m.id} $status="upcoming" variants={fadeUp}>
                  <ResultBadge $r={null}>→</ResultBadge>
                  <MatchMain>
                    <OpponentRow>
                      {opp
                        ? <><OpponentFlag>{flag(opp.code)}</OpponentFlag><OpponentName>{opp.name}</OpponentName></>
                        : <OpponentName style={{ color: '#94a3b8' }}>Chưa xác định</OpponentName>
                      }
                      <HomeBadge>{isHome ? 'HOME' : 'AWAY'}</HomeBadge>
                    </OpponentRow>
                    <MatchMeta>
                      <RoundTag>{m.roundDisplay}</RoundTag>
                      <MetaDot /><MetaText>{m.city}</MetaText>
                    </MatchMeta>
                  </MatchMain>
                  <ScheduleBlock>
                    <ScheduleDate>{formatDate(m.scheduledAt)}</ScheduleDate>
                    <ScheduleTime>{formatTime(m.scheduledAt)} UTC</ScheduleTime>
                  </ScheduleBlock>
                </MatchCard>
              )
            })}
          </MatchList>
        )}
      </motion.div>
    </Root>
  )
}
