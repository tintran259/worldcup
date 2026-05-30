/**
 * GET /api/matches/:id
 *
 * Returns a single match with full event timeline.
 * Automatically uses shorter cache TTL when match is live.
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) return Response.json({ error: 'Match ID required' }, { status: 400 })

    const match = await getMatchRepository().findById(id)
    if (!match) return Response.json({ error: 'Match not found' }, { status: 404 })

    const maxAge = match.status === 'live' ? 15 : 60

    return Response.json(match, {
      headers: {
        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
      },
    })

  } catch (err) {
    console.error('[GET /api/matches/:id]', err)
    return Response.json(
      { error: 'Failed to fetch match', code: 'MATCH_FETCH_ERROR' },
      { status: 503 },
    )
  }
}
