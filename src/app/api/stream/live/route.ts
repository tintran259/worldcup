/**
 * GET /api/stream/live — Server-Sent Events (SSE) cho live match events.
 *
 * Architecture (cache-only — quota optimized):
 *   - Client mở 1 EventSource → giữ connection HTTP/2
 *   - Server đọc cache (Redis/memory) every N giây — KHÔNG gọi external API
 *   - Cache được populate bởi /api/matches?status=live khi user load app
 *   - Detect delta (score change, status change) → emit events
 *   - Client EventSource auto-handle reconnect với Last-Event-ID
 *
 * Quota impact:
 *   - SSE = pure cache reader, zero direct API calls
 *   - API hit chỉ khi cache miss (do /api/matches refetch sau TTL expire)
 *   - 1000 SSE clients × 0 API call = 0 quota cost
 *   - Cache reads cost (Redis): 1000 users × poll/N = N reads/N seconds
 *
 * Events emitted:
 *   - GOAL          khi score tăng (derive team từ home/away delta)
 *   - MATCH_START   khi status: upcoming → live
 *   - MATCH_END     khi status: live → completed
 *   - SCORE_UPDATE  fallback nếu không xác định được team scoring
 *
 * Trade-offs vs WebSocket:
 *   ✅ Zero deps (native EventSource + Web Streams API)
 *   ✅ Deploy Vercel ngay không cần infrastructure WS
 *   ⚠️  One-way (server → client) — subscribe phải qua query string
 *   ⚠️  Vercel timeout: Hobby 60s, Pro 300s, Enterprise 900s
 *      → Client auto-reconnect khi timeout
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'
import { withCompetition, isCurrentCompetitionUpcoming } from '@/lib/config/competitionContext'
import type { Match } from '@/types/domain.types'
import type { WSMatchEvent } from '@/types/events.types'

export const dynamic = 'force-dynamic'

// ── Tuning constants ──────────────────────────────────────────────────────────
// POLL_INTERVAL: cache-only reads → có thể poll thường xuyên hơn 5s (no API cost)
//   nhưng vẫn giữ 10s để giảm Redis read pressure cho free tier Upstash.
//   1000 SSE users × 6 reads/min/user = 6k reads/min = 360k reads/hour.
//   Upstash free: 10k cmd/day → cần upgrade Redis tier để scale.
// MAX_DURATION: Vercel Hobby tier max streaming 60s.
const POLL_INTERVAL_MS = 10_000
const MAX_DURATION_MS  = 55_000
const HEARTBEAT_MS     = 20_000

/**
 * Format Server-Sent Events:
 *   data: {json}\n\n
 *   event: name\ndata: {json}\n\n
 *   id: 123\ndata: {json}\n\n
 */
function sseFormat(data: unknown, opts: { event?: string; id?: string | number } = {}): string {
  const lines: string[] = []
  if (opts.id != null)    lines.push(`id: ${opts.id}`)
  if (opts.event)         lines.push(`event: ${opts.event}`)
  lines.push(`data: ${JSON.stringify(data)}`)
  return lines.join('\n') + '\n\n'
}

/**
 * Compare 2 snapshots, emit semantic events for changes.
 *
 * Detection:
 *   - GOAL:        home/away score tăng (1 event per goal, derived team)
 *   - MATCH_START: status upcoming → live
 *   - MATCH_END:   status live → completed
 *   - SCORE_UPDATE: fallback nếu cả 2 score đều đổi cùng lúc (edge case)
 */
