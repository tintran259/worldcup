/**
 * Date and time formatting utilities.
 * All functions use UTC to avoid timezone discrepancies.
 */

/**
 * Format an ISO datetime string as "DD/MM · HH:MM".
 * Used on bracket match cards for scheduled fixtures.
 */
export function formatMatchSchedule(iso: string): string {
  const d   = new Date(iso)
  const day = d.getUTCDate().toString().padStart(2, '0')
  const mon = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  const hh  = d.getUTCHours().toString().padStart(2, '0')
  const mm  = d.getUTCMinutes().toString().padStart(2, '0')
  return `${day}/${mon} · ${hh}:${mm}`
}

/**
 * Format an ISO datetime string as "DD Mon YYYY".
 * Used on match history cards (e.g. "15 Jun 2026").
 */
export function formatMatchDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day:      '2-digit',
    month:    'short',
    year:     'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Format an ISO datetime string as "HH:MM".
 * Used alongside formatMatchDate for kickoff time display.
 */
export function formatMatchTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour:     '2-digit',
    minute:   '2-digit',
    timeZone: 'UTC',
  })
}
