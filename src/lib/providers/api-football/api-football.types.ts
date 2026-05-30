/**
 * API-Football raw response types.
 * These types are PRIVATE to this provider folder.
 * Nothing outside /api-football/ may import them.
 */

export interface AfResponse<T> {
  get: string
  parameters: Record<string, string>
  errors: unknown[]
  results: number
  paging: { current: number; total: number }
  response: T[]
}

export interface AfFixture {
  fixture: {
    id: number
    referee: string | null
    timezone: string
    date: string         // ISO 8601
    timestamp: number
    status: {
      long: string        // "Match Finished" | "Not Started" | etc.
      short: string        // "FT" | "NS" | "1H" | "2H" | "HT" | "ET" | "PEN"
      elapsed: number | null // minutes elapsed
    }
    venue: { id: number; name: string; city: string }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    round: string          // "Round of 32" etc.
    season: number
  }
  teams: {
    home: AfTeamRef
    away: AfTeamRef
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
    extratime: { home: number | null; away: number | null }
    penalty: { home: number | null; away: number | null }
  }
}

export interface AfTeamRef {
  id: number
  name: string
  logo: string
  winner: boolean | null
}

export interface AfTeam {
  team: {
    id: number
    name: string
    code: string
    country: string
    founded: number
    national: boolean
    logo: string
  }
  venue: {
    id: number
    name: string
    address: string
    city: string
    capacity: number
    surface: string
    image: string
  }
}

export interface AfEvent {
  time: { elapsed: number; extra: number | null }
  team: { id: number; name: string; logo: string }
  player: { id: number; name: string }
  assist: { id: number | null; name: string | null }
  type: string   // "Goal" | "Card" | "subst" | "Var"
  detail: string   // "Normal Goal" | "Yellow Card" | "Red Card" | etc.
  comments: string | null
}

export interface AfStanding {
  rank: number
  team: AfTeamRef
  points: number
  goalsDiff: number
  group: string
  form: string   // "WWDLL"
  status: string
  description: string | null
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: { for: number; against: number }
  }
}

export interface AfPlayer {
  player: {
    id: number
    name: string
    firstname: string
    lastname: string
    age: number
    nationality: string
    photo: string
  }
  statistics: Array<{
    games: {
      appearences: number
      lineups: number
      minutes: number
      number: number | null
      position: string   // "Goalkeeper" | "Defender" | etc.
      rating: string | null
    }
    goals: { total: number | null; assists: number | null }
    cards: { yellow: number; yellowred: number; red: number }
  }>
}
