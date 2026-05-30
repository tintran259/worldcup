/**
 * API-related constants.
 *
 * Centralises refetch intervals and cache TTLs so they're easy to adjust
 * without hunting through individual hook files.
 */

/** Live matches: re-fetch every 30 seconds. */
export const REFETCH_LIVE_MS = 30_000

/** Bracket rounds: re-fetch every 60 seconds. */
export const REFETCH_BRACKET_MS = 60_000

/** Standings: re-fetch every 5 minutes (slow-changing data). */
export const REFETCH_STANDINGS_MS = 300_000

/** Cache TTL for live data — treat as always stale. */
export const STALE_LIVE_MS = 0

/** Cache TTL for completed matches — stable for 60 seconds. */
export const STALE_COMPLETED_MS = 60_000

/** Cache TTL for standings — stable for 5 minutes. */
export const STALE_STANDINGS_MS = 300_000
