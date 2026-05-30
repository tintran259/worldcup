/**
 * Match timer — đếm từng phút cho một trận đấu đang diễn ra.
 *
 * Sau 90 phút sẽ vào thời gian bù (random 3–5 phút) rồi kết thúc.
 * tickMs càng nhỏ → simulation càng nhanh (350ms = demo speed).
 */

export interface MatchTimerOptions {
  matchId: string
  startMinute: number
  tickMs: number
  onTick: (matchId: string, minute: number) => void
  onFullTime: (matchId: string, minute: number) => void
}

export function createMatchTimer(opts: MatchTimerOptions) {
  let minute = opts.startMinute
  let intervalId: ReturnType<typeof setInterval> | null = null
  let inStoppage = false

  // Thời gian bù ngẫu nhiên 3–5 phút
  const stoppageTime = 3 + Math.floor(Math.random() * 3)

  function tick() {
    minute++
    if (minute === 90) inStoppage = true

    opts.onTick(opts.matchId, minute)

    if (inStoppage && minute >= 90 + stoppageTime) {
      stop()
      opts.onFullTime(opts.matchId, minute)
    }
  }

  function start() {
    if (intervalId) return
    intervalId = setInterval(tick, opts.tickMs)
  }

  function stop() {
    if (!intervalId) return
    clearInterval(intervalId)
    intervalId = null
  }

  return {
    start,
    stop,
    getMinute: () => minute,
    getMatchId: () => opts.matchId,
    isRunning: () => intervalId !== null,
  }
}

export type MatchTimer = ReturnType<typeof createMatchTimer>
