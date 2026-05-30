/**
 * Goal engine — sinh sự kiện bóng đá theo xác suất Poisson.
 *
 * Tỉ lệ thực tế (Premier League / World Cup data):
 *   Bàn thắng:   2.75 / 90 phút → p ≈ 0.031 / phút
 *   Thẻ vàng:    3.80 / 90 phút → p ≈ 0.042 / phút
 *   Thẻ đỏ:      0.16 / 90 phút → p ≈ 0.002 / phút
 *   Thay người:  xuất hiện ở các cửa sổ 45+, 60+, 75+
 */

import type { WSMatchEvent } from '@/types/events.types'
import { getTeamPlayers } from '@/lib/mock'

const P_GOAL = 0.031
const P_YELLOW = 0.042
const P_RED = 0.0018

/** Các phút thường có thay người */
const SUB_WINDOWS = [46, 61, 71, 76, 85]

let _eventId = 1_000
function nextId() { return `sim-${_eventId++}` }
function roll(prob: number) { return Math.random() < prob }

function pickPlayer(teamId: string, positions: Array<'GK' | 'DEF' | 'MID' | 'FWD'>) {
  const all = getTeamPlayers(teamId)
  const pool = all.filter(p => positions.includes(p.position))
  const list = pool.length > 0 ? pool : all
  const p = list[Math.floor(Math.random() * list.length)]
  return p ? { id: p.id, name: p.name } : { id: 'unknown', name: 'Unknown' }
}

export interface MatchState {
  matchId: string
  homeTeamId: string
  awayTeamId: string
  homeTeamName: string
  awayTeamName: string
  homeTeamCode: string
  awayTeamCode: string
  homeScore: number
  awayScore: number
}

export interface MinuteResult {
  events: WSMatchEvent[]
  newHome: number
  newAway: number
}

/**
 * Xử lý 1 phút thi đấu — trả về các sự kiện xảy ra và tỉ số mới.
 */
export function processMinute(state: MatchState, minute: number): MinuteResult {
  const events: WSMatchEvent[] = []
  let { homeScore, awayScore } = state

  // Luôn emit SCORE_UPDATE mỗi phút
  events.push({ type: 'SCORE_UPDATE', matchId: state.matchId, homeScore, awayScore, minute })

  // ── Bàn thắng ─────────────────────────────────────────────────────────────
  if (roll(P_GOAL)) {
    const homeBias = homeScore > awayScore ? 0.52 : 0.48
    const isHome = Math.random() < homeBias
    const teamId = isHome ? state.homeTeamId : state.awayTeamId
    const teamCode = isHome ? state.homeTeamCode : state.awayTeamCode
    const scorer = pickPlayer(teamId, ['FWD', 'MID', 'FWD'])

    if (isHome) homeScore++
    else awayScore++

    events.push({
      type: 'GOAL', matchId: state.matchId,
      teamId, teamCode,
      playerId: scorer.id, playerName: scorer.name,
      minute, homeScore, awayScore,
      homeTeamName: state.homeTeamName, awayTeamName: state.awayTeamName,
    })

    // Cập nhật SCORE_UPDATE với tỉ số mới
    const scoreEvt = events[0] as Extract<WSMatchEvent, { type: 'SCORE_UPDATE' }>
    scoreEvt.homeScore = homeScore
    scoreEvt.awayScore = awayScore
  }

  // ── Thẻ vàng ──────────────────────────────────────────────────────────────
  if (roll(P_YELLOW)) {
    const isHome = Math.random() < 0.5
    const teamId = isHome ? state.homeTeamId : state.awayTeamId
    const teamCode = isHome ? state.homeTeamCode : state.awayTeamCode
    const player = pickPlayer(teamId, ['DEF', 'MID', 'FWD', 'DEF'])
    events.push({ type: 'CARD', matchId: state.matchId, teamId, teamCode, playerId: player.id, playerName: player.name, cardType: 'yellow', minute })
  }
  // ── Thẻ đỏ (hiếm) ─────────────────────────────────────────────────────────
  else if (roll(P_RED)) {
    const isHome = Math.random() < 0.5
    const teamId = isHome ? state.homeTeamId : state.awayTeamId
    const teamCode = isHome ? state.homeTeamCode : state.awayTeamCode
    const player = pickPlayer(teamId, ['DEF', 'MID'])
    events.push({ type: 'CARD', matchId: state.matchId, teamId, teamCode, playerId: player.id, playerName: player.name, cardType: 'red', minute })
  }

  // ── Thay người ────────────────────────────────────────────────────────────
  if (SUB_WINDOWS.includes(minute) && Math.random() < 0.55) {
    const isHome = Math.random() < 0.5
    const teamId = isHome ? state.homeTeamId : state.awayTeamId
    const playerOut = pickPlayer(teamId, ['FWD', 'MID'])
    const playerIn = pickPlayer(teamId, ['FWD', 'MID'])
    if (playerOut.id !== playerIn.id) {
      events.push({ type: 'SUBSTITUTION', matchId: state.matchId, teamId, playerInName: playerIn.name, playerOutName: playerOut.name, minute })
    }
  }

  return { events, newHome: homeScore, newAway: awayScore }
}
