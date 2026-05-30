import type { ProviderAdapter } from '../types'
import type { SmFixture, SmTeam, SmEvent, SmStanding, SmPlayer, SmParticipant } from './sportmonks.types'
import type { Match, MatchEvent, Team } from '@/types/domain.types'
import type { ExtendedTeam, GroupRow, StarPlayer, FormResult } from '@/lib/mock/types'

const STATUS_MAP: Record<string, Match['status']> = {
  NOT_STARTED: 'upcoming',
  INPLAY_1ST_HALF: 'live', INPLAY_2ND_HALF: 'live',
  INPLAY_HT: 'live', INPLAY_ET: 'live', INPLAY_PENALTIES: 'live',
  FINISHED: 'completed', FINISHED_AET: 'completed', FINISHED_PEN: 'completed',
  POSTPONED: 'postponed', CANCELLED: 'postponed',
}

const ROUND_MAP: Record<string, Match['round']> = {
  'Round of 32': 'round-of-32', 'Round of 16': 'round-of-16',
  'Quarter-finals': 'quarter-final', 'Semi-finals': 'semi-final',
  'Final': 'final', '3rd Place': 'third-place',
}

const POSITION_MAP: Record<string, StarPlayer['position']> = {
  G: 'GK', D: 'DEF', M: 'MID', F: 'FWD',
}

function participantToTeam(p: SmParticipant): Team {
  const iso = (p.short_code ?? '').toLowerCase().slice(0, 2)
  return { id: `sm:${p.id}`, name: p.name, shortName: p.short_code, code: iso, flagUrl: `https://flagcdn.com/w40/${iso}.png` }
}

export const sportMonksAdapter: ProviderAdapter = {
  provider: 'sportmonks',

  toMatch(raw: unknown): Match {
    const f = raw as SmFixture
    const home = f.participants?.find(p => p.meta?.location === 'home')
    const away = f.participants?.find(p => p.meta?.location === 'away')
    const status = STATUS_MAP[f.state?.developer_name ?? 'NOT_STARTED'] ?? 'upcoming'
    return {
      id: `sm:${f.id}`,
      round: ROUND_MAP[f.round?.name ?? ''] ?? 'round-of-32',
      roundDisplay: f.round?.name ?? '',
      matchNumber: f.id,
      homeTeam: home ? participantToTeam(home as SmParticipant) : null,
      awayTeam: away ? participantToTeam(away as SmParticipant) : null,
      score: f.scores?.find(s => s.description === 'CURRENT')
        ? {
            home: f.scores?.find(s => s.score?.participant === 'home' && s.description === 'CURRENT')?.score.goals ?? 0,
            away: f.scores?.find(s => s.score?.participant === 'away' && s.description === 'CURRENT')?.score.goals ?? 0,
          }
        : null,
      status,
      venue: f.venue?.name ?? '', city: f.venue?.city_name ?? '',
      scheduledAt: f.starting_at,
      winnerId: home?.meta?.winner === true ? `sm:${home.id}`
              : away?.meta?.winner === true ? `sm:${away.id}` : undefined,
    }
  },

  toMatchEvent(raw: unknown): MatchEvent {
    const e = raw as SmEvent
    const typeMap: Record<string, MatchEvent['type']> = {
      GOAL: 'goal', YELLOWCARD: 'yellow-card', REDCARD: 'red-card', SUBST: 'substitution', VAR: 'var',
    }
    return {
      id: `sm:ev:${e.id}`,
      type: typeMap[(e.type?.code ?? '').toUpperCase()] ?? 'goal',
      minute: e.minute, addedTime: e.extra_minute ?? undefined,
      teamId: `sm:${e.participant_id}`,
      playerId: e.player_id ? `sm:p:${e.player_id}` : '',
      playerName: e.player_name ?? '',
      assistPlayerId: e.related_player_id ? `sm:p:${e.related_player_id}` : undefined,
      assistPlayerName: e.related_player_name ?? undefined,
    }
  },

  toTeam(raw: unknown): Team {
    const t = raw as SmTeam
    const iso = t.country?.iso2?.toLowerCase() ?? t.short_code?.toLowerCase()?.slice(0, 2) ?? 'xx'
    return { id: `sm:${t.id}`, name: t.name, shortName: t.short_code, code: iso, flagUrl: `https://flagcdn.com/w40/${iso}.png` }
  },

  toExtendedTeam(raw: unknown): ExtendedTeam {
    return {
      ...sportMonksAdapter.toTeam(raw) as ExtendedTeam,
      confederation: 'UEFA', fifaRank: 0, group: '', manager: '', captain: '',
      homeColor: '#fff', awayColor: '#000', qualified: true, pot: 1,
    }
  },

  toGroupRow(raw: unknown): GroupRow {
    const s = raw as SmStanding
    const d = (code: string) => s.details?.find(x => x.type?.code === code)?.value ?? 0
    const won = d('WON'), draw = d('DRAW'), lost = d('LOST'), gf = d('GF'), ga = d('GA')
    const form = (s.form ?? '').split('').filter(c => 'WDL'.includes(c)) as FormResult[]
    return {
      team: sportMonksAdapter.toExtendedTeam(s.participant ?? {}),
      position: s.position, played: won + draw + lost,
      won, drawn: draw, lost, goalsFor: gf, goalsAgainst: ga, goalDifference: gf - ga,
      points: s.points, form,
      advanceStatus: s.result?.toLowerCase().includes('advanc') ? 'qualified'
                   : s.result?.toLowerCase().includes('relegat') ? 'eliminated' : 'pending',
    }
  },

  toPlayer(raw: unknown): StarPlayer {
    const p = raw as SmPlayer
    const pos = POSITION_MAP[p.position?.code?.[0] ?? ''] ?? 'MID'
    const stats = Object.fromEntries((p.statistics?.[0]?.details ?? []).map(d => [d.type?.code, d.value.total]))
    const age = p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 0
    const goals = stats['goals'] ?? 0, assists = stats['assists'] ?? 0
    const yellows = stats['yellow_cards'] ?? 0, reds = stats['red_cards'] ?? 0
    return {
      id: `sm:p:${p.id}`, name: p.display_name, teamId: `sm:${p.team_id}`,
      position: pos, shirtNumber: p.jersey_number ?? 0, age, club: '', clubLeague: '', isCaptain: false,
      tournamentGoals: goals, tournamentAssists: assists, tournamentYellowCards: yellows, tournamentRedCards: reds,
      matchesPlayed: stats['appearances'] ?? 0, minutesPlayed: stats['minutes_played'] ?? 0,
      rating: 0, marketValue: '', goals, assists, yellowCards: yellows, redCards: reds,
    }
  },
}
