/**
 * Shared domain primitives used across multiple football entities.
 * Import from here rather than re-declaring in individual files.
 */

// ── String-branded primitives ──────────────────────────────────────────────────
// Using type aliases rather than branded types keeps them string-assignable
// while clearly expressing intent.

/** ISO 3166-1 alpha-2 lowercase country code, e.g. "br", "de", "gb" */
export type CountryCode = string

/** ISO 8601 date-only string, e.g. "2026-06-11" */
export type ISODate = string

/** ISO 8601 date-time string, e.g. "2026-06-11T20:00:00Z" */
export type ISODateTime = string

/** 0–100 percentage */
export type Percentage = number

/** Human-readable market value, e.g. "€180M", "£100K" */
export type MarketValue = string

// ── Enumerations ───────────────────────────────────────────────────────────────

/** W = Win, D = Draw, L = Loss — used in form strings */
export type FormResult = 'W' | 'D' | 'L'

/** Top-level continental football confederation */
export type Confederation =
  | 'UEFA'       // Europe
  | 'CONMEBOL'   // South America
  | 'CONCACAF'   // North/Central America & Caribbean
  | 'CAF'        // Africa
  | 'AFC'        // Asia
  | 'OFC'        // Oceania

// ── Value objects ──────────────────────────────────────────────────────────────

export interface Coordinate {
  lat: number
  lng: number
}

export interface DateRange {
  from: ISODate
  to: ISODate
}

/**
 * Minimal person reference — used for coaches, captains, referees and
 * similar roles where only identity is required, not a full profile.
 */
export interface PersonRef {
  id?: string
  name: string
  nationality?: string
  countryCode?: CountryCode
}

// ── Generic wrappers ───────────────────────────────────────────────────────────

/** Standard paginated response envelope */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}

/** Any domain entity that carries audit timestamps */
export interface Timestamped {
  createdAt: ISODateTime
  updatedAt: ISODateTime
}
