/**
 * API-Football Client
 *
 * Gọi https://v3.football.api-sports.io
 * Trả về raw unknown[] — Adapter sẽ chuyển đổi sang domain types.
 */

import { createHttpClient } from '../http'
import type { FootballProvider, LiveMatchParams, FixtureParams } from '../types'
import type { AfResponse, AfFixture, AfTeam, AfEvent, AfStanding, AfPlayer } from './api-football.types'

const BASE_URL = 'https://v3.football.api-sports.io'

export function createApiFootballClient(apiKey: string): FootballProvider {
  const http = createHttpClient('api-football', {
    baseUrl: BASE_URL,
    timeoutMs: 12_000,
    getHeaders: () => ({ 'x-apisports-key': apiKey }),
    retry: { maxAttempts: 3, baseDelayMs: 600 },
  })

  return {
    name: 'api-football',

    async getLiveMatches(params: LiveMatchParams) {
      const res = await http.get<AfResponse<AfFixture>>('/fixtures', {
        live: 'all',
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
      })
      return res.response
    },

    async getFixtures(params: FixtureParams) {
      const res = await http.get<AfResponse<AfFixture>>('/fixtures', {
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
        from: params.from,
        to: params.to,
      })
      return res.response
    },

    async getMatchById(externalId: string) {
      const res = await http.get<AfResponse<AfFixture>>('/fixtures', { id: externalId })
      return res.response[0]
    },

    async getMatchEvents(externalId: string) {
      const res = await http.get<AfResponse<AfEvent>>('/fixtures/events', { fixture: externalId })
      return res.response
    },

    async getTeamById(externalId: string) {
      const res = await http.get<AfResponse<AfTeam>>('/teams', { id: externalId })
      return res.response[0]
    },

    async getTeamsByTournament(params: LiveMatchParams) {
      const res = await http.get<AfResponse<AfTeam>>('/teams', {
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
      })
      return res.response
    },

    async getGroupStandings(params: LiveMatchParams) {
      const res = await http.get<{ response: Array<AfStanding[][]> }>('/standings', {
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
      })
      // API-Football lồng standings trong nested array — flatten ra
      return res.response.flatMap(groups => groups.flatMap(g => g))
    },

    async getSquad(teamExternalId: string) {
      const res = await http.get<AfResponse<AfPlayer>>('/players/squads', { team: teamExternalId })
      return res.response
    },
  }
}
