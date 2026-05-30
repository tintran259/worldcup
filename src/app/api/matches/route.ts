/**
 * GET /api/matches
 *
 * Query params:
 *   status = "live" | "upcoming" | "completed"
 *   teamId = string  (filter by team)
 *
 * Returns: Match[]  — canonical domain types, never raw provider data.
 * Falls back to mock data when no provider credentials are configured.
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'
import { MOCK_ROUNDS } from '@/lib/mock'
import type { Match } from '@/types/domain.types'

export const dynamic = 'force-dynamic'

function getMockMatches(): Match[] {
  return MOCK_ROUNDS.flatMap((r) => r.matches)
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get('status') as Match['status'] | null
  const teamId = searchParams.get('teamId')

  try {
    const repo = getMatchRepository()
    let matches: Match[]

    if (status === 'live') {
      matches = await repo.findLive()
    } else if (teamId) {
      matches = await repo.findByTeam(teamId)
    } else {
      matches = await repo.findAll()
    }

    if (status && status !== 'live') {
      matches = matches.filter((m) => m.status === status)
    }

    return Response.json(matches, {
      headers: {
        'Cache-Control':
          status === 'live'
            ? 'public, s-maxage=15, stale-while-revalidate=30'
            : 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch {
    // No provider configured or provider unavailable — serve mock data
    let matches = getMockMatches()
    if (teamId) matches = matches.filter((m) => m.homeTeam?.id === teamId || m.awayTeam?.id === teamId)
    if (status) matches = matches.filter((m) => m.status === status)

    return Response.json(matches, {
      headers: { 'X-Data-Source': 'mock', 'Cache-Control': 'no-store' },
    })
  }
}
