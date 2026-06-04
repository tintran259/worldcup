/**
 * GET /api/stats
 *
 * Trả về tổng quan giải đấu: top scorers, team goals, summary.
 * Tổng hợp từ matches + top scorers endpoint.
 */

import { NextRequest } from 'next/server'
import { getStatsRepository, getMatchRepository } from '@/lib/server'
import { withCompetition } from '@/lib/config/competitionContext'
import { handleProviderError, skipIfUpcoming } from '../_helpers'
import { cacheHeaders } from '@/lib/cache'
import type { TopScorer } from '@/lib/mock/types'
import type { TeamGoals, StatsSummary } from '@/lib/repositories/stats'

export const dynamic = 'force-dynamic'

export interface StatsResponse {
  summary: StatsSummary
  topScorers: TopScorer[]
  teamGoals: TeamGoals[]
}

export async function GET(request: NextRequest) {
  const competitionKey = request.nextUrl.searchParams.get('competition')

  return withCompetition(competitionKey, async () => {
    const skip = skipIfUpcoming<StatsResponse>({
      summary: { goalsScored: 0, matchesPlayed: 0, goalsPerMatch: 0, teamsRemaining: 0 },
      topScorers: [],
      teamGoals: [],
    })
    if (skip) return skip

  try {
    const statsRepo = getStatsRepository()
    const matchRepo = getMatchRepository()

    const [allMatches, topScorers] = await Promise.all([
      matchRepo.findAll(),
      // Top 20 để khi user filter favorites vẫn thấy cầu thủ ngoài top 5
      statsRepo.findTopScorers(20),
    ])

    const data: StatsResponse = {
      summary: statsRepo.computeSummary(allMatches),
      topScorers,
      // Trả về top 32 — frontend tự slice/filter theo favorites
      teamGoals: statsRepo.computeTeamGoals(allMatches, 32),
    }

    return Response.json(data, { headers: cacheHeaders('STATS') })
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
  })
}
