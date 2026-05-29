/**
 * MatchTimer
 *
 * Manages the minute counter for a single live match.
 * Each "tick" corresponds to one match-minute.
 * Tick interval is configurable (1000ms = real-time, 350ms = fast demo).
 *
 * Extra-time: after 90 minutes the timer continues into 90+N territory
 * for a random 3-5 minute stoppage before firing onFullTime.
 */

export interface MatchTimerOptions {
  matchId:     string
  startMinute: number
  tickMs:      number
  onTick:      (matchId: string, minute: number) => void
  onFullTime:  (matchId: string, minute: number) => void
}

export class MatchTimer {
  private readonly opts: MatchTimerOptions
  private minute: number
  private intervalId: ReturnType<typeof setInterval> | null = null
  private stoppageTime = 0
  private inStoppage   = false

  constructor(opts: MatchTimerOptions) {
    this.opts   = opts
    this.minute = opts.startMinute
    // Random stoppage: 3–5 minutes
    this.stoppageTime = 3 + Math.floor(Math.random() * 3)
  }

  // ── Public ──────────────────────────────────────────────────────────────────

  start(): void {
    if (this.intervalId) return
    this.intervalId = setInterval(() => this.tick(), this.opts.tickMs)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  getMinute():  number { return this.minute }
  getMatchId(): string { return this.opts.matchId }
  isRunning():  boolean { return this.intervalId !== null }

  // ── Private ─────────────────────────────────────────────────────────────────

  private tick(): void {
    this.minute++

    if (this.minute === 90) {
      // Enter injury time
      this.inStoppage = true
    }

    this.opts.onTick(this.opts.matchId, this.minute)

    // Full-time: 90 + stoppage
    if (this.inStoppage && this.minute >= 90 + this.stoppageTime) {
      this.stop()
      this.opts.onFullTime(this.opts.matchId, this.minute)
    }
  }
}
