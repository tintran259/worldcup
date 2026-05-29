import type { BracketRound } from '@/types/domain.types'
import type { ExtendedMatch, MatchStats } from './types'
import { TEAM_MAP } from './teams'

// ── Helpers ───────────────────────────────────────────────────────────────────

const tm = (id: string) => TEAM_MAP.get(id)!

const liveStats: MatchStats = {
  possession:       { home: 54, away: 46 },
  shots:            { home: 8,  away: 5  },
  shotsOnTarget:    { home: 4,  away: 2  },
  blockedShots:     { home: 2,  away: 1  },
  corners:          { home: 4,  away: 2  },
  fouls:            { home: 7,  away: 9  },
  yellowCards:      { home: 1,  away: 2  },
  redCards:         { home: 0,  away: 0  },
  offsides:         { home: 1,  away: 3  },
  saves:            { home: 2,  away: 4  },
  passAccuracy:     { home: 88, away: 82 },
  xG:               { home: 1.8, away: 0.9 },
  bigChances:       { home: 3,  away: 1  },
  bigChancesMissed: { home: 1,  away: 1  },
}

const completedStats = (poss: number, shotsH: number, shotsA: number): MatchStats => ({
  possession:       { home: poss, away: 100 - poss },
  shots:            { home: shotsH, away: shotsA },
  shotsOnTarget:    { home: Math.round(shotsH * 0.4), away: Math.round(shotsA * 0.35) },
  blockedShots:     { home: Math.round(shotsH * 0.15), away: Math.round(shotsA * 0.2) },
  corners:          { home: Math.round(shotsH * 0.5), away: Math.round(shotsA * 0.4) },
  fouls:            { home: 10, away: 12 },
  yellowCards:      { home: 1, away: 2 },
  redCards:         { home: 0, away: 0 },
  offsides:         { home: 2, away: 3 },
  saves:            { home: Math.round(shotsA * 0.35), away: Math.round(shotsH * 0.4) },
  passAccuracy:     { home: poss > 50 ? 88 : 80, away: poss > 50 ? 78 : 86 },
  xG:               { home: shotsH * 0.15, away: shotsA * 0.12 },
  bigChances:       { home: Math.round(shotsH * 0.25), away: Math.round(shotsA * 0.2) },
  bigChancesMissed: { home: 1, away: 1 },
})

// ── Round of 32 ────────────────────────────────────────────────────────────────

