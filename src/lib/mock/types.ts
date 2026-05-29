/**
 * Extended types for the mock data layer.
 * Domain primitives (Team, Match, Player…) live in @/types/domain.types.
 * This file adds mock-specific extensions and computed view types.
 */

import type { Team, Match, Player, TournamentRound } from '@/types/domain.types'

// ── Enumerations ──────────────────────────────────────────────────────────────

export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC'

export type KnockoutRound = Extract<
  TournamentRound,
  'round-of-32' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'final'
>

export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed'

export type SurfaceType = 'grass' | 'artificial'

export type FormResult = 'W' | 'D' | 'L'

// ── Stadium ───────────────────────────────────────────────────────────────────

export interface Stadium {
  id: string
  name: string
  shortName: string
  city: string
  state?: string
  country: string
  countryCode: string
  capacity: number
  surface: SurfaceType
  lat: number
  lng: number
  openedYear: number
  renovatedYear?: number
}

// ── Extended Team ─────────────────────────────────────────────────────────────

export interface ExtendedTeam extends Team {
  confederation: Confederation
  fifaRank: number
  group: string            // e.g. 'A', 'B' …
  manager: string
  captain: string
  homeColor: string
  awayColor: string
  qualified: boolean
  pot: 1 | 2 | 3 | 4
}

// ── Extended Player ───────────────────────────────────────────────────────────

export interface StarPlayer extends Omit<Player, 'number'> {
  shirtNumber: number
  age: number
  club: string
  clubLeague: string
  isCaptain: boolean
  tournamentGoals: number
  tournamentAssists: number
  tournamentYellowCards: number
  tournamentRedCards: number
  matchesPlayed: number
  minutesPlayed: number
  rating: number           // 1-10 scout rating
  marketValue: string      // e.g. '€180M'
}

// ── Group Stage ───────────────────────────────────────────────────────────────

export interface GroupRow {
  team: ExtendedTeam
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: FormResult[]
  advanceStatus: 'qualified' | 'eliminated' | 'pending'
}

export interface GroupStage {
  id: string                // 'A', 'B' …
  name: string              // 'Group A'
  teams: GroupRow[]
}

// ── Match statistics ──────────────────────────────────────────────────────────

export interface MatchStats {
  possession:      { home: number; away: number }
  shots:           { home: number; away: number }
  shotsOnTarget:   { home: number; away: number }
  blockedShots:    { home: number; away: number }
  corners:         { home: number; away: number }
  fouls:           { home: number; away: number }
  yellowCards:     { home: number; away: number }
  redCards:        { home: number; away: number }
  offsides:        { home: number; away: number }
  saves:           { home: number; away: number }
  passAccuracy:    { home: number; away: number }
  xG:              { home: number; away: number }
  bigChances:      { home: number; away: number }
  bigChancesMissed:{ home: number; away: number }
}

// ── Extended Match ────────────────────────────────────────────────────────────

export interface ExtendedMatch extends Match {
  stadiumId: string
  attendance?: number
  referee?: string
  stats?: MatchStats
  homeLineup?: StarPlayer[]
  awayLineup?: StarPlayer[]
}

// ── Tournament metadata ───────────────────────────────────────────────────────

export interface TournamentMeta {
  id: string
  name: string
  edition: number                    // e.g. 23
  year: number
  hosts: { country: string; code: string; city: string }[]
  teamCount: number
  groupCount: number
  matchCount: number
  startDate: string                  // ISO
  finalDate: string
  status: TournamentStatus
  currentPhase: KnockoutRound
  champion?: ExtendedTeam
  goldenBoot?: { player: StarPlayer; goals: number }
  goldenGlove?: { player: StarPlayer; saves: number }
  goldenBall?: StarPlayer
  topScorer?: StarPlayer
}

// ── Top-scorer leaderboard entry ──────────────────────────────────────────────

export interface TopScorer {
  rank: number
  player: StarPlayer
  team: ExtendedTeam
  goals: number
  assists: number
  minutesPerGoal: number
}

// ── Full tournament data object ───────────────────────────────────────────────

export interface TournamentData {
  meta:       TournamentMeta
  stadiums:   Stadium[]
  teams:      ExtendedTeam[]
  groups:     GroupStage[]
  matches:    ExtendedMatch[]
  topScorers: TopScorer[]
  players:    StarPlayer[]
}
