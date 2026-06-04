/**
 * Date and time formatting utilities.
 * All functions use UTC to avoid timezone discrepancies.
 */

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
