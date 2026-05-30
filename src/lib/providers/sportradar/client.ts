import { createHttpClient } from '../http'
import type { FootballProvider, LiveMatchParams, FixtureParams } from '../types'
import type { SrLiveSchedule, SrSchedule, SrMatchSummary, SrCompetitorProfile, SrStanding } from './sportradar.types'

// Sportradar Soccer v4
const BASE_URL = 'https://api.sportradar.com/soccer/trial/v4/en'

export function createSportradarClient(apiKey: string): FootballProvider {
  const http = createHttpClient('sportradar', {
    baseUrl:    BASE_URL,
    timeoutMs:  15_000,
    getHeaders: () => ({}),   // Sportradar dùng query param, không phải header
    retry:      { maxAttempts: 3, baseDelayMs: 800, maxDelayMs: 10_000 },
    circuit:    { failureThreshold: 4 },
  })

  // Tất cả request đều cần thêm api_key vào query string
  function withKey(params?: Record<string, string>) {
    return { ...params, api_key: apiKey }
  }

  return {
    name: 'sportradar',

    async getLiveMatches(_params: LiveMatchParams) {
      const res = await http.get<SrLiveSchedule>('/schedules/live/summaries.json', withKey())
      return res.sport_events ?? []
    },

    async getFixtures(params: FixtureParams) {
      const res = await http.get<SrSchedule>(
        `/tournaments/${params.tournamentId ?? ''}/schedule.json`,
        withKey(),
      )
      return res.sport_events ?? []
    },

    async getMatchById(externalId: string) {
      const res = await http.get<{ sport_event_summary: SrMatchSummary }>(
        `/sport_events/${externalId}/summary.json`,
        withKey(),
      )
      return res.sport_event_summary
    },

    async getMatchEvents(externalId: string) {
      const res = await http.get<{ sport_event_summary: SrMatchSummary }>(
        `/sport_events/${externalId}/summary.json`,
        withKey(),
      )
      return res.sport_event_summary?.timeline ?? []
    },

    async getTeamById(externalId: string) {
      const res = await http.get<SrCompetitorProfile>(`/competitors/${externalId}/profile.json`, withKey())
      return res.competitor
    },

    async getTeamsByTournament(params: LiveMatchParams) {
      const res = await http.get<{ competitors: unknown[] }>(
        `/tournaments/${params.tournamentId ?? ''}/competitors.json`,
        withKey(),
      )
      return res.competitors ?? []
    },

    async getGroupStandings(params: LiveMatchParams) {
      const res = await http.get<SrStanding>(
        `/tournaments/${params.tournamentId ?? ''}/standings.json`,
        withKey({ seasonId: params.seasonId ?? '' }),
      )
      return (res.groups ?? []).flatMap(g => g.standings)
    },

    async getSquad(teamExternalId: string) {
      const res = await http.get<SrCompetitorProfile>(`/competitors/${teamExternalId}/profile.json`, withKey())
      return res.competitor?.players ?? []
    },

    async getTopScorers(_params: LiveMatchParams) {
      // Sportradar: TODO — chưa implement
      return []
    },
  }
}
