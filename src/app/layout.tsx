import type { Metadata, Viewport } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import { StyledComponentsRegistry } from '@/providers/StyledRegistryProvider'
import { AppThemeProvider } from '@/providers/ThemeProvider'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'

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

export const metadata: Metadata = {
  title: {
    default: 'FIFA World Cup 2026',
    template: '%s | FIFA World Cup 2026',
  },
  description:
    'Interactive FIFA World Cup 2026 tournament bracket explorer with live match tracking and realtime updates.',
  keywords: ['FIFA', 'World Cup', '2026', 'bracket', 'tournament', 'football', 'soccer'],
  openGraph: {
    title: 'FIFA World Cup 2026 Bracket Explorer',
    description: 'Follow the tournament live with an interactive bracket explorer.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026 Bracket Explorer',
  },
}

export const viewport: Viewport = {
  themeColor: '#f8fafc',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
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
