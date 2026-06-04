/**
 * Match-related utility functions.
 * Pure functions — no side-effects, no imports from stores or components.
 */

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
