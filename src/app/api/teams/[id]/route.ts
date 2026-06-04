/**
 * GET /api/teams/:id         — Team profile
 * GET /api/teams/:id?squad=1 — Team profile + squad
 *
 * Strategy:
 *   1. Nếu ID match được mock (slug "MEX", hoặc provider-prefix "af:26" map
 *      được sang slug qua name/code) → dùng mock NGAY, không call API.
 *      Lý do: API-Football endpoint /teams không trả về confederation,
 *      manager, captain, fifaRank — toàn bộ là defaults rỗng. Mock data
 *      curated đầy đủ hơn rất nhiều.
 *
 *   2. Nếu không match mock (team thuộc EPL/UCL real teams) → provider chain.
 *
 *   3. Failure → 404 hoặc mock fallback (production: 503).
 */

import { NextRequest } from 'next/server'
import { getTeamRepository, getStatsRepository } from '@/lib/server'
import { withCompetition } from '@/lib/config/competitionContext'
import { handleProviderError, skipIfUpcoming } from '../../_helpers'
import { getTeam, getTeamPlayers, ALL_TEAMS } from '@/lib/mock'
import { cacheHeaders } from '@/lib/cache'
import type { ExtendedTeam, StarPlayer, TopScorer } from '@/lib/mock/types'

export const dynamic = 'force-dynamic'

interface TeamResponse extends ExtendedTeam {
  squad?: StarPlayer[]
}

const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * Tìm mock team match với ID đầu vào theo nhiều cách:
 *   - Direct slug:    'MEX'       → ALL_TEAMS.find(t => t.id === 'MEX')
 *   - Prefix slug:    'af:MEX'    → strip prefix → match
 *   - Provider numeric: 'af:26'   → không match được (cần adapter lookup)
 *   - Shortname:      'MEX'       → match by id (slug = shortName)
 *
 * Trả null nếu không match.
 */
function resolveMockTeam(id: string): ExtendedTeam | null {
  // Direct match (id is slug like 'MEX')
  let team = getTeam(id)
  if (team) return team

  // Strip provider prefix (af:MEX, sm:MEX, sr:MEX → MEX)
  const stripped = id.replace(/^(af|sm|sr):/, '')
  if (stripped !== id) {
    team = getTeam(stripped)
    if (team) return team
  }

  // Match by shortName (case-insensitive)
  const upper = stripped.toUpperCase()
  team = ALL_TEAMS.find(t => t.shortName.toUpperCase() === upper)
  if (team) return team

  return null
}

function buildMockTeamResponse(team: ExtendedTeam, withSquad: boolean): TeamResponse {
  return withSquad ? { ...team, squad: getTeamPlayers(team.id) } : team
}

/**
 * Normalize last name cho fuzzy matching giữa squad ↔ top scorers.
 * "Dani Olmo" / "Daniel Olmo" / "D. Olmo" → "olmo"
 */
function lastNameKey(name: string): string {
  const last = name.trim().split(/\s+/).pop() ?? ''
  return last
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // strip combining diacritics
    .replace(/[^a-z]/g, '')             // letters only
}

/**
 * Merge top scorer stats vào squad — đảm bảo consistency với stats tab.
 * Match by last name (chuẩn footbal — "L. Yamal" matches "Lamine Yamal").
 */
