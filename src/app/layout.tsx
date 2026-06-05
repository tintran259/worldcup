import type { Metadata, Viewport } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import { StyledComponentsRegistry } from '@/providers/StyledRegistryProvider'
import { AppThemeProvider } from '@/providers/ThemeProvider'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { getCompetition } from '@/lib/config'

const COMP = getCompetition()

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

// Production URL — Vercel set NEXT_PUBLIC_VERCEL_URL automatically.
const SITE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const TITLE       = `${COMP.name} — Interactive Bracket Explorer`
const DESCRIPTION = `Theo dõi ${COMP.name} real-time với interactive bracket, live scores, top scorers, team stats. 48 teams · 104 matches.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${COMP.name}`,
  },
  description:     DESCRIPTION,
  applicationName: COMP.name,
  authors:         [{ name: 'World Cup 2026 Bracket Explorer' }],
  generator:       'Next.js 16',
  keywords: [
    COMP.name, COMP.shortName, 'World Cup 2026', 'FIFA',
    'bracket', 'tournament', 'football', 'soccer', 'live scores',
    'top scorers', 'team stats', 'group stage', 'knockout',
  ],
  category:     'sports',
  referrer:     'origin-when-cross-origin',
  creator:      'WC2026 Explorer',
  publisher:    'WC2026 Explorer',
  formatDetection: {
    email:     false,
    address:   false,
    telephone: false,
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  // ── Open Graph (Facebook, LinkedIn, Discord, Slack...) ──────────────────────
  openGraph: {
    title:           TITLE,
    description:     DESCRIPTION,
    url:             SITE_URL,
    siteName:        `${COMP.name} Bracket Explorer`,
    type:            'website',
    locale:          'vi_VN',
    alternateLocale: ['en_US'],
    // images auto-derived từ app/opengraph-image.tsx
  },

  // ── Twitter Card ────────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       TITLE,
    description: DESCRIPTION,
    // images auto-derived từ app/twitter-image.tsx
  },

  // ── Web app manifest ────────────────────────────────────────────────────────
  manifest: '/manifest.webmanifest',

  // ── Alternates ──────────────────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)',  color: '#0f172a' },
  ],
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme:  'dark light',
  viewportFit:  'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <AppThemeProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </AppThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
