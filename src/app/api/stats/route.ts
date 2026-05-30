/**
 * GET /api/stats
 *
 * Trả về tổng quan giải đấu: top scorers, team goals, summary.
 * Tổng hợp từ matches + top scorers endpoint.
 */

import { getStatsRepository, getMatchRepository } from '@/lib/server'
import { handleProviderError } from '../_helpers'
import type { TopScorer } from '@/lib/mock/types'
import type { TeamGoals, StatsSummary } from '@/lib/repositories/stats'

export const dynamic = 'force-dynamic'

export interface StatsResponse {
  summary: StatsSummary
  topScorers: TopScorer[]
  teamGoals: TeamGoals[]
}

export async function GET() {
  try {
    const statsRepo = getStatsRepository()
    const matchRepo = getMatchRepository()

    const [allMatches, topScorers] = await Promise.all([
      matchRepo.findAll(),
      statsRepo.findTopScorers(5),
    ])

    const data: StatsResponse = {
      summary: statsRepo.computeSummary(allMatches),
      topScorers,
      teamGoals: statsRepo.computeTeamGoals(allMatches, 5),
    }

    return Response.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (error) {
    // Empty fallback — frontend sẽ hide section nếu rỗng
    return handleProviderError({
      route: 'stats',
      error,
      mockData: {
        summary: { goalsScored: 0, matchesPlayed: 0, goalsPerMatch: 0, teamsRemaining: 0 },
        topScorers: [],
        teamGoals: [],
      },
    })
  }
}
