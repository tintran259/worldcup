/**
 * GET /api/standings          — All group stages
 * GET /api/standings?group=A  — Single group
 */

import { NextRequest } from 'next/server'
import { getStandingsRepository } from '@/lib/server'
import { GROUP_STANDINGS, GROUP_MAP } from '@/lib/mock'
import { handleProviderError } from '../_helpers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('group')

  try {
    const repo = getStandingsRepository()
    const data = groupId ? await repo.findGroup(groupId) : await repo.findAllGroups()

    if (groupId && !data) {
      return Response.json({ error: `Group ${groupId} not found` }, { status: 404 })
    }

    return Response.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (error) {
    const mockData = groupId ? (GROUP_MAP.get(groupId) ?? null) : GROUP_STANDINGS

    if (groupId && !mockData) {
      return Response.json({ error: `Group ${groupId} not found` }, { status: 404 })
    }

    return handleProviderError({ route: 'standings', error, mockData })
  }
}
