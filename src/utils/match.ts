/**
 * Match-related utility functions.
 * Pure functions — no side-effects, no imports from stores or components.
 */

import type { Match } from '@/types/domain.types'

/**
 * Convert an ISO-3166-1 alpha-2 country code to its emoji flag.
 * e.g. "BR" → "🇧🇷"
 */
export function countryCodeToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('')
}

/**
 * Determine the match result from the perspective of one team.
 * Returns null if the match hasn't finished.
 */
export function getMatchResult(
  match: Match,
  teamId: string,
): 'W' | 'D' | 'L' | null {
  if (match.status !== 'completed' || !match.score) return null
  if (match.winnerId) return match.winnerId === teamId ? 'W' : 'L'

  const isHome = match.homeTeam?.id === teamId
  const ts     = isHome ? match.score.home : match.score.away
  const os     = isHome ? match.score.away : match.score.home

  if (ts > os) return 'W'
  if (ts < os) return 'L'
  return 'D'
}

/**
 * Format a score as "home — away" from the perspective of a given team.
 * e.g. team is away: "2 — 1" means the team scored 2.
 */
export function formatScoreForTeam(match: Match, teamId: string): string {
  if (!match.score) return '— : —'
  const isHome = match.homeTeam?.id === teamId
  return isHome
    ? `${match.score.home} — ${match.score.away}`
    : `${match.score.away} — ${match.score.home}`
}

/**
 * Return the opponent team for a given team in a match.
 */
export function getOpponent(
  match: Match,
  teamId: string,
): { name: string; code: string } | null {
  const opp = match.homeTeam?.id === teamId ? match.awayTeam : match.homeTeam
  if (!opp) return null
  return { name: opp.shortName, code: opp.code }
}

/**
 * Generate initials from a player/team name for avatar fallback.
 * "Vinícius Jr." → "VJ"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
