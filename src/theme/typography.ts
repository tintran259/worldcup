export const fontFamilies = {
  display:   "var(--font-outfit), 'Outfit', system-ui, sans-serif",
  heading:   "var(--font-outfit), 'Outfit', system-ui, sans-serif",
  body:      "var(--font-inter), 'Inter', system-ui, sans-serif",
  mono:      "var(--font-jetbrains), 'JetBrains Mono', 'Fira Code', monospace",
  broadcast: "var(--font-outfit), 'Outfit', system-ui, sans-serif",
} as const

export const fontWeights = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const

export const fontSizes = {
  '2xs': '10px',
  xs: '11px',
  sm: '12px',
  base: '14px',
  md: '15px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px',
  '5xl': '32px',
  '6xl': '40px',
  '7xl': '48px',
  '8xl': '64px',
  '9xl': '80px',
} as const

export const lineHeights = {
  none: 1,
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const

export const letterSpacings = {
  tighter: '-0.03em',
  tight:   '-0.01em',
  normal:  '0em',
  wide:    '0.03em',
  wider:   '0.06em',
  widest:  '0.10em',
  stadium: '0.15em',
} as const
