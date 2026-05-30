import type { ProviderAdapter } from '../types'
import type { SrMatchSummary, SrTimeline, SrCompetitorProfile, SrTeamStanding, SrPlayer } from './sportradar.types'
import type { Match, MatchEvent, Team } from '@/types/domain.types'
import type { ExtendedTeam, GroupRow, StarPlayer, FormResult } from '@/lib/mock/types'

const STATUS_MAP: Record<string, Match['status']> = {
  not_started: 'upcoming',
  '1st_half': 'live', '2nd_half': 'live', halftime: 'live', overtime: 'live', penalties: 'live',
  ended: 'completed', closed: 'completed',
  postponed: 'postponed', cancelled: 'postponed', interrupted: 'postponed',
}

const ROUND_MAP: Record<string, Match['round']> = {
  'Round of 32': 'round-of-32', 'Round of 16': 'round-of-16',
  'Quarter-finals': 'quarter-final', 'Semi-finals': 'semi-final',
  'Final': 'final', '3rd Place': 'third-place',
}

const POSITION_MAP: Record<string, StarPlayer['position']> = {
  G: 'GK', D: 'DEF', M: 'MID', F: 'FWD',
  goalkeeper: 'GK', defender: 'DEF', midfielder: 'MID', forward: 'FWD', attacker: 'FWD',
}

// ISO3 → ISO2 cho các quốc gia phổ biến ở World Cup
const ISO3_TO_ISO2: Record<string, string> = {
  ARG: 'ar', BRA: 'br', FRA: 'fr', ENG: 'gb', ESP: 'es', GER: 'de', POR: 'pt',
  NED: 'nl', USA: 'us', MAR: 'ma', JPN: 'jp', SEN: 'sn', URU: 'uy', MEX: 'mx',
  ECU: 'ec', KOR: 'kr', AUS: 'au', POL: 'pl',
}
function iso3ToIso2(iso3: string): string {
  return ISO3_TO_ISO2[iso3.toUpperCase()] ?? iso3.slice(0, 2).toLowerCase()
}

function competitorToTeam(c: { id: string; name: string; abbreviation: string; country_code: string }): Team {
  const iso2 = iso3ToIso2(c.country_code)
  return { id: `sr:${c.id}`, name: c.name, shortName: c.abbreviation, code: iso2, flagUrl: `https://flagcdn.com/w40/${iso2}.png` }
}

export const sportradarAdapter: ProviderAdapter = {
  provider: 'sportradar',

  toMatch(raw: unknown): Match {
    const s = raw as SrMatchSummary
    const se = s.sport_event, st = s.sport_event_status
    const home = se.competitors?.find(c => c.qualifier === 'home')
    const away = se.competitors?.find(c => c.qualifier === 'away')
    return {
      id: `sr:${se.id}`,
      round: ROUND_MAP[se.sport_event_context?.stage?.name ?? ''] ?? 'round-of-32',
      roundDisplay: se.sport_event_context?.stage?.name ?? '',
      matchNumber: parseInt(se.id.split(':').pop() ?? '0'),
      homeTeam: home ? competitorToTeam(home) : null,
      awayTeam: away ? competitorToTeam(away) : null,
      score: { home: st.home_score ?? 0, away: st.away_score ?? 0, homePenalties: st.penalty_score?.home_score, awayPenalties: st.penalty_score?.away_score },
      status: STATUS_MAP[st.match_status] ?? 'upcoming',
      venue: se.venue?.name ?? '', city: se.venue?.city_name ?? '',
      scheduledAt: se.start_time,
      winnerId: st.winner_id ? `sr:${st.winner_id}` : undefined,
    }
  },

  toMatchEvent(raw: unknown): MatchEvent {
    const t = raw as SrTimeline
    const typeMap: Record<string, MatchEvent['type']> = {
      score_change: 'goal', yellow_card: 'yellow-card', red_card: 'red-card',
      yellow_red_card: 'red-card', substitution: 'substitution', penalty_awarded: 'var',
    }
    const scorer = t.players?.find(p => p.type === 'scorer')
    const assist = t.players?.find(p => p.type === 'assist')
    return {
      id: `sr:tl:${t.id}`, type: typeMap[t.type] ?? 'goal',
      minute: t.time, addedTime: t.added_time, teamId: '',
      playerId: scorer?.id ?? '', playerName: scorer?.name ?? '',
      assistPlayerId: assist?.id, assistPlayerName: assist?.name, description: t.description,
    }
  },

  toTeam(raw: unknown): Team {
    return competitorToTeam(raw as SrCompetitorProfile['competitor'])
  },

  toExtendedTeam(raw: unknown): ExtendedTeam {
    return {
      ...sportradarAdapter.toTeam(raw) as ExtendedTeam,
      confederation: 'UEFA', fifaRank: 0, group: '', manager: '', captain: '',
      homeColor: '#fff', awayColor: '#000', qualified: true, pot: 1,
    }
  },

  toGroupRow(raw: unknown): GroupRow {
    const s = raw as SrTeamStanding
    const formMap: Record<string, FormResult> = { win: 'W', draw: 'D', loss: 'L', lose: 'L' }
    return {
      team: sportradarAdapter.toExtendedTeam({ id: s.team.id, name: s.team.name, abbreviation: s.team.abbreviation, country_code: s.team.country_code, country: '', gender: 'male' }),
      position: s.rank, played: s.played, won: s.won, drawn: s.draw, lost: s.lost,
      goalsFor: s.goals_scored, goalsAgainst: s.goals_received, goalDifference: s.goal_diff,
      points: s.points, form: (s.form ?? []).map(f => formMap[f] ?? 'D'),
      advanceStatus: s.current_outcome?.toLowerCase().includes('advanc') ? 'qualified'
                   : s.current_outcome?.toLowerCase().includes('eliminat') ? 'eliminated' : 'pending',
    }
  },

  toPlayer(raw: unknown): StarPlayer {
    const p = raw as SrPlayer
    const age = p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 0
    return {
      id: `sr:p:${p.id}`, name: p.name, teamId: '',
      position: POSITION_MAP[p.position ?? p.type ?? ''] ?? 'MID',
      shirtNumber: p.jersey_number ?? 0, age, club: '', clubLeague: '', isCaptain: false,
      tournamentGoals: 0, tournamentAssists: 0, tournamentYellowCards: 0, tournamentRedCards: 0,
      matchesPlayed: 0, minutesPlayed: 0, rating: 0, marketValue: '',
      goals: 0, assists: 0, yellowCards: 0, redCards: 0,
    }
  },
}
