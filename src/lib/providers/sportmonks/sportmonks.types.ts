/**
 * SportMonks v3 raw response types.
 * Private to /sportmonks/ folder.
 */

export interface SmResponse<T> {
  data:        T
  subscription: unknown[]
  rate_limit:  { resets_in_seconds: number; remaining: number; requested_entity: string }
  timezone:    string
}

export interface SmFixture {
  id:             number
  sport_id:       number
  league_id:      number
  season_id:      number
  stage_id:       number
  round_id:       number | null
  state_id:       number
  venue_id:       number | null
  name:           string
  starting_at:    string    // ISO 8601
  result_info:    string | null
  leg:            string
  details:        string | null
  length:         number
  placeholder:    boolean
  has_odds:       boolean
  starting_at_timestamp: number
  // Relationships (included via ?include=)
  state?:         SmState
  participants?:  SmParticipant[]
  scores?:        SmScore[]
  venue?:         SmVenue
  round?:         SmRound
  events?:        SmEvent[]
}

export interface SmState {
  id:          number
  state:       string    // "NS" | "LIVE" | "HT" | "FT" | etc.
  name:        string
  short_name:  string
  developer_name: string
}

export interface SmParticipant {
  id:             number
  sport_id:       number
  country_id:     number
  venue_id:       number | null
  gender:         string
  name:           string
  short_code:     string
  image_path:     string
  founded:        number | null
  type:           string   // "home" | "away"
  placeholder:    boolean
  last_played_at: string | null
  meta: {
    location:  'home' | 'away'
    winner:    boolean | null
    position:  number
  }
}

export interface SmScore {
  id:          number
  fixture_id:  number
  type_id:     number
  participant_id: number
  score:       { goals: number; participant: 'home' | 'away' }
  description: string   // "CURRENT" | "HT" | "FT" | "ET" | "PEN"
}

export interface SmVenue {
  id:       number
  name:     string
  city_name: string
  capacity: number
  image_path: string
}

export interface SmRound {
  id:   number
  name: string
}

export interface SmEvent {
  id:           number
  fixture_id:   number
  period_id:    number
  participant_id: number
  type_id:      number
  section:      string
  player_id:    number | null
  related_player_id: number | null
  player_name:  string | null
  related_player_name: string | null
  result:       string | null
  info:         string | null
  addition:     string | null
  minute:       number
  extra_minute: number | null
  injured:      boolean | null
  on_bench:     boolean
  coach_id:     number | null
  sub_type_id:  number | null
  type?: { code: string; name: string; developer_name: string }
}

export interface SmTeam {
  id:             number
  sport_id:       number
  country_id:     number
  venue_id:       number
  gender:         string
  name:           string
  short_code:     string
  image_path:     string
  founded:        number | null
  type:           string
  placeholder:    boolean
  country?: {
    id:      number
    name:    string
    image_path: string
    iso2:    string
    iso3:    string
  }
}

export interface SmStanding {
  id:           number
  participant_id: number
  standing_rule_id: number
  position:     number
  points:       number
  result:       string | null   // "Advance" | "Qualify" | "Relegated"
  form:         string | null   // "WWDLL"
  details: {
    id:     number
    standing_id: number
    type_id: number
    value:  number
    type?: { code: string; name: string }
  }[]
  participant?: SmTeam
}

export interface SmPlayer {
  id:            number
  team_id:       number
  country_id:    number
  nationality_id: number
  city_id:       number | null
  position_id:   number
  detailed_position_id: number | null
  type_id:       number
  common_name:   string
  firstname:     string
  lastname:      string
  name:          string
  display_name:  string
  image_path:    string
  height:        number | null
  weight:        number | null
  date_of_birth: string
  gender:        string
  jersey_number: number | null
  position?: { code: string; name: string }
  statistics?: SmPlayerStat[]
}

export interface SmPlayerStat {
  id:          number
  player_id:   number
  team_id:     number
  season_id:   number
  has_values:  boolean
  details?: {
    type?: { code: string }
    value: { total: number; home?: number; away?: number }
  }[]
}