export const R32_MATCHES: ExtendedMatch[] = [
  {
    id: 'r32-1', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 1,
    homeTeam: tm('BRA'), awayTeam: tm('KOR'),
    score: { home: 2, away: 0 }, status: 'completed', winnerId: 'BRA',
    venue: 'SoFi Stadium', city: 'Los Angeles', scheduledAt: '2026-06-28T20:00:00Z',
    stadiumId: 'sofi', attendance: 70_128, referee: 'Szymon Marciniak (POL)',
    stats: completedStats(62, 14, 6),
    events: [
      { id: 'e1', type: 'goal', minute: 23, teamId: 'BRA', playerId: 'p1', playerName: 'Vinícius Jr.', description: 'Left-footed finish' },
      { id: 'e2', type: 'goal', minute: 78, teamId: 'BRA', playerId: 'p4', playerName: 'Bruno Guimarães', assistPlayerName: 'Rodrygo', description: 'Header from corner' },
    ],
  },
  {
    id: 'r32-2', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 2,
    homeTeam: tm('FRA'), awayTeam: tm('AUS'),
    score: { home: 3, away: 1 }, status: 'completed', winnerId: 'FRA',
    venue: 'MetLife Stadium', city: 'New York', scheduledAt: '2026-06-28T16:00:00Z',
    stadiumId: 'metlife', attendance: 82_341, referee: 'Daniele Orsato (ITA)',
    stats: completedStats(58, 16, 9),
    events: [
      { id: 'e3', type: 'goal', minute: 18, teamId: 'FRA', playerId: 'p6', playerName: 'Kylian Mbappé', description: 'Solo run and finish' },
      { id: 'e4', type: 'goal', minute: 44, teamId: 'FRA', playerId: 'p7', playerName: 'Antoine Griezmann', description: 'Penalty' },
      { id: 'e5', type: 'goal', minute: 61, teamId: 'AUS', playerId: 'p-aus1', playerName: 'Mat Leckie', description: 'Consolation' },
      { id: 'e6', type: 'goal', minute: 87, teamId: 'FRA', playerId: 'p6', playerName: 'Kylian Mbappé', description: 'Counter-attack' },
    ],
  },
  {
    id: 'r32-3', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 3,
    homeTeam: tm('ARG'), awayTeam: tm('ECU'),
    score: { home: 2, away: 0 }, status: 'live', minute: 67,
    venue: 'AT&T Stadium', city: 'Dallas', scheduledAt: '2026-06-29T20:00:00Z',
    stadiumId: 'att', stats: liveStats,
    events: [
      { id: 'e7', type: 'goal', minute: 14, teamId: 'ARG', playerId: 'p11', playerName: 'Lionel Messi', description: 'Free kick, top corner' },
      { id: 'e8', type: 'goal', minute: 52, teamId: 'ARG', playerId: 'p12', playerName: 'Julián Álvarez', assistPlayerName: 'Messi', description: 'Clinical finish' },
      { id: 'e9', type: 'yellow-card', minute: 63, teamId: 'ECU', playerId: 'p-ecu1', playerName: 'Piero Hincapié', description: 'Tactical foul' },
    ],
  },
  {
    id: 'r32-4', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 4,
    homeTeam: tm('ENG'), awayTeam: tm('SUI'),
    score: null, status: 'upcoming',
    venue: "Levi's Stadium", city: 'San Francisco', scheduledAt: '2026-06-29T16:00:00Z',
    stadiumId: 'levis',
  },
  {
    id: 'r32-5', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 5,
    homeTeam: tm('ESP'), awayTeam: tm('POL'),
    score: null, status: 'upcoming',
    venue: 'Rose Bowl', city: 'Pasadena', scheduledAt: '2026-06-30T20:00:00Z',
    stadiumId: 'rosebowl',
  },
  {
    id: 'r32-6', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 6,
    homeTeam: tm('GER'), awayTeam: tm('DEN'),
    score: null, status: 'upcoming',
    venue: 'Lincoln Financial Field', city: 'Philadelphia', scheduledAt: '2026-06-30T16:00:00Z',
    stadiumId: 'lincoln',
  },
  {
    id: 'r32-7', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 7,
    homeTeam: tm('POR'), awayTeam: tm('CMR'),
    score: null, status: 'upcoming',
    venue: 'Arrowhead Stadium', city: 'Kansas City', scheduledAt: '2026-07-01T20:00:00Z',
    stadiumId: 'arrowhead',
  },
  {
    id: 'r32-8', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 8,
    homeTeam: tm('USA'), awayTeam: tm('GHA'),
    score: null, status: 'upcoming',
    venue: 'NRG Stadium', city: 'Houston', scheduledAt: '2026-07-01T16:00:00Z',
    stadiumId: 'nrg',
  },
  {
    id: 'r32-9', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 9,
    homeTeam: tm('MEX'), awayTeam: tm('SRB'),
    score: null, status: 'upcoming',
    venue: 'Estadio Azteca', city: 'Mexico City', scheduledAt: '2026-07-02T20:00:00Z',
    stadiumId: 'azteca',
  },
  {
    id: 'r32-10', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 10,
    homeTeam: tm('NED'), awayTeam: tm('IRN'),
    score: null, status: 'upcoming',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', scheduledAt: '2026-07-02T16:00:00Z',
    stadiumId: 'mercedes',
  },
  {
    id: 'r32-11', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 11,
    homeTeam: tm('BEL'), awayTeam: tm('WAL'),
    score: null, status: 'upcoming',
    venue: 'Gillette Stadium', city: 'Boston', scheduledAt: '2026-07-03T20:00:00Z',
    stadiumId: 'gillette',
  },
  {
    id: 'r32-12', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 12,
    homeTeam: tm('URU'), awayTeam: tm('COL'),
    score: null, status: 'upcoming',
    venue: 'Lumen Field', city: 'Seattle', scheduledAt: '2026-07-03T16:00:00Z',
    stadiumId: 'lumen',
  },
  {
    id: 'r32-13', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 13,
    homeTeam: tm('CRO'), awayTeam: tm('TUN'),
    score: null, status: 'upcoming',
    venue: 'BMO Field', city: 'Toronto', scheduledAt: '2026-07-04T20:00:00Z',
    stadiumId: 'bmo',
  },
  {
    id: 'r32-14', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 14,
    homeTeam: tm('SEN'), awayTeam: tm('NGA'),
    score: null, status: 'upcoming',
    venue: 'BC Place', city: 'Vancouver', scheduledAt: '2026-07-04T16:00:00Z',
    stadiumId: 'bc',
  },
  {
    id: 'r32-15', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 15,
    homeTeam: tm('MAR'), awayTeam: tm('CHI'),
    score: null, status: 'upcoming',
    venue: 'Estadio BBVA', city: 'Monterrey', scheduledAt: '2026-07-05T20:00:00Z',
    stadiumId: 'bbva',
  },
  {
    id: 'r32-16', round: 'round-of-32', roundDisplay: 'Vòng 32', matchNumber: 16,
    homeTeam: tm('JPN'), awayTeam: tm('CAN'),
    score: null, status: 'upcoming',
    venue: 'Estadio Akron', city: 'Guadalajara', scheduledAt: '2026-07-05T16:00:00Z',
    stadiumId: 'akron',
  },
]

// ── Round of 16 ────────────────────────────────────────────────────────────────

