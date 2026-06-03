/**
 * GET /api/tournament/bracket
 *
 * Returns: BracketRound[] — matches grouped by round in tournament order.
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'
import { MOCK_ROUNDS } from '@/lib/mock'
import { withCompetition } from '@/lib/config/competitionContext'
import { handleProviderError } from '../../_helpers'
import { cacheHeaders } from '@/lib/cache'
import type { BracketRound, Match, TournamentRound } from '@/types/domain.types'

export const dynamic = 'force-dynamic'

// Bracket UI chỉ hiển thị các vòng knockout, không hiển thị Group Stage
// (vì group stage có 48 trận → bracket sẽ bị broken).
// Group standings được hiển thị riêng trong section Standings.
const ROUND_ORDER: TournamentRound[] = [
  'round-of-32', 'round-of-16',
  'quarter-final', 'semi-final', 'third-place', 'final',
]

const ROUND_LABELS: Record<TournamentRound, string> = {
  'group':         'Group Stage',
  'round-of-32':   'Round of 32',
  'round-of-16':   'Round of 16',
  'quarter-final': 'Quarter-Finals',
  'semi-final':    'Semi-Finals',
  'third-place':   'Third Place',
  'final':         'Final',
}

function groupIntoRounds(matches: Match[]): BracketRound[] {
  const byRound = new Map<TournamentRound, Match[]>()
  for (const match of matches) {
    const round = match.round as TournamentRound
    if (!byRound.has(round)) byRound.set(round, [])
    byRound.get(round)!.push(match)
  }

  return ROUND_ORDER
    .filter((r) => byRound.has(r))
    .map((r) => ({
      id: r,
      label: ROUND_LABELS[r],
      matchCount: byRound.get(r)!.length,
      matches: byRound.get(r)!,
    }))
}

export async function GET(request: NextRequest) {
  const competitionKey = request.nextUrl.searchParams.get('competition')

  return withCompetition(competitionKey, async () => {
    try {
      const matches = await getMatchRepository().findAll()
      const rounds  = groupIntoRounds(matches)
      // Empty là OK — section sẽ render empty state với title "Tournament Bracket".
      // Popup chỉ fire khi catch (lỗi thật từ provider).
      return Response.json(rounds, { headers: cacheHeaders('BRACKET') })
    } catch (error) {
      return handleProviderError({
        route:    'tournament/bracket',
        error,
        mockData: MOCK_ROUNDS,
      })
    }
  })
}
