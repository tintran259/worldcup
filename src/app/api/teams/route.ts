/**
 * GET /api/teams
 *
 * Trả về list tất cả đội tham gia giải đấu — dùng cho favorites picker.
 */

import { getMatchRepository } from '@/lib/server'
import { handleProviderError } from '../_helpers'
import type { Team } from '@/types/domain.types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Derive teams from fixtures (rẻ hơn /teams endpoint vì đã cache)
    const matches = await getMatchRepository().findAll()
    const map = new Map<string, Team>()

    for (const m of matches) {
      if (m.homeTeam) map.set(m.homeTeam.id, m.homeTeam)
      if (m.awayTeam) map.set(m.awayTeam.id, m.awayTeam)
    }

    const teams = [...map.values()].sort((a, b) => a.name.localeCompare(b.name))

    return Response.json(teams, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (error) {
    return handleProviderError({ route: 'teams', error, mockData: [] as Team[] })
  }
}
