/**
 * API-Football Client
 *
 * Gọi https://v3.football.api-sports.io
 * Trả về raw unknown[] — Adapter sẽ chuyển đổi sang domain types.
 */

import { createHttpClient } from '../http'
import { ProviderError, ProviderRateLimitError } from '../errors'
import type { FootballProvider, LiveMatchParams, FixtureParams } from '../types'
import type { AfResponse, AfFixture, AfTeam, AfEvent, AfStanding, AfPlayer } from './api-football.types'

const BASE_URL = 'https://v3.football.api-sports.io'

/**
 * API-Football trả HTTP 200 ngay cả khi hết quota/key sai.
 * Lỗi thật nằm trong field `errors`. Hàm này detect và throw đúng loại error
 * để repository layer có thể catch và fallback.
 *
 * Pattern lỗi thường gặp:
 *   { errors: { requests: "You have reached the request limit for the day, ..." } }
 *   { errors: { token: "Invalid token" } }
 *   { errors: { plan: "..." } }
 */
function checkApiFootballErrors<T>(res: AfResponse<T>, endpoint: string): AfResponse<T> {
  const errors = res.errors
  if (!errors) return res

  // Convert array → object form (array rỗng = OK)
  if (Array.isArray(errors)) {
    if (errors.length === 0) return res
    throw new ProviderError('api-football', `${endpoint}: ${JSON.stringify(errors)}`)
  }

  const entries = Object.entries(errors)
  if (entries.length === 0) return res

  // Tìm lỗi đầu tiên có meaning
  const [errKey, errMsg] = entries[0]
  const lowerMsg = String(errMsg).toLowerCase()

  console.error(`[api-football] ${endpoint} → errors:`, errors)

  // Rate limit / quota patterns
  if (
    errKey === 'requests' ||
    lowerMsg.includes('limit') ||
    lowerMsg.includes('quota') ||
    lowerMsg.includes('rate')
  ) {
    throw new ProviderRateLimitError('api-football', 60_000)
  }

  // Token/auth patterns
  if (errKey === 'token' || lowerMsg.includes('token') || lowerMsg.includes('auth')) {
    throw new ProviderError('api-football', `Auth error: ${errMsg}`, 401)
  }

  // Plan/access patterns
  if (errKey === 'plan' || lowerMsg.includes('plan') || lowerMsg.includes('access')) {
    throw new ProviderError('api-football', `Plan limitation: ${errMsg}`, 403)
  }

  // Unknown
  throw new ProviderError('api-football', `${endpoint} [${errKey}]: ${errMsg}`)
}

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
      return checkApiFootballErrors(res, '/fixtures?live=all').response
    },

    async getFixtures(params: FixtureParams) {
      const res = await http.get<AfResponse<AfFixture>>('/fixtures', {
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
        from: params.from,
        to: params.to,
      })
      return checkApiFootballErrors(res, '/fixtures').response
    },

    async getMatchById(externalId: string) {
      const res = await http.get<AfResponse<AfFixture>>('/fixtures', { id: externalId })
      return checkApiFootballErrors(res, `/fixtures?id=${externalId}`).response[0]
    },

    async getMatchEvents(externalId: string) {
      const res = await http.get<AfResponse<AfEvent>>('/fixtures/events', { fixture: externalId })
      return checkApiFootballErrors(res, '/fixtures/events').response
    },

    async getTeamById(externalId: string) {
      const res = await http.get<AfResponse<AfTeam>>('/teams', { id: externalId })
      return checkApiFootballErrors(res, `/teams?id=${externalId}`).response[0]
    },

    async getTeamsByTournament(params: LiveMatchParams) {
      const res = await http.get<AfResponse<AfTeam>>('/teams', {
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
      })
      return checkApiFootballErrors(res, '/teams').response
    },

    async getGroupStandings(params: LiveMatchParams) {
      // /standings trả về structure phức tạp hơn các endpoint khác:
      //   response: [{ league: { standings: AfStanding[][] } }]
      // standings là array các nhóm, mỗi nhóm là array AfStanding.
      const res = await http.get<AfResponse<{ league: { standings: AfStanding[][] } }>>(
        '/standings',
        {
          league: params.leagueId ?? '',
          season: params.season ?? '2026',
        },
      )
      checkApiFootballErrors(res, '/standings')
      // Flatten: response → league.standings (groups) → rows
      return res.response.flatMap((item) =>
        (item.league?.standings ?? []).flatMap((group) => group ?? []),
      )
    },

    async getSquad(teamExternalId: string) {
      // /players/squads response structure:
      //   { response: [{ team: {...}, players: [{id, name, age, number, position, photo}] }] }
      // Khác với /players (có statistics) — chỉ trả basic player info.
      const res = await http.get<AfResponse<{ team: unknown; players: unknown[] }>>(
        '/players/squads',
        { team: teamExternalId },
      )
      checkApiFootballErrors(res, '/players/squads')
      return res.response[0]?.players ?? []
    },

    async getTeamPlayersWithStats(teamExternalId: string, params: LiveMatchParams) {
      // /players endpoint paginate — mặc định 20/page, max 100/call.
      // QUAN TRỌNG: include `league` để đồng bộ stats với /players/topscorers.
      // Không có league → stats tổng theo season (UNL + friendlies + tournament)
      // → mâu thuẫn với top scorers chỉ trong league đó.
      const all: AfPlayer[] = []
      let page = 1
      const maxPages = 5  // hard cap để tránh runaway

      while (page <= maxPages) {
        const res = await http.get<AfResponse<AfPlayer> & { paging?: { current: number; total: number } }>(
          '/players',
          {
            team:   teamExternalId,
            league: params.leagueId ?? '',
            season: params.season ?? '2024',
            page:   String(page),
          },
        )
        checkApiFootballErrors(res, `/players?team=${teamExternalId}&league=${params.leagueId}&page=${page}`)
        all.push(...res.response)

        const totalPages = res.paging?.total ?? 1
        if (page >= totalPages) break
        page++
      }

      return all
    },

    async getTopScorers(params: LiveMatchParams) {
      const res = await http.get<AfResponse<AfPlayer>>('/players/topscorers', {
        league: params.leagueId ?? '',
        season: params.season ?? '2026',
      })
      return checkApiFootballErrors(res, '/players/topscorers').response
    },
  }
}
