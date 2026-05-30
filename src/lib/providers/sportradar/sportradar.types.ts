/**
 * Sportradar Soccer v4 raw response types.
 * Private to /sportradar/ folder.
 */

export interface SrSport {
  id: string   // "sr:sport:1"
  name: string
}

export interface SrTournament {
  id: string   // "sr:tournament:1"
  name: string
  sport: SrSport
  category: { id: string; name: string; country_code?: string }
}

export interface SrSeason {
  id: string   // "sr:season:106479"
  name: string
  start_date: string
  end_date: string
  year: string
  tournament: SrTournament
}

export interface SrCompetitor {
  id: string   // "sr:competitor:1234"
  name: string
  country: string
  country_code: string   // ISO3
  abbreviation: string
  gender: string
  qualifier: 'home' | 'away'
}

export interface SrSportEvent {
  id: string   // "sr:sport_event:12345"
  start_time: string   // ISO 8601
  start_time_confirmed: boolean
  sport_event_context: {
    sport: SrSport
    category: { id: string; name: string; country_code?: string }
    competition: SrTournament
    season: SrSeason
    stage: {
      order: number
      type: string   // "cup_round" | "group" etc.
      phase: string
      name: string   // "Round of 32"
    }
    round: { number: number; name?: string }
    groups: Array<{ id: string; name: string }>
  }
  competitors: SrCompetitor[]
  venue: {
    id: string
    name: string
    city_name: string
    country_name: string
    capacity: number
    country_code: string
  }
}

export interface SrSportEventStatus {
  status: string   // "not_started" | "live" | "closed" | "postponed"
  match_status: string   // "not_started" | "1st_half" | "2nd_half" | "halftime" | "ended" etc.
  home_score: number
  away_score: number
  winner_id?: string
  period_scores: Array<{
    home_score: number
    away_score: number
    type: string   // "regular_period" | "overtime" | "penalties"
    number: number
  }>
  clock?: { played: string; stoppage_time?: string }
  aggregate_home_score?: number
  aggregate_away_score?: number
  penalty_score?: { home_score: number; away_score: number }
}

export interface SrTimeline {
  id: number
  type: string   // "score_change" | "yellow_card" | "red_card" | "substitution" | "penalty_awarded"
  time: number   // minutes
  added_time?: number
  match_time?: string
  match_clock?: string
  period?: string
  home_score?: number
  away_score?: number
  competitor?: 'home' | 'away'
  players?: Array<{
    id: string
    name: string
    type: 'scorer' | 'assist' | 'substituted_in' | 'substituted_out'
  }>
  description?: string
}

export interface SrMatchSummary {
  sport_event: SrSportEvent
  sport_event_status: SrSportEventStatus
  statistics?: {
    totals: {
      competitors: Array<{
        id: string
        name: string
        qualifier: 'home' | 'away'
        statistics: Record<string, number>
      }>
    }
  }
  timeline?: SrTimeline[]
}

export interface SrCompetitorProfile {
  competitor: {
    id: string
    name: string
    country: string
    country_code: string
    abbreviation: string
    gender: string
    manager?: {
      id: string
      name: string
      nationality: string
      date_of_birth: string
    }
    venue?: {
      id: string
      name: string
      city_name: string
      capacity: number
    }
    players: SrPlayer[]
  }
}

export interface SrPlayer {
  id: string   // "sr:player:12345"
  name: string
  date_of_birth: string
  nationality: string
  country_code: string
  height?: number
  weight?: number
  jersey_number?: number
  position?: string   // "G" | "D" | "M" | "F"
  type?: string   // "goalkeeper" | "defender" | etc.
}

export interface SrStanding {
  type: string
  groups: Array<{
    id: string
    name: string
    tournament_round?: { name: string }
    standings: SrTeamStanding[]
  }>
}

export interface SrTeamStanding {
  rank: number
  played: number
  won: number
  lost: number
  draw: number
  points: number
  goals_scored: number
  goals_received: number
  goal_diff: number
  current_outcome?: string
  team: {
    id: string
    name: string
    abbreviation: string
    country_code: string
  }
  form?: string[]   // ["win","win","draw","loss","win"]
}

// ── Live event list response ───────────────────────────────────────────────────

export interface SrLiveSchedule {
  generated_at: string
  sport_events: SrMatchSummary[]
}

export interface SrSchedule {
  generated_at: string
  sport_events: SrSportEvent[]
}
