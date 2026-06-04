/**
 * GET /api/matches
 *
 * Query params:
 *   status = "live" | "upcoming" | "completed"
 *   teamId = string  (filter by team)
 *
 * Returns: Match[] (canonical domain types)
 *
 * Fallback strategy: xem app/api/_helpers.ts
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'
import { MOCK_ROUNDS, getTeam, ALL_TEAMS } from '@/lib/mock'
import { withCompetition } from '@/lib/config/competitionContext'
import { handleProviderError, skipIfUpcoming } from '../_helpers'
import { cacheHeaders } from '@/lib/cache'
import type { Match } from '@/types/domain.types'

export const dynamic = 'force-dynamic'

const IS_DEV = process.env.NODE_ENV !== 'production'

function filterMock(status: Match['status'] | null, teamId: string | null): Match[] {
  let matches = MOCK_ROUNDS.flatMap((r) => r.matches)
  if (teamId) matches = matches.filter((m) => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
  if (status) matches = matches.filter((m) => m.status === status)
  return matches
}

// Resolve any team ID (slug, prefixed, shortname) → slug ID for mock lookup.
function resolveMockSlug(id: string): string | null {
  if (getTeam(id)) return id
  const stripped = id.replace(/^(af|sm|sr):/, '')
  if (getTeam(stripped)) return stripped
  const upper = stripped.toUpperCase()
  const match = ALL_TEAMS.find(t => t.shortName.toUpperCase() === upper)
  return match?.id ?? null
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get('status') as Match['status'] | null
  const teamId = searchParams.get('teamId')
  const competitionKey = searchParams.get('competition')

  return withCompetition(competitionKey, async () => {
    const skip = skipIfUpcoming<Match[]>([])
    if (skip) return skip

    try {
      const repo = getMatchRepository()
      let matches: Match[]

      if (status === 'live') {
        matches = await repo.findLive()
      } else if (teamId) {
        // 1. Try direct ID match
        const all = await repo.findAll()
        matches = all.filter((m) => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)

        // 2. Slug fallback: API matches có team ID khác (af:N).
        //    Resolve slug → mock team metadata → match by code/name.
        //    Giữ data source consistent với /api/stats (cả 2 từ repo.findAll()).
        if (matches.length === 0) {
          const slug = resolveMockSlug(teamId)
          const mockTeam = slug ? getTeam(slug) : null
          if (mockTeam) {
            matches = all.filter(
              (m) =>
                m.homeTeam?.code?.toLowerCase() === mockTeam.code.toLowerCase() ||
                m.awayTeam?.code?.toLowerCase() === mockTeam.code.toLowerCase() ||
                m.homeTeam?.shortName?.toUpperCase() === mockTeam.shortName.toUpperCase() ||
                m.awayTeam?.shortName?.toUpperCase() === mockTeam.shortName.toUpperCase(),
            )
          }
        }
      } else {
        matches = await repo.findAll()
      }

      if (status && status !== 'live') {
        matches = matches.filter((m) => m.status === status)
      }

      return Response.json(matches, {
        headers: cacheHeaders(status === 'live' ? 'LIVE_MATCH' : 'MATCHES_LIST'),
      })
    } catch (error) {
      // Fallback mock — khi tất cả provider fail (không phải mock-first quota saving).
      // Khi này stats endpoint cũng fail → sẽ cùng mock empty, consistency vẫn ổn.
      if (IS_DEV && teamId) {
        const slug = resolveMockSlug(teamId)
        if (slug) {
          console.log(`[/api/matches?teamId=${teamId}] → API failed, mock fallback (slug "${slug}")`)
          const matches = filterMock(status, slug)
          return Response.json(matches, { headers: { 'Cache-Control': 'no-store' } })
        }
      }
      return handleProviderError({
        route: 'matches',
        error,
        mockData: filterMock(status, teamId),
      })
    }
  })
}
