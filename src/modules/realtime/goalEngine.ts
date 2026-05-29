/**
 * GoalEngine
 *
 * Generates realistic football events (goals, cards, subs) for a given
 * match-minute using a simplified Poisson process.
 *
 * Average rates per minute (based on real Premier League / WC data):
 *   Goals:        2.75 per 90 min  → p = 0.0306 / min
 *   Yellow cards: 3.80 per 90 min  → p = 0.0422 / min
 *   Red cards:    0.16 per 90 min  → p = 0.0018 / min
 *   Substitutions appear in windows: 45+, 60+, 75+
 */

import type { WSMatchEvent } from '@/types/events.types'
import { getTeamPlayers } from '@/lib/mock'

// ── Probability constants ─────────────────────────────────────────────────────

const P_GOAL_PER_MIN         = 0.031
const P_YELLOW_PER_MIN       = 0.042
const P_RED_PER_MIN          = 0.0018

/** Minutes where subs are likely */
const SUB_WINDOWS = [46, 61, 71, 76, 85]

// ── Helpers ───────────────────────────────────────────────────────────────────

let _eventId = 1_000
function nextId(): string { return `sim-${_eventId++}` }

function roll(prob: number): boolean { return Math.random() < prob }

function pickPlayer(
  teamId: string,
  positions: Array<'GK' | 'DEF' | 'MID' | 'FWD'>,
): { id: string; name: string } {
  const all = getTeamPlayers(teamId)
  const pool = all.filter((p) => positions.includes(p.position))
  const list = pool.length > 0 ? pool : all
  const p = list[Math.floor(Math.random() * list.length)]
  return p ? { id: p.id, name: p.name } : { id: 'unknown', name: 'Unknown' }
}

// ── Main generator ────────────────────────────────────────────────────────────

export interface MatchState {
  matchId:      string
  homeTeamId:   string
  awayTeamId:   string
  homeTeamName: string
  awayTeamName: string
  homeTeamCode: string
  awayTeamCode: string
  homeScore:    number
  awayScore:    number
}

export interface MinuteResult {
  events:    WSMatchEvent[]
  newHome:   number
  newAway:   number
}

/**
 * Given a match state + current minute, returns any events that happened
 * this minute and the updated score.
 */
export function processMinute(state: MatchState, minute: number): MinuteResult {
  const events: WSMatchEvent[] = []
  let { homeScore, awayScore } = state

  // ── Always emit SCORE_UPDATE ────────────────────────────────────────────────
  events.push({
    type:      'SCORE_UPDATE',
    matchId:   state.matchId,
    homeScore,
    awayScore,
    minute,
  })

  // ── Goal check ──────────────────────────────────────────────────────────────
  if (roll(P_GOAL_PER_MIN)) {
    // Home team scores slightly more often when winning (momentum factor)
    const homeBias = homeScore > awayScore ? 0.52 : 0.48
    const isHome   = Math.random() < homeBias
    const teamId   = isHome ? state.homeTeamId : state.awayTeamId
    const teamCode = isHome ? state.homeTeamCode : state.awayTeamCode
    const scorer   = pickPlayer(teamId, ['FWD', 'MID', 'FWD'])

    if (isHome) homeScore++
    else        awayScore++

    events.push({
      type:         'GOAL',
      matchId:      state.matchId,
      teamId,
      teamCode,
      playerId:     scorer.id,
      playerName:   scorer.name,
      minute,
      homeScore,
      awayScore,
      homeTeamName: state.homeTeamName,
      awayTeamName: state.awayTeamName,
    })

    // Update the SCORE_UPDATE emitted earlier with fresh score
    const scoreEvt = events[0] as Extract<WSMatchEvent, { type: 'SCORE_UPDATE' }>
    scoreEvt.homeScore = homeScore
    scoreEvt.awayScore = awayScore
  }

  // ── Yellow card ─────────────────────────────────────────────────────────────
  if (roll(P_YELLOW_PER_MIN)) {
    const isHome   = Math.random() < 0.5
    const teamId   = isHome ? state.homeTeamId : state.awayTeamId
    const teamCode = isHome ? state.homeTeamCode : state.awayTeamCode
    const player   = pickPlayer(teamId, ['DEF', 'MID', 'FWD', 'DEF'])

    events.push({
      type:       'CARD',
      matchId:    state.matchId,
      teamId,
      teamCode,
      playerId:   player.id,
      playerName: player.name,
      cardType:   'yellow',
      minute,
    })
  }

  // ── Red card (rare) ──────────────────────────────────────────────────────────
  else if (roll(P_RED_PER_MIN)) {
    const isHome   = Math.random() < 0.5
    const teamId   = isHome ? state.homeTeamId : state.awayTeamId
    const teamCode = isHome ? state.homeTeamCode : state.awayTeamCode
    const player   = pickPlayer(teamId, ['DEF', 'MID'])

    events.push({
      type:       'CARD',
      matchId:    state.matchId,
      teamId,
      teamCode,
      playerId:   player.id,
      playerName: player.name,
      cardType:   'red',
      minute,
    })
  }

  // ── Substitution ─────────────────────────────────────────────────────────────
  if (SUB_WINDOWS.includes(minute) && Math.random() < 0.55) {
    const isHome  = Math.random() < 0.5
    const teamId  = isHome ? state.homeTeamId : state.awayTeamId
    const playerOut = pickPlayer(teamId, ['FWD', 'MID'])
    const playerIn  = pickPlayer(teamId, ['FWD', 'MID'])

    if (playerOut.id !== playerIn.id) {
      events.push({
        type:          'SUBSTITUTION',
        matchId:       state.matchId,
        teamId,
        playerInName:  playerIn.name,
        playerOutName: playerOut.name,
        minute,
      })
    }
  }

  return { events, newHome: homeScore, newAway: awayScore }
}
