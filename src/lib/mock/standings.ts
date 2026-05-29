import type { GroupStage, GroupRow, FormResult } from './types'
import { TEAM_MAP } from './teams'

// ── Helper ────────────────────────────────────────────────────────────────────

const row = (
  teamId: string,
  pos: number,
  w: number, d: number, l: number,
  gf: number, ga: number,
  form: FormResult[],
  advanceStatus: GroupRow['advanceStatus'],
): GroupRow => {
  const team = TEAM_MAP.get(teamId)!
  const played = w + d + l
  return {
    team,
    position: pos,
    played,
    won: w,
    drawn: d,
    lost: l,
    goalsFor: gf,
    goalsAgainst: ga,
    goalDifference: gf - ga,
    points: w * 3 + d,
    form,
    advanceStatus,
  }
}

// ── 12 Groups ─────────────────────────────────────────────────────────────────

export const GROUP_STANDINGS: GroupStage[] = [
  // ── Group A ────────────────────────────────────────────────────────────────
  {
    id: 'A',
    name: 'Group A',
    teams: [
      row('USA', 1, 2, 1, 0, 5, 2, ['W','D','W'], 'qualified'),
      row('ENG', 2, 1, 1, 1, 3, 3, ['W','D','L'], 'qualified'),
      row('IRN', 3, 1, 0, 2, 2, 4, ['L','W','L'], 'pending'),
      row('TUN', 4, 0, 2, 1, 1, 2, ['D','L','D'], 'eliminated'),
    ],
  },

  // ── Group B ────────────────────────────────────────────────────────────────
  {
    id: 'B',
    name: 'Group B',
    teams: [
      row('ARG', 1, 3, 0, 0, 7, 1, ['W','W','W'], 'qualified'),
      row('MEX', 2, 1, 1, 1, 3, 4, ['L','D','W'], 'qualified'),
      row('ECU', 3, 1, 0, 2, 3, 5, ['W','L','L'], 'eliminated'),
      row('POL', 4, 0, 1, 2, 2, 5, ['L','D','L'], 'eliminated'),
    ],
  },

  // ── Group C ────────────────────────────────────────────────────────────────
  {
    id: 'C',
    name: 'Group C',
    teams: [
      row('BRA', 1, 3, 0, 0, 8, 1, ['W','W','W'], 'qualified'),
      row('FRA', 2, 2, 0, 1, 6, 3, ['W','L','W'], 'qualified'),
      row('SEN', 3, 1, 0, 2, 3, 6, ['L','W','L'], 'eliminated'),
      row('CMR', 4, 0, 0, 3, 1, 8, ['L','L','L'], 'eliminated'),
    ],
  },

  // ── Group D ────────────────────────────────────────────────────────────────
  {
    id: 'D',
    name: 'Group D',
    teams: [
      row('ESP', 1, 2, 1, 0, 6, 2, ['W','D','W'], 'qualified'),
      row('GER', 2, 2, 0, 1, 5, 3, ['W','W','L'], 'qualified'),
      row('JPN', 3, 1, 1, 1, 3, 3, ['D','L','W'], 'pending'),
      row('AUS', 4, 0, 0, 3, 1, 7, ['L','L','L'], 'eliminated'),
    ],
  },

  // ── Group E ────────────────────────────────────────────────────────────────
  {
    id: 'E',
    name: 'Group E',
    teams: [
      row('POR', 1, 3, 0, 0, 9, 2, ['W','W','W'], 'qualified'),
      row('NED', 2, 1, 1, 1, 4, 4, ['W','D','L'], 'qualified'),
      row('GHA', 3, 1, 0, 2, 3, 6, ['L','W','L'], 'eliminated'),
      row('CMR', 4, 0, 1, 2, 2, 6, ['L','D','L'], 'eliminated'),
    ],
  },

  // ── Group F ────────────────────────────────────────────────────────────────
  {
    id: 'F',
    name: 'Group F',
    teams: [
      row('BEL', 1, 2, 0, 1, 5, 3, ['W','L','W'], 'qualified'),
      row('CRO', 2, 1, 2, 0, 4, 3, ['D','D','W'], 'qualified'),
      row('URU', 3, 1, 1, 1, 4, 4, ['W','D','L'], 'pending'),
      row('COL', 4, 0, 1, 2, 2, 5, ['L','D','L'], 'eliminated'),
    ],
  },

  // ── Group G ────────────────────────────────────────────────────────────────
  {
    id: 'G',
    name: 'Group G',
    teams: [
      row('MAR', 1, 2, 1, 0, 5, 2, ['W','W','D'], 'qualified'),
      row('CAN', 2, 1, 1, 1, 3, 3, ['L','D','W'], 'qualified'),
      row('DEN', 3, 1, 0, 2, 3, 4, ['W','L','L'], 'eliminated'),
      row('KOR', 4, 0, 2, 1, 2, 4, ['D','D','L'], 'eliminated'),
    ],
  },

  // ── Group H ────────────────────────────────────────────────────────────────
  {
    id: 'H',
    name: 'Group H',
    teams: [
      row('SUI', 1, 2, 1, 0, 6, 3, ['W','D','W'], 'qualified'),
      row('SRB', 2, 1, 1, 1, 5, 5, ['D','L','W'], 'qualified'),
      row('WAL', 3, 1, 0, 2, 3, 5, ['W','L','L'], 'pending'),
      row('NGA', 4, 0, 2, 1, 2, 3, ['D','L','D'], 'eliminated'),
    ],
  },

  // ── Group I ────────────────────────────────────────────────────────────────
  {
    id: 'I',
    name: 'Group I',
    teams: [
      row('EGY', 1, 2, 0, 1, 4, 3, ['W','L','W'], 'pending'),
      row('TUR', 2, 1, 1, 1, 3, 3, ['L','D','W'], 'pending'),
      row('AUT', 3, 1, 1, 1, 3, 3, ['D','W','L'], 'pending'),
      row('CHI', 4, 1, 0, 2, 3, 4, ['L','W','L'], 'eliminated'),
    ],
  },

  // ── Group J ────────────────────────────────────────────────────────────────
  {
    id: 'J',
    name: 'Group J',
    teams: [
      row('UKR', 1, 2, 1, 0, 5, 2, ['W','D','W'], 'qualified'),
      row('QAT', 2, 1, 1, 1, 3, 3, ['D','W','L'], 'qualified'),
      row('PAR', 3, 1, 0, 2, 2, 4, ['W','L','L'], 'eliminated'),
      row('CRC', 4, 0, 2, 1, 1, 2, ['D','L','D'], 'eliminated'),
    ],
  },

  // ── Group K ────────────────────────────────────────────────────────────────
  {
    id: 'K',
    name: 'Group K',
    teams: [
      row('ROM', 1, 2, 0, 1, 4, 3, ['W','L','W'], 'pending'),
      row('CIV', 2, 1, 2, 0, 3, 2, ['D','W','D'], 'pending'),
      row('AUT', 3, 1, 0, 2, 2, 3, ['W','L','L'], 'eliminated'),
      row('KSA', 4, 0, 2, 1, 2, 3, ['D','L','D'], 'eliminated'),
    ],
  },

  // ── Group L ────────────────────────────────────────────────────────────────
  {
    id: 'L',
    name: 'Group L',
    teams: [
      row('ALG', 1, 2, 0, 1, 4, 3, ['W','W','L'], 'qualified'),
      row('PER', 2, 1, 1, 1, 3, 3, ['D','L','W'], 'qualified'),
      row('PAN', 3, 1, 1, 1, 3, 4, ['L','W','D'], 'eliminated'),
      row('IDN', 4, 0, 2, 1, 2, 2, ['L','D','D'], 'eliminated'),
    ],
  },
]

/** O(1) group lookup */
export const GROUP_MAP: ReadonlyMap<string, GroupStage> = new Map(
  GROUP_STANDINGS.map((g) => [g.id, g])
)

/** All group rows flattened — useful for "best 3rd place" computation */
export const ALL_GROUP_ROWS: GroupRow[] = GROUP_STANDINGS.flatMap((g) => g.teams)
