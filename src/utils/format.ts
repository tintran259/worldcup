/**
 * General-purpose formatting utilities.
 */

/**
 * Format a zoom level (0–1 range) as a percentage string.
 * e.g. 0.75 → "75%"
 */
export function formatZoomPercent(zoom: number): string {
  return `${Math.round(zoom * 100)}%`
}

/**
 * Return a colour hex for a player rating value.
 * Green ≥ 9.0, Blue ≥ 8.0, Amber otherwise.
 */
export function getRatingColor(rating: number): string {
  if (rating >= 9.0) return '#10b981'
  if (rating >= 8.0) return '#3b82f6'
  return '#f59e0b'
}
