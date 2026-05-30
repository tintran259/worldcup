import { semanticColors, palette, glass } from './colors'
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
} from './typography'
import { space, componentSpacing } from './spacing'
import { shadows, glows } from './shadows'
import { radii } from './radii'
import { mq, breakpointValues } from './breakpoints'

export const theme = {
  colors: semanticColors,
  palette,
  glass,
  fonts: fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  space,
  componentSpacing,
  shadows,
  glows,
  radii,
  mq,
  breakpoints: breakpointValues,
  transitions: {
    fast: 'all 0.12s ease',
    normal: 'all 0.20s ease',
    slow: 'all 0.35s ease',
    spring: 'all 0.40s cubic-bezier(0.16, 1, 0.3, 1)',
    bounce: 'all 0.50s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  zIndex: {
    base: 0,
    card: 10,
    bracket: 20,
    panel: 30,
    tooltip: 50,
    modal: 60,
    overlay: 70,
    toast: 80,
  },
} as const

export type AppTheme = typeof theme
