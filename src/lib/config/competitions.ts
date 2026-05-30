/**
 * Competition registry
 *
 * Each entry maps a CompetitionKey to:
 *   - display metadata (name, type, dates)
 *   - per-provider ID bags (leagueId for API-Football, stageId for SportMonks, etc.)
 *
 * When adding a new competition:
 *   1. Add its key to CompetitionKey in types.ts and COMPETITION_KEYS in env.schema.ts
 *   2. Add an entry below with IDs for every provider you use
 *   3. Set FOOTBALL_COMPETITION=<new-key> in .env.local
 */

import type { CompetitionConfig, CompetitionKey } from './types'

// ── Registry ──────────────────────────────────────────────────────────────────

export const COMPETITIONS: Record<CompetitionKey, CompetitionConfig> = {

  // ── FIFA World Cup 2026 ──────────────────────────────────────────────────────
  wc2026: {
    key: 'wc2026',
    name: 'FIFA World Cup 2026',
    shortName: 'World Cup 2026',
    type: 'cup',
    hasGroupStage: true,
    providerIds: {
      'api-football': {
        leagueId: '1',
        season: '2026',
        dateFrom: '2026-06-11',
        dateTo: '2026-07-19',
      },
      sportmonks: {
        stageId: 'wc_2026',
        seasonId: '23734',
        dateFrom: '2026-06-11',
        dateTo: '2026-07-19',
      },
      sportradar: {
        tournamentId: 'sr:tournament:1',
        seasonId: 'sr:season:106479',
        dateFrom: '2026-06-11',
        dateTo: '2026-07-19',
      },
    },
  },

  // ── FIFA World Cup 2022 (Qatar) ─────────────────────────────────────────────
  // Argentina vô địch (penalty thắng France) — có đầy đủ 64 trận data.
  // Dùng để dev khi WC 2026 chưa có data trong API.
  wc2022: {
    key: 'wc2022',
    name: 'FIFA World Cup 2022',
    shortName: 'World Cup 2022',
    type: 'cup',
    hasGroupStage: true,
    providerIds: {
      'api-football': {
        leagueId: '1',
        season: '2022',
        dateFrom: '2022-11-20',
        dateTo: '2022-12-18',
      },
      sportmonks: {
        stageId: 'wc_2022',
        seasonId: '19686',
        dateFrom: '2022-11-20',
        dateTo: '2022-12-18',
      },
      sportradar: {
        tournamentId: 'sr:tournament:1',
        seasonId: 'sr:season:77453',
        dateFrom: '2022-11-20',
        dateTo: '2022-12-18',
      },
    },
  },

  // ── UEFA Euro 2024 ───────────────────────────────────────────────────────────
  euro2024: {
    key: 'euro2024',
    name: 'UEFA Euro 2024',
    shortName: 'Euro 2024',
    type: 'cup',
    hasGroupStage: true,
    providerIds: {
      'api-football': {
        leagueId: '4',
        season: '2024',
        dateFrom: '2024-06-14',
        dateTo: '2024-07-14',
      },
      sportmonks: {
        stageId: 'euro_2024',
        seasonId: '21646',
        dateFrom: '2024-06-14',
        dateTo: '2024-07-14',
      },
      sportradar: {
        tournamentId: 'sr:tournament:2',
        seasonId: 'sr:season:105353',
        dateFrom: '2024-06-14',
        dateTo: '2024-07-14',
      },
    },
  },

  // ── Copa America 2024 ────────────────────────────────────────────────────────
  'copa-america-2024': {
    key: 'copa-america-2024',
    name: 'Copa América 2024',
    shortName: 'Copa América',
    type: 'cup',
    hasGroupStage: true,
    providerIds: {
      'api-football': {
        leagueId: '9',
        season: '2024',
        dateFrom: '2024-06-20',
        dateTo: '2024-07-14',
      },
      sportmonks: {
        stageId: 'copa_america_2024',
        seasonId: '21693',
        dateFrom: '2024-06-20',
        dateTo: '2024-07-14',
      },
      sportradar: {
        tournamentId: 'sr:tournament:29',
        seasonId: 'sr:season:106537',
        dateFrom: '2024-06-20',
        dateTo: '2024-07-14',
      },
    },
  },

  // ── UEFA Champions League 2023-24 ────────────────────────────────────────────
  // NOTE: dùng season 2023-24 vì free plan chỉ cho phép query season 2021-2023.
  // Real Madrid vô địch — có data đầy đủ knockout bracket.
  // Khi nâng cấp paid plan hoặc WC 2026 có data: đổi sang competition khác.
  ucl: {
    key: 'ucl',
    name: 'UEFA Champions League 2023-24',
    shortName: 'Champions League',
    type: 'cup',
    hasGroupStage: true,
    providerIds: {
      'api-football': {
        leagueId: '2',
        season: '2023',
        dateFrom: '2023-09-19',
        dateTo: '2024-06-01',
      },
      sportmonks: {
        stageId: 'ucl_2023_24',
        seasonId: '21638',
        dateFrom: '2023-09-19',
        dateTo: '2024-06-01',
      },
      sportradar: {
        tournamentId: 'sr:tournament:7',
        seasonId: 'sr:season:106478',
        dateFrom: '2023-09-19',
        dateTo: '2024-06-01',
      },
    },
  },

  // ── English Premier League 2024-25 ───────────────────────────────────────────
  'premier-league': {
    key: 'premier-league',
    name: 'Premier League 2024-25',
    shortName: 'Premier League',
    type: 'league',
    hasGroupStage: false,
    providerIds: {
      'api-football': {
        leagueId: '39',
        season: '2024',
        dateFrom: '2024-08-16',
        dateTo: '2025-05-25',
      },
      sportmonks: {
        stageId: 'epl_2024_25',
        seasonId: '23614',
        dateFrom: '2024-08-16',
        dateTo: '2025-05-25',
      },
      sportradar: {
        tournamentId: 'sr:tournament:17',
        seasonId: 'sr:season:106480',
        dateFrom: '2024-08-16',
        dateTo: '2025-05-25',
      },
    },
  },

  // ── La Liga 2024-25 ───────────────────────────────────────────────────────────
  'la-liga': {
    key: 'la-liga',
    name: 'La Liga 2024-25',
    shortName: 'La Liga',
    type: 'league',
    hasGroupStage: false,
    providerIds: {
      'api-football': {
        leagueId: '140',
        season: '2024',
        dateFrom: '2024-08-15',
        dateTo: '2025-05-25',
      },
      sportmonks: {
        stageId: 'la_liga_2024_25',
        seasonId: '23468',
        dateFrom: '2024-08-15',
        dateTo: '2025-05-25',
      },
      sportradar: {
        tournamentId: 'sr:tournament:8',
        seasonId: 'sr:season:106481',
        dateFrom: '2024-08-15',
        dateTo: '2025-05-25',
      },
    },
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Lookup by key — throws if key is not registered */
export function getCompetitionByKey(key: CompetitionKey): CompetitionConfig {
  const comp = COMPETITIONS[key]
  if (!comp) throw new Error(`[Competitions] Unknown competition key: "${key}"`)
  return comp
}

/** All competition keys sorted alphabetically */
export const ALL_COMPETITION_KEYS = Object.keys(COMPETITIONS) as CompetitionKey[]
