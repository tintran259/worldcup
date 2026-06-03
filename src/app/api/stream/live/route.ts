/**
 * GET /api/stream/live — Server-Sent Events (SSE) cho live match events.
 *
 * Architecture:
 *   - Client mở 1 EventSource → giữ connection HTTP/2
 *   - Server poll match repository mỗi N giây
 *   - Detect delta (score change, status change, new event) → send event
 *   - Client EventSource auto-handle reconnect với Last-Event-ID
 *
 * Trade-offs vs WebSocket:
 *   ✅ Zero deps (native EventSource + Web Streams API)
 *   ✅ Deploy Vercel ngay không cần infrastructure WS
 *   ⚠️  One-way (server → client) — subscribe phải qua query string
 *   ⚠️  Vercel timeout: Hobby 60s, Pro 300s, Enterprise 900s
 *      → Client auto-reconnect khi timeout
 *
 * Scale (1000 users):
 *   - Mỗi connection = 1 server function instance held open
 *   - Server polls Redis cache (NOT external API) → cost = N reads/poll/instance
 *   - Cache TTL = poll interval → minimal Redis reads
 *
 * Khi cần > 1000 concurrent: chuyển sang dedicated WS server (Socket.IO + Redis pub/sub).
 */

import { NextRequest } from 'next/server'
import { getMatchRepository } from '@/lib/server'
import { withCompetition } from '@/lib/config/competitionContext'
import type { Match } from '@/types/domain.types'
import type { WSMatchEvent } from '@/types/events.types'

export const dynamic = 'force-dynamic'
// Edge runtime cho streaming tốt hơn (low memory, fast startup).
// Comment out nếu cần Node-only APIs.
// export const runtime = 'edge'

const POLL_INTERVAL_MS  = 5_000   // Tốc độ check delta
const MAX_DURATION_MS   = 55_000  // Vercel Hobby tier limit (60s)
const HEARTBEAT_MS      = 20_000  // Keep connection alive qua proxies

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
 * Compare 2 snapshots, emit events for changes.
 * Phase 1 implementation: emit SCORE_UPDATE khi score đổi.
 * Phase 2: detect goal/card events từ match.events delta.
 */
function diffMatches(prev: Map<string, Match>, current: Match[]): WSMatchEvent[] {
  const events: WSMatchEvent[] = []
  for (const m of current) {
    const old = prev.get(m.id)
    if (!old) continue
    if (!m.score || !old.score) continue
    if (m.score.home !== old.score.home || m.score.away !== old.score.away) {
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
            const allMatches = await getMatchRepository().findLive()
            const live = filterIds
              ? allMatches.filter(m => filterIds.has(m.id))
              : allMatches

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
      'Content-Type':                'text/event-stream',
      'Cache-Control':               'no-cache, no-transform',
      'Connection':                  'keep-alive',
      'X-Accel-Buffering':           'no',  // Disable proxy buffering (nginx)
    },
  })
}
