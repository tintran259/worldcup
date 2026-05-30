/**
 * GET /api/teams/:id         — Team profile
 * GET /api/teams/:id?squad=1 — Team profile + squad
 */

import { NextRequest } from 'next/server'
import { getTeamRepository } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id }     = await params
    const withSquad  = request.nextUrl.searchParams.get('squad') === '1'

    const repo = getTeamRepository()
    const team = await repo.findById(id)
    if (!team) return Response.json({ error: 'Team not found' }, { status: 404 })

    const response: Record<string, unknown> = { ...team }

    if (withSquad) {
      response.squad = await repo.findSquad(id)
    }

    return Response.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })

  } catch (err) {
    console.error('[GET /api/teams/:id]', err)
    return Response.json({ error: 'Failed to fetch team' }, { status: 503 })
  }
}
