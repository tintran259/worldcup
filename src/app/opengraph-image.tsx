/**
 * Dynamic Open Graph image cho social sharing (1200×630).
 *
 * Satori (next/og) hỗ trợ PNG/JPEG/AVIF — KHÔNG hỗ trợ WebP.
 * Logo source: public/wc2026-logo.png (converted từ webp).
 */

import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getCompetition } from '@/lib/config'

export const alt = 'FIFA World Cup 2026 — Interactive Bracket Explorer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-dynamic'

export default async function OGImage() {
  const comp = getCompetition()

  let logoDataUrl: string | null = null
  try {
    const filePath = join(process.cwd(), 'public', 'wc2026-logo.png')
    const buf = readFileSync(filePath)
    logoDataUrl = `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    // Logo file missing — fallback emoji
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0f172a',
        }}
      >
        {/* Background gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            background:
              'linear-gradient(135deg, rgba(30,64,175,0.5) 0%, rgba(15,23,42,0.3) 50%, rgba(180,83,9,0.4) 100%)',
          }}
        />

        {/* Left: Logo */}
        <div
          style={{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            position: 'relative',
          }}
        >
          {logoDataUrl ? (
            <img
              src={logoDataUrl}
              alt="WC2026"
              width={440}
              height={540}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div style={{ fontSize: 300, display: 'flex' }}>🏆</div>
          )}
        </div>

        {/* Right: Text */}
        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 40,
            position: 'relative',
          }}
        >
          {/* FIFA badge */}
          <div
            style={{
              display: 'flex',
              padding: '8px 18px',
              background: 'rgba(251,191,36,0.20)',
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              color: '#fde68a',
              marginBottom: 20,
            }}
          >
            FIFA · 23RD EDITION
          </div>

          {/* Tournament name */}
          <div
            style={{
              display: 'flex',
              fontSize: 58,
              fontWeight: 900,
              color: 'white',
              marginBottom: 16,
            }}
          >
            {comp.name}
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#cbd5e1',
              marginBottom: 8,
            }}
          >
            Interactive Bracket Explorer
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              color: '#94a3b8',
              marginBottom: 28,
            }}
          >
            48 Teams · 104 Matches · Live Tracking
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                padding: '8px 16px',
                background: 'rgba(239,68,68,0.20)',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#fca5a5',
              }}
            >
              ● LIVE
            </div>
            <div
              style={{
                display: 'flex',
                padding: '8px 16px',
                background: 'rgba(59,130,246,0.20)',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#93c5fd',
              }}
            >
              BRACKET
            </div>
            <div
              style={{
                display: 'flex',
                padding: '8px 16px',
                background: 'rgba(34,197,94,0.20)',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#86efac',
              }}
            >
              STATS
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            display: 'flex',
            background:
              'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #3b82f6 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
