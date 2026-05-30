/**
 * API-Football Adapter
 *
 * Chuyển đổi raw response từ api-football → domain types.
 * Không có business logic — chỉ là "phiên dịch" data format.
 */

import type { ProviderAdapter } from '../types'
import type { AfFixture, AfTeam, AfEvent, AfStanding, AfPlayer } from './api-football.types'
import type { Match, MatchEvent, Team } from '@/types/domain.types'
import type { ExtendedTeam, GroupRow, StarPlayer, FormResult } from '@/lib/mock/types'

// ── Bảng ánh xạ status ────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, Match['status']> = {
  TBD: 'upcoming', NS: 'upcoming',
  '1H': 'live', '2H': 'live', HT: 'live', ET: 'live', BT: 'live', P: 'live', LIVE: 'live',
  FT: 'completed', AET: 'completed', PEN: 'completed',
  PST: 'postponed', CANC: 'postponed', ABD: 'postponed',
}

const ROUND_MAP: Record<string, Match['round']> = {
  'Round of 32': 'round-of-32',
  'Round of 16': 'round-of-16',
  'Quarter-finals': 'quarter-final',
  'Semi-finals': 'semi-final',
  'Final': 'final',
  '3rd Place Final': 'third-place',
}

const POSITION_MAP: Record<string, StarPlayer['position']> = {
  Goalkeeper: 'GK', Defender: 'DEF', Midfielder: 'MID', Attacker: 'FWD',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toTeamRef(ref: AfFixture['teams']['home']): Team {
  const code = ref.name.slice(0, 2).toLowerCase()
  return {
    id: `af:${ref.id}`,
    name: ref.name,
    shortName: ref.name.slice(0, 3).toUpperCase(),
    code,
    flagUrl: `https://flagcdn.com/w40/${code}.png`,
  }
}

// ── Adapter (plain object) ────────────────────────────────────────────────────

export const apiFootballAdapter: ProviderAdapter = {
  provider: 'api-football',

  toMatch(raw: unknown): Match {
    const f = raw as AfFixture
    const homeId = String(f.teams.home.id)
    const awayId = String(f.teams.away.id)

    return {
      id: `af:${f.fixture.id}`,
      round: ROUND_MAP[f.league.round] ?? 'round-of-32',
      roundDisplay: f.league.round,
      matchNumber: f.fixture.id,
      homeTeam: toTeamRef(f.teams.home),
      awayTeam: toTeamRef(f.teams.away),
      score: f.goals.home !== null && f.goals.away !== null
        ? {
          home: f.goals.home,
          away: f.goals.away,
          homeExtraTime: f.score.extratime.home ?? undefined,
          awayExtraTime: f.score.extratime.away ?? undefined,
          homePenalties: f.score.penalty.home ?? undefined,
          awayPenalties: f.score.penalty.away ?? undefined,
        }
        : null,
      status: STATUS_MAP[f.fixture.status.short] ?? 'upcoming',
      minute: f.fixture.status.elapsed ?? undefined,
      venue: f.fixture.venue.name,
      city: f.fixture.venue.city,
      scheduledAt: f.fixture.date,
      winnerId: f.teams.home.winner === true ? `af:${homeId}`
        : f.teams.away.winner === true ? `af:${awayId}`
          : undefined,
    }
  },

  toMatchEvent(raw: unknown): MatchEvent {
    const e = raw as AfEvent
    const typeMap: Record<string, MatchEvent['type']> = {
      Goal: 'goal',
      Card: e.detail.toLowerCase().includes('red') ? 'red-card' : 'yellow-card',
      subst: 'substitution',
      Var: 'var',
    }
    return {
      id: `af:event:${e.team.id}:${e.time.elapsed}:${e.player.id}`,
      type: typeMap[e.type] ?? 'goal',
      minute: e.time.elapsed,
      addedTime: e.time.extra ?? undefined,
      teamId: `af:${e.team.id}`,
      playerId: `af:p:${e.player.id}`,
      playerName: e.player.name,
      assistPlayerId: e.assist.id ? `af:p:${e.assist.id}` : undefined,
      assistPlayerName: e.assist.name ?? undefined,
      description: e.comments ?? undefined,
    }
  },

  toTeam(raw: unknown): Team {
    const t = raw as AfTeam
    const code = t.team.code?.toLowerCase() ?? t.team.country.slice(0, 2).toLowerCase()
    return {
      id: `af:${t.team.id}`,
      name: t.team.name,
      shortName: t.team.code ?? t.team.name.slice(0, 3).toUpperCase(),
      code,
      flagUrl: `https://flagcdn.com/w40/${code}.png`,
    }
  },

  toExtendedTeam(raw: unknown): ExtendedTeam {
    const base = apiFootballAdapter.toTeam(raw) as ExtendedTeam
    return {
      ...base,
      confederation: 'UEFA',
      fifaRank: 0,
      group: '',
      manager: '',
      captain: '',
      homeColor: '#ffffff',
      awayColor: '#000000',
      qualified: true,
      pot: 1,
    }
  },

  toGroupRow(raw: unknown): GroupRow {
    const s = raw as AfStanding
    const form = (s.form ?? '').split('').filter(c => 'WDL'.includes(c)) as FormResult[]
    return {
      team: apiFootballAdapter.toExtendedTeam({ team: s.team, venue: {} }),
      position: s.rank,
      played: s.all.played,
      won: s.all.win,
      drawn: s.all.draw,
      lost: s.all.lose,
      goalsFor: s.all.goals.for,
      goalsAgainst: s.all.goals.against,
      goalDifference: s.goalsDiff,
      points: s.points,
      form,
      advanceStatus: s.description?.toLowerCase().includes('qualify') ? 'qualified'
        : s.description?.toLowerCase().includes('eliminat') ? 'eliminated'
          : 'pending',
    }
  },

  toPlayer(raw: unknown): StarPlayer {
    const p = raw as AfPlayer
    const st = p.statistics[0]
    return {
      id: `af:p:${p.player.id}`,
      name: p.player.name,
      teamId: '',
      position: POSITION_MAP[st?.games.position ?? ''] ?? 'MID',
      shirtNumber: st?.games.number ?? 0,
      age: p.player.age,
      club: '',
      clubLeague: '',
      isCaptain: false,
      tournamentGoals: st?.goals.total ?? 0,
      tournamentAssists: st?.goals.assists ?? 0,
      tournamentYellowCards: st?.cards.yellow ?? 0,
      tournamentRedCards: st?.cards.red ?? 0,
      matchesPlayed: st?.games.appearences ?? 0,
      minutesPlayed: st?.games.minutes ?? 0,
      rating: parseFloat(st?.games.rating ?? '0') || 0,
      marketValue: '',
      goals: st?.goals.total ?? 0,
      assists: st?.goals.assists ?? 0,
      yellowCards: st?.cards.yellow ?? 0,
      redCards: st?.cards.red ?? 0,
    }
  },
}
