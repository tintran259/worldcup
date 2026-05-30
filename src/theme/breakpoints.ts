export const breakpointValues = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1600,
} as const

export const mq = {
  sm: `@media (min-width: 480px)`,
  md: `@media (min-width: 768px)`,
  lg: `@media (min-width: 1024px)`,
  xl: `@media (min-width: 1280px)`,
  '2xl': `@media (min-width: 1600px)`,
  maxSm: `@media (max-width: 479px)`,
  maxMd: `@media (max-width: 767px)`,
  maxLg: `@media (max-width: 1023px)`,
  maxXl: `@media (max-width: 1279px)`,
  touch: '@media (hover: none) and (pointer: coarse)',
  pointer: '@media (hover: hover) and (pointer: fine)',
  motion: '@media (prefers-reduced-motion: no-preference)',
  noMotion: '@media (prefers-reduced-motion: reduce)',
} as const
