import type { NextConfig } from "next"

/**
 * Environment variable inventory — see .env.example for full docs.
 *
 * Server-only (never NEXT_PUBLIC_):
 *   FOOTBALL_PROVIDER / FOOTBALL_FALLBACK
 *   FOOTBALL_COMPETITION
 *   API_FOOTBALL_KEY | SPORTMONKS_TOKEN | SPORTRADAR_KEY
 *   CACHE_* / FEATURE_* / API_RATE_LIMIT_PER_MINUTE / CORS_ORIGINS
 *
 * Client-safe (NEXT_PUBLIC_ prefix):
 *   NEXT_PUBLIC_APP_ENV
 *   NEXT_PUBLIC_APP_NAME
 *   NEXT_PUBLIC_COMPETITION
 */

const nextConfig: NextConfig = {
  compiler: {
    // styled-components SSR: display names in dev, minified class names in prod
    styledComponents: true,
  },
}

export default nextConfig
