export const palette = {
  // ── Light neutrals ────────────────────────────────────────────────────────
  snow: '#ffffff',
  ice: '#f8fafc',
  mist: '#f1f5f9',
  cloud: '#e2e8f0',
  fog: '#cbd5e1',
  ash: '#94a3b8',
  slate: '#64748b',
  stone: '#475569',
  granite: '#334155',
  obsidian: '#1e293b',
  void: '#0f172a',

  // ── Live / Danger ─────────────────────────────────────────────────────────
  live600: '#dc2626',
  live500: '#ef4444',
  live400: '#f87171',
  live100: '#fee2e2',

  // ── Gold / Winner ─────────────────────────────────────────────────────────
  gold600: '#b45309',
  gold500: '#d97706',
  gold400: '#f59e0b',
  gold100: '#fef9c3',

  // ── FIFA Blue / Active ────────────────────────────────────────────────────
  blue800: '#1e40af',
  blue700: '#1d4ed8',
  blue600: '#2563eb',
  blue500: '#3b82f6',
  blue400: '#60a5fa',
  blue100: '#eff6ff',

  // ── Emerald / Success ─────────────────────────────────────────────────────
  emerald700: '#047857',
  emerald600: '#059669',
  emerald500: '#10b981',
  emerald100: '#ecfdf5',

  // ── Legacy dark values (used by old components still in the tree) ─────────
  deep: '#050a14',
  midnight: '#080f1e',
  navy: '#0a1628',
  grey100: '#f0f4ff',
  grey200: '#c8d4e8',
  grey300: '#8899b4',
  grey400: '#546070',
  white: '#ffffff',
} as const

export const semanticColors = {
  bg: {
    base: palette.ice,       // #f8fafc  — page background
    surface: palette.snow,      // #ffffff  — card / panel surface
    elevated: palette.mist,      // #f1f5f9  — elevated elements
    overlay: palette.cloud,     // #e2e8f0  — overlays
    glass: 'rgba(255, 255, 255, 0.80)',
  },
  text: {
    primary: palette.void,     // #0f172a
    secondary: palette.granite,  // #334155
    muted: palette.slate,    // #64748b
    disabled: palette.ash,      // #94a3b8
    inverse: palette.snow,     // #ffffff
    live: palette.live500,  // #ef4444
    winner: palette.gold500,  // #d97706
  },
  border: {
    subtle: palette.cloud,      // #e2e8f0
    default: palette.fog,        // #cbd5e1
    active: palette.blue600,    // #2563eb
    live: palette.live500,    // #ef4444
    winner: palette.gold500,    // #d97706
    glass: 'rgba(0, 0, 0, 0.07)',
  },
  accent: {
    primary: palette.blue600,    // #2563eb — FIFA blue
    live: palette.live500,    // #ef4444
    winner: palette.gold500,    // #d97706
    trail: palette.emerald500, // #10b981
    danger: palette.live600,    // #dc2626
  },
  bracket: {
    line: palette.cloud,        // #e2e8f0
    lineActive: palette.blue600,      // #2563eb
    lineWinner: palette.emerald500,   // #10b981
    nodeIdle: palette.snow,         // #ffffff
    nodeLive: palette.live100,      // #fee2e2
    nodeWinner: palette.gold100,      // #fef9c3
  },
} as const

export const glass = {
  sm: {
    background: 'rgba(255, 255, 255, 0.60)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
  },
  md: {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(0, 0, 0, 0.07)',
  },
  lg: {
    background: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
  frosted: {
    background: 'rgba(248, 250, 252, 0.88)',
    backdropFilter: 'blur(32px) saturate(180%)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
} as const
