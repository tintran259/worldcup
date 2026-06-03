import { createHttpClient } from '../http'
import type { FootballProvider, LiveMatchParams, FixtureParams } from '../types'
import type { SmResponse, SmFixture, SmTeam, SmEvent, SmStanding, SmPlayer } from './sportmonks.types'

const BASE_URL = 'https://api.sportmonks.com/v3/football'
const INCLUDES = {
  fixture: 'state;participants;scores;venue;round;events.type',
  team: 'country',
  standing: 'participant',
  player: 'position;statistics.details.type',
}

export function createSportMonksClient(token: string): FootballProvider {
  const http = createHttpClient('sportmonks', {
    baseUrl: BASE_URL,
    timeoutMs: 14_000,
    getHeaders: () => ({ Authorization: token }),
    retry: { maxAttempts: 3, baseDelayMs: 700 },
  })

  return {
    name: 'sportmonks',

    async getLiveMatches(_params: LiveMatchParams) {
      const res = await http.get<SmResponse<SmFixture[]>>('/livescores', { include: INCLUDES.fixture })
      return Array.isArray(res.data) ? res.data : []
    },

    async getFixtures(params: FixtureParams) {
      const res = await http.get<SmResponse<SmFixture[]>>(
        `/stages/${params.stageId ?? ''}/fixtures`,
        { include: INCLUDES.fixture, 'filter[date]': `${params.from},${params.to}` },
      )
      return Array.isArray(res.data) ? res.data : []
    },

    async getMatchById(externalId: string) {
      const res = await http.get<SmResponse<SmFixture>>(`/fixtures/${externalId}`, { include: INCLUDES.fixture })
      return res.data
    },

    async getMatchEvents(externalId: string) {
      const res = await http.get<SmResponse<SmEvent[]>>(`/fixtures/${externalId}/events`, { include: 'type' })
      return Array.isArray(res.data) ? res.data : []
    },

    async getTeamById(externalId: string) {
      const res = await http.get<SmResponse<SmTeam>>(`/teams/${externalId}`, { include: INCLUDES.team })
      return res.data
    },

    async getTeamsByTournament(params: LiveMatchParams) {
      const res = await http.get<SmResponse<SmTeam[]>>(`/stages/${params.stageId ?? ''}/teams`, { include: INCLUDES.team })
      return Array.isArray(res.data) ? res.data : []
    },

    async getGroupStandings(params: LiveMatchParams) {
      const res = await http.get<SmResponse<SmStanding[]>>(`/stages/${params.stageId ?? ''}/standings`, { include: INCLUDES.standing })
      return Array.isArray(res.data) ? res.data : []
    },

    async getSquad(teamExternalId: string) {
      const res = await http.get<SmResponse<SmPlayer[]>>(`/teams/${teamExternalId}/squad`, { include: INCLUDES.player })
      return Array.isArray(res.data) ? res.data : []
    },

    async getTeamPlayersWithStats(_teamExternalId: string, _params: LiveMatchParams) {
      // SportMonks: TODO — chưa implement
      return []
    },

    async getTopScorers(_params: LiveMatchParams) {
      // SportMonks: TODO — chưa implement
      return []
    },
  }
}
