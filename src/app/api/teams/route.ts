/**
 * GET /api/teams
 *
 * Trả về list tất cả đội tham gia giải đấu — dùng cho favorites picker.
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'
import { withCompetition } from '@/lib/config/competitionContext'
import { handleProviderError, skipIfUpcoming } from '../_helpers'
import { cacheHeaders } from '@/lib/cache'
import type { Team } from '@/types/domain.types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const competitionKey = request.nextUrl.searchParams.get('competition')

  return withCompetition(competitionKey, async () => {
    const skip = skipIfUpcoming<Team[]>([])
    if (skip) return skip

    try {
      const matches = await getMatchRepository().findAll()
      const map = new Map<string, Team>()

      for (const m of matches) {
        if (m.homeTeam) map.set(m.homeTeam.id, m.homeTeam)
        if (m.awayTeam) map.set(m.awayTeam.id, m.awayTeam)
      }

      const teams = [...map.values()].sort((a, b) => a.name.localeCompare(b.name))

      return Response.json(teams, { headers: cacheHeaders('TEAMS_LIST') })
    } catch (error) {
      return handleProviderError({ route: 'teams', error, mockData: [] as Team[] })
    }
  })
}