function enrichSquadWithTopScorers(squad: StarPlayer[], topScorers: TopScorer[]): StarPlayer[] {
  if (topScorers.length === 0) return squad

  const tsMap = new Map<string, TopScorer>()
  for (const ts of topScorers) {
    const key = lastNameKey(ts.player.name)
    if (key.length >= 3) tsMap.set(key, ts)  // skip "Y" / "Mr" etc.
  }

  return squad.map((p) => {
    const key = lastNameKey(p.name)
    const ts = tsMap.get(key)
    if (!ts) return p

    return {
      ...p,
      // Top scorer stats là source of truth — same data như tab Stats
      tournamentGoals:       ts.goals,
      tournamentAssists:     ts.assists,
      goals:                 ts.goals,
      assists:               ts.assists,
      // Keep matches/minutes/rating từ squad nếu top scorer không có
      matchesPlayed:         ts.player.matchesPlayed || p.matchesPlayed,
      minutesPlayed:         ts.player.minutesPlayed || p.minutesPlayed,
      rating:                ts.player.rating        || p.rating,
      // Photo ưu tiên top scorer nếu squad chưa có
      photoUrl:              p.photoUrl ?? ts.player.photoUrl,
    }
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id }          = await params
  const withSquad       = request.nextUrl.searchParams.get('squad') === '1'
  const competitionKey  = request.nextUrl.searchParams.get('competition')

  // ── Mock-first path ─────────────────────────────────────────────────────────
  // Bất kỳ ID nào map được sang mock team → dùng mock luôn (dev mode).
  // Mock data có đầy đủ confederation, manager, captain, FIFA rank, squad...
  // còn API endpoint /teams chỉ trả về name + logo + code.
  if (IS_DEV) {
    const mockTeam = resolveMockTeam(id)
    if (mockTeam) {
      console.log(`[/api/teams/${id}] → Mock-first (resolved to slug "${mockTeam.id}")`)

      // Vẫn cần competition context để fetch top scorers consistency
      return withCompetition(competitionKey, async () => {
        const response = buildMockTeamResponse(mockTeam, withSquad)

        // Enrich squad với top scorers (same source as Stats tab) cho consistency
        if (withSquad && response.squad) {
          const topScorers = await getStatsRepository().findTopScorers(50).catch(() => [])
          response.squad = enrichSquadWithTopScorers(response.squad, topScorers)
        }

        return Response.json(response, { headers: { 'Cache-Control': 'no-store' } })
      })
    }
  }

  // ── Provider chain path (cho ID không match mock) ───────────────────────────
  return withCompetition(competitionKey, async () => {
    const skip = skipIfUpcoming<{ error: string; id: string }>({ error: 'Competition not started', id })
    if (skip) return skip

    try {
      const repo = getTeamRepository()
      const team = await repo.findById(id)

      if (!team) {
        return Response.json({ error: 'Team not found', id }, { status: 404 })
      }

      // Cố enrich với mock data nếu match được theo name/code (production case)
      const mockMatch = ALL_TEAMS.find(
        t => t.name.toLowerCase() === team.name.toLowerCase()
          || t.code.toLowerCase() === team.code.toLowerCase()
      )
      const enriched: ExtendedTeam = mockMatch
        ? {
            ...team,
            confederation: mockMatch.confederation,
            fifaRank:      mockMatch.fifaRank || team.fifaRank,
            group:         mockMatch.group || team.group,
            manager:       mockMatch.manager || team.manager,
            captain:       mockMatch.captain || team.captain,
            homeColor:     mockMatch.homeColor,
            awayColor:     mockMatch.awayColor,
            pot:           mockMatch.pot,
          }
        : team

      const response: TeamResponse = { ...enriched }
      if (withSquad) {
        try {
          // Parallel: squad + topscorers (cached, share với stats tab)
          const [squad, topScorers] = await Promise.all([
            repo.findSquad(id),
            getStatsRepository().findTopScorers(50).catch(() => []),
          ])
          response.squad = enrichSquadWithTopScorers(squad, topScorers)
        } catch (squadErr) {
          console.warn(`[/api/teams/${id}] Squad fetch failed, using mock squad`, squadErr)
          const fallbackSquad = mockMatch ? getTeamPlayers(mockMatch.id) : []
          const topScorers = await getStatsRepository().findTopScorers(50).catch(() => [])
          response.squad = enrichSquadWithTopScorers(fallbackSquad, topScorers)
        }
      }

      return Response.json(response, { headers: cacheHeaders('TEAM_DETAIL') })

    } catch (error) {
      return handleProviderError({
        route: `teams/${id}`,
        error,
        mockData: { error: 'Team not found', id },
      })
    }
  })
}
