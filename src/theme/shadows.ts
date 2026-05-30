export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0,0,0,0.06)',
  sm: '0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  md: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  lg: '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05)',
  xl: '0 16px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
  '2xl': '0 24px 64px rgba(0,0,0,0.14)',
  insetSm: 'inset 0 1px 3px rgba(0,0,0,0.06)',
  insetMd: 'inset 0 2px 6px rgba(0,0,0,0.08)',
  card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  cardHover: '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
  cardLive: '0 2px 12px rgba(239,68,68,0.14), 0 0 0 1px rgba(239,68,68,0.20)',
  cardWinner: '0 2px 12px rgba(217,119,6,0.14), 0 0 0 1px rgba(217,119,6,0.20)',
  panel: '4px 0 24px rgba(0,0,0,0.08)',
} as const

export const glows = {
  // Colored outlines / subtle drop-shadows — replaces neon glows on light bg
  cyanSm: '0 0 0 2px rgba(37, 99, 235, 0.20)',
  cyanMd: '0 0 0 3px rgba(37, 99, 235, 0.25), 0 4px 14px rgba(37, 99, 235, 0.12)',
  cyanLg: '0 0 0 3px rgba(37, 99, 235, 0.30), 0 8px 24px rgba(37, 99, 235, 0.16)',
  mintSm: '0 0 0 2px rgba(16, 185, 129, 0.20)',
  mintMd: '0 0 0 3px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(16, 185, 129, 0.12)',
  mintLg: '0 0 0 3px rgba(16, 185, 129, 0.30), 0 8px 24px rgba(16, 185, 129, 0.16)',
  goldSm: '0 0 0 2px rgba(217, 119, 6, 0.20)',
  goldMd: '0 0 0 3px rgba(217, 119, 6, 0.25), 0 4px 14px rgba(217, 119, 6, 0.12)',
  goldLg: '0 0 0 3px rgba(217, 119, 6, 0.30), 0 8px 24px rgba(217, 119, 6, 0.16)',
  liveSm: '0 0 0 2px rgba(239, 68, 68, 0.20)',
  liveMd: '0 0 0 3px rgba(239, 68, 68, 0.25), 0 4px 14px rgba(239, 68, 68, 0.12)',
  liveLg: '0 0 0 3px rgba(239, 68, 68, 0.30), 0 8px 24px rgba(239, 68, 68, 0.16)',
  svgCyan: 'drop-shadow(0 0 2px rgba(37, 99, 235, 0.60))',
  svgMint: 'drop-shadow(0 0 2px rgba(16, 185, 129, 0.60))',
  svgGold: 'drop-shadow(0 0 2px rgba(217, 119, 6, 0.60))',
  // No neon text-shadows on light background
  textCyan: 'none',
  textGold: 'none',
  textLive: 'none',
} as const