function diffMatches(prev: Map<string, Match>, current: Match[]): WSMatchEvent[] {
  const events: WSMatchEvent[] = []

  for (const m of current) {
    const old = prev.get(m.id)
    if (!old) continue

    // ── Status transitions ────────────────────────────────────────────────────
    if (old.status !== 'live' && m.status === 'live') {
      events.push({
        type:       'MATCH_START',
        matchId:    m.id,
        homeTeamId: m.homeTeam?.id ?? '',
        awayTeamId: m.awayTeam?.id ?? '',
      })
    } else if (old.status === 'live' && m.status === 'completed') {
      events.push({
        type:      'MATCH_END',
        matchId:   m.id,
        homeScore: m.score?.home ?? 0,
        awayScore: m.score?.away ?? 0,
        winnerId:  m.winnerId,
      })
    }

    // ── Score changes (chỉ khi đang live) ─────────────────────────────────────
    if (m.status !== 'live' || !m.score || !old.score) continue

    const homeDelta = m.score.home - old.score.home
    const awayDelta = m.score.away - old.score.away

    if (homeDelta > 0 && awayDelta === 0 && m.homeTeam) {
      // Home team scored
      events.push({
        type:          'GOAL',
        matchId:       m.id,
        teamId:        m.homeTeam.id,
        teamCode:      m.homeTeam.code,
        playerId:      'unknown',  // /fixtures không trả player → cần /fixtures/events (expensive)
        playerName:    'Goal',
        minute:        m.minute ?? 0,
        homeScore:     m.score.home,
        awayScore:     m.score.away,
        homeTeamName:  m.homeTeam.name,
        awayTeamName:  m.awayTeam?.name ?? '',
      })
    } else if (awayDelta > 0 && homeDelta === 0 && m.awayTeam) {
      // Away team scored
      events.push({
        type:          'GOAL',
        matchId:       m.id,
        teamId:        m.awayTeam.id,
        teamCode:      m.awayTeam.code,
        playerId:      'unknown',
        playerName:    'Goal',
        minute:        m.minute ?? 0,
        homeScore:     m.score.home,
        awayScore:     m.score.away,
        homeTeamName:  m.homeTeam?.name ?? '',
        awayTeamName:  m.awayTeam.name,
      })
    } else if (homeDelta !== 0 || awayDelta !== 0) {
      // Both changed or unclear → generic update
      events.push({
        type:      'SCORE_UPDATE',
        matchId:   m.id,
        homeScore: m.score.home,
        awayScore: m.score.away,
        minute:    m.minute ?? 0,
      })
    }
  }

  return events
}

export async function GET(request: NextRequest) {
  const competitionKey = request.nextUrl.searchParams.get('competition')
  const matchIdsParam  = request.nextUrl.searchParams.get('matchIds')
  const filterIds      = matchIdsParam ? new Set(matchIdsParam.split(',')) : null

  const encoder = new TextEncoder()
  const start   = Date.now()
  let   eventId = 0

  const stream = new ReadableStream({
    async start(controller) {
      // Initial connect event
      controller.enqueue(encoder.encode(sseFormat({ type: 'CONNECTED', timestamp: Date.now() }, {
        event: 'open',
        id:    ++eventId,
      })))

      let prev: Map<string, Match> = new Map()
      let heartbeatTimer: ReturnType<typeof setInterval> | null = null
      let pollTimer:      ReturnType<typeof setInterval> | null = null

      function cleanup() {
        if (heartbeatTimer) clearInterval(heartbeatTimer)
        if (pollTimer)      clearInterval(pollTimer)
        try { controller.close() } catch { /* already closed */ }
      }

      // Detect client disconnect
      request.signal.addEventListener('abort', cleanup)

      async function tick() {
        // Auto-close khi gần timeout (client sẽ reconnect)
        if (Date.now() - start > MAX_DURATION_MS) {
          controller.enqueue(encoder.encode(sseFormat({ reason: 'timeout' }, { event: 'reconnect' })))
          cleanup()
          return
        }

        try {
          await withCompetition(competitionKey, async () => {
            // Defense-in-depth: skip nếu competition chưa bắt đầu
            if (isCurrentCompetitionUpcoming()) return

            // CACHE-ONLY: KHÔNG gọi findLive() (sẽ trigger API call).
            // Cache được refresh bởi /api/matches?status=live khi user load app.
            // SSE chỉ broadcast từ cache → zero quota cost.
            const cached = await getMatchRepository().findLiveFromCache()
            if (!cached) return  // cache empty → no events to emit, wait next tick

            const live = filterIds
              ? cached.filter(m => filterIds.has(m.id))
              : cached

            // Diff với snapshot trước → emit changes
            const events = diffMatches(prev, live)
            for (const event of events) {
              controller.enqueue(encoder.encode(sseFormat(event, { id: ++eventId })))
            }

            // Update snapshot
            prev = new Map(live.map(m => [m.id, m]))
          })
        } catch (err) {
          console.warn('[SSE] poll error:', (err as Error).message)
          // Tiếp tục poll — không close stream do 1 lần fail
        }
      }

      // Heartbeat (keep-alive qua CDN proxies có idle timeout)
      heartbeatTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch { cleanup() }
      }, HEARTBEAT_MS)

      // Poll loop
      await tick()  // Immediate first tick
      pollTimer = setInterval(tick, POLL_INTERVAL_MS)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache, no-transform',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