export const R16_MATCHES: ExtendedMatch[] = [
  {
    id: 'r16-1', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 1,
    homeTeam: tm('BRA'), awayTeam: tm('FRA'),
    score: null, status: 'upcoming',
    venue: 'MetLife Stadium', city: 'New York', scheduledAt: '2026-07-07T20:00:00Z',
    stadiumId: 'metlife',
  },
  {
    id: 'r16-2', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 2,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'SoFi Stadium', city: 'Los Angeles', scheduledAt: '2026-07-07T16:00:00Z',
    stadiumId: 'sofi',
  },
  {
    id: 'r16-3', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 3,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'Rose Bowl', city: 'Pasadena', scheduledAt: '2026-07-08T20:00:00Z',
    stadiumId: 'rosebowl',
  },
  {
    id: 'r16-4', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 4,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'AT&T Stadium', city: 'Dallas', scheduledAt: '2026-07-08T16:00:00Z',
    stadiumId: 'att',
  },
  {
    id: 'r16-5', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 5,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'NRG Stadium', city: 'Houston', scheduledAt: '2026-07-09T20:00:00Z',
    stadiumId: 'nrg',
  },
  {
    id: 'r16-6', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 6,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'Arrowhead Stadium', city: 'Kansas City', scheduledAt: '2026-07-09T16:00:00Z',
    stadiumId: 'arrowhead',
  },
  {
    id: 'r16-7', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 7,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'Lincoln Financial Field', city: 'Philadelphia', scheduledAt: '2026-07-10T20:00:00Z',
    stadiumId: 'lincoln',
  },
  {
    id: 'r16-8', round: 'round-of-16', roundDisplay: 'Vòng 16', matchNumber: 8,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', scheduledAt: '2026-07-10T16:00:00Z',
    stadiumId: 'mercedes',
  },
]

// ── Quarter-Finals ─────────────────────────────────────────────────────────────

export const QF_MATCHES: ExtendedMatch[] = [
  {
    id: 'qf-1', round: 'quarter-final', roundDisplay: 'Tứ kết', matchNumber: 1,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'MetLife Stadium', city: 'New York', scheduledAt: '2026-07-12T20:00:00Z',
    stadiumId: 'metlife',
  },
  {
    id: 'qf-2', round: 'quarter-final', roundDisplay: 'Tứ kết', matchNumber: 2,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'SoFi Stadium', city: 'Los Angeles', scheduledAt: '2026-07-12T16:00:00Z',
    stadiumId: 'sofi',
  },
  {
    id: 'qf-3', round: 'quarter-final', roundDisplay: 'Tứ kết', matchNumber: 3,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'Rose Bowl', city: 'Pasadena', scheduledAt: '2026-07-13T20:00:00Z',
    stadiumId: 'rosebowl',
  },
  {
    id: 'qf-4', round: 'quarter-final', roundDisplay: 'Tứ kết', matchNumber: 4,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'AT&T Stadium', city: 'Dallas', scheduledAt: '2026-07-13T16:00:00Z',
    stadiumId: 'att',
  },
]

// ── Semi-Finals ────────────────────────────────────────────────────────────────

export const SF_MATCHES: ExtendedMatch[] = [
  {
    id: 'sf-1', round: 'semi-final', roundDisplay: 'Bán kết', matchNumber: 1,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'MetLife Stadium', city: 'New York', scheduledAt: '2026-07-15T20:00:00Z',
    stadiumId: 'metlife',
  },
  {
    id: 'sf-2', round: 'semi-final', roundDisplay: 'Bán kết', matchNumber: 2,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'Rose Bowl', city: 'Pasadena', scheduledAt: '2026-07-16T20:00:00Z',
    stadiumId: 'rosebowl',
  },
]

// ── Final ──────────────────────────────────────────────────────────────────────

export const FINAL_MATCHES: ExtendedMatch[] = [
  {
    id: 'final-1', round: 'final', roundDisplay: 'Chung kết', matchNumber: 1,
    homeTeam: null, awayTeam: null,
    score: null, status: 'upcoming',
    venue: 'MetLife Stadium', city: 'New York', scheduledAt: '2026-07-19T20:00:00Z',
    stadiumId: 'metlife',
  },
]

// ── All knockout matches ────────────────────────────────────────────────────────

export const ALL_KNOCKOUT_MATCHES: ExtendedMatch[] = [
  ...R32_MATCHES,
  ...R16_MATCHES,
  ...QF_MATCHES,
  ...SF_MATCHES,
  ...FINAL_MATCHES,
]

/** Lookup a match by id across all rounds */
export const getMatch = (id: string): ExtendedMatch | undefined =>
  ALL_KNOCKOUT_MATCHES.find((m) => m.id === id)

/** BracketRound[] shape consumed by BracketCanvas / MOCK_ROUNDS */
export const KNOCKOUT_ROUNDS: BracketRound[] = [
  { id: 'round-of-32', label: 'Vòng 32 đội',  matchCount: 16, matches: R32_MATCHES },
  { id: 'round-of-16', label: 'Vòng 16 đội',  matchCount: 8,  matches: R16_MATCHES },
  { id: 'quarter-final', label: 'Tứ kết',      matchCount: 4,  matches: QF_MATCHES  },
  { id: 'semi-final',    label: 'Bán kết',     matchCount: 2,  matches: SF_MATCHES  },
  { id: 'final',         label: 'Chung kết',   matchCount: 1,  matches: FINAL_MATCHES },
]
