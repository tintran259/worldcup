'use client'

import styled, { css } from 'styled-components'

export type BadgeVariant = 'default' | 'live' | 'winner' | 'upcoming' | 'completed'

const variantStyles = {
  default: css`
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    color: ${(p) => p.theme.colors.text.secondary};
  `,
  live: css`
    background: rgba(255, 61, 0, 0.15);
    border-color: rgba(255, 61, 0, 0.4);
    color: ${(p) => p.theme.colors.accent.live};
    animation: live-border-breathe 2s ease-in-out infinite;
  `,
  winner: css`
    background: rgba(240, 165, 0, 0.12);
    border-color: rgba(240, 165, 0, 0.35);
    color: ${(p) => p.theme.colors.text.winner};
  `,
  upcoming: css`
    background: rgba(0, 212, 255, 0.08);
    border-color: rgba(0, 212, 255, 0.25);
    color: ${(p) => p.theme.colors.accent.primary};
  `,
  completed: css`
    background: rgba(136, 153, 180, 0.08);
    border-color: rgba(136, 153, 180, 0.2);
    color: ${(p) => p.theme.colors.text.muted};
  `,
}

export const Badge = styled.span<{ $variant?: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1]};
  padding: ${(p) => p.theme.space[0.5]} ${(p) => p.theme.space[2]};
  border-radius: ${(p) => p.theme.radii.badge};
  border: 1px solid transparent;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  line-height: 1;

  ${(p) => variantStyles[p.$variant ?? 'default']}
`
