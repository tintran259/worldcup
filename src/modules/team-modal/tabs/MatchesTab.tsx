'use client'

import styled      from 'styled-components'
import { motion }  from 'framer-motion'
import { MOCK_ROUNDS } from '@/lib/constants/mockData'
import type { Match }  from '@/types/domain.types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function flag(code: string): string {
  return code.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

function getResult(match: Match, teamId: string): 'W' | 'D' | 'L' | null {
  if (match.status !== 'completed' || !match.score || !match.winnerId) {
    if (match.status === 'completed' && match.score) {
      const isHome = match.homeTeam?.id === teamId
      const ts = isHome ? match.score.home : match.score.away
      const os = isHome ? match.score.away : match.score.home
      if (ts > os) return 'W'
      if (ts < os) return 'L'
      return 'D'
    }
    return null
  }
  if (match.winnerId === teamId) return 'W'
  return 'L'
}

function getScoreDisplay(match: Match, teamId: string): string {
  if (!match.score) return '— : —'
  const isHome = match.homeTeam?.id === teamId
  return isHome
    ? `${match.score.home} — ${match.score.away}`
    : `${match.score.away} — ${match.score.home}`
}

function getOpponent(match: Match, teamId: string): { name: string; code: string } | null {
  const opp = match.homeTeam?.id === teamId ? match.awayTeam : match.homeTeam
  if (!opp) return null
  return { name: opp.shortName, code: opp.code }
}

// ── Animations ─────────────────────────────────────────────────────────────────

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const } },
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
  margin-bottom: 10px;
`

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const MatchCard = styled(motion.div)<{ $status: Match['status'] }>`
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) =>
    p.$status === 'live' ? 'rgba(239,68,68,0.35)' : p.theme.colors.border.subtle};
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  /* Live accent bar */
  ${(p) => p.$status === 'live' && `
    background: linear-gradient(150deg, rgba(254,226,226,0.60) 0%, white 50%);
    &::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: #ef4444;
    }
  `}
`

const ResultBadge = styled.div<{ $r: 'W' | 'D' | 'L' | null }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 11px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  background: ${(p) =>
    p.$r === 'W' ? 'rgba(16,185,129,0.12)' :
    p.$r === 'L' ? 'rgba(239,68,68,0.12)' :
    p.$r === 'D' ? 'rgba(245,158,11,0.12)' : 'transparent'};
  color: ${(p) =>
    p.$r === 'W' ? '#065f46' :
    p.$r === 'L' ? '#991b1b' :
    p.$r === 'D' ? '#92400e' : '#94a3b8'};
  border: 1px solid ${(p) =>
    p.$r === 'W' ? 'rgba(16,185,129,0.22)' :
    p.$r === 'L' ? 'rgba(239,68,68,0.22)' :
    p.$r === 'D' ? 'rgba(245,158,11,0.22)' : '#e2e8f0'};
`

const MatchMain = styled.div`
  flex: 1;
  min-width: 0;
`

const OpponentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

const OpponentFlag = styled.span`
  font-size: 18px;
  line-height: 1;
`

const OpponentName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
`

const HomeBadge = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: ${(p) => p.theme.colors.bg.elevated};
  color: ${(p) => p.theme.colors.text.muted};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 4px;
  padding: 1px 5px;
`

const MatchMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
`

const MetaText = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.03em;
`

const MetaDot = styled.span`
  width: 3px; height: 3px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.text.disabled};
`

const ScoreBlock = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const ScoreText = styled.div<{ $status: Match['status'] }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.$status === 'live' ? p.theme.colors.accent.live : p.theme.colors.text.primary};
  line-height: 1;
  letter-spacing: 0.02em;
`

const LivePill = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(239,68,68,0.12);
  color: #ef4444;
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 999px;
  padding: 2px 7px;
  margin-top: 4px;
  display: inline-block;
`

const ScheduleBlock = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const ScheduleDate = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1.2;
`

const ScheduleTime = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.accent.primary};
  margin-top: 2px;
`

const RoundTag = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(37,99,235,0.08);
  color: ${(p) => p.theme.colors.accent.primary};
  border: 1px solid rgba(37,99,235,0.16);
  border-radius: 4px;
  padding: 1px 6px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${(p) => p.theme.colors.text.disabled};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.sm};
`

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { teamId: string }

export function MatchesTab({ teamId }: Props) {
  const all = MOCK_ROUNDS.flatMap(r => r.matches)
    .filter(m => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)

  const completed = all.filter(m => m.status === 'completed')
  const live      = all.filter(m => m.status === 'live')
  const upcoming  = all.filter(m => m.status === 'upcoming')

  return (
    <Root variants={stagger} initial="hidden" animate="visible">
      {/* Live */}
      {live.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>🔴 Live Now</SectionTitle>
          <MatchList>
            {live.map((m, i) => {
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
                      <MetaDot />
                      <MetaText>{m.venue}</MetaText>
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
              const opp    = getOpponent(m, teamId)
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
                      <MetaDot />
                      <MetaText>{formatDate(m.scheduledAt)}</MetaText>
                      <MetaDot />
                      <MetaText>{m.city}</MetaText>
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
              const opp    = getOpponent(m, teamId)
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
                      <MetaDot />
                      <MetaText>{m.city}</MetaText>
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
