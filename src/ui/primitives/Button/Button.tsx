'use client'

import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'ghost' | 'live' | 'danger' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const sizeStyles = {
  sm: css`
    height: 30px;
    padding: 0 ${(p) => p.theme.space[3]};
    font-size: ${(p) => p.theme.fontSizes.xs};
  `,
  md: css`
    height: 38px;
    padding: 0 ${(p) => p.theme.space[4]};
    font-size: ${(p) => p.theme.fontSizes.sm};
  `,
  lg: css`
    height: 46px;
    padding: 0 ${(p) => p.theme.space[6]};
    font-size: ${(p) => p.theme.fontSizes.base};
  `,
}

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, #006b8f 0%, #00a8cc 100%);
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: ${(p) => p.theme.colors.text.primary};
    box-shadow: 0 2px 12px rgba(0, 168, 204, 0.3);
    &:hover {
      background: linear-gradient(135deg, #00a8cc 0%, #00d4ff 100%);
      box-shadow: ${(p) => p.theme.glows.cyanMd};
    }
    &:active { transform: scale(0.98); }
  `,
  ghost: css`
    background: transparent;
    border: 1px solid ${(p) => p.theme.colors.border.glass};
    color: ${(p) => p.theme.colors.text.secondary};
    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
      color: ${(p) => p.theme.colors.text.primary};
    }
  `,
  live: css`
    background: linear-gradient(135deg, rgba(255, 61, 0, 0.2), rgba(255, 107, 53, 0.3));
    border: 1px solid rgba(255, 61, 0, 0.4);
    color: ${(p) => p.theme.colors.accent.live};
    &:hover {
      background: linear-gradient(135deg, rgba(255, 61, 0, 0.35), rgba(255, 107, 53, 0.45));
      box-shadow: ${(p) => p.theme.glows.liveMd};
    }
  `,
  danger: css`
    background: rgba(255, 23, 68, 0.15);
    border: 1px solid rgba(255, 23, 68, 0.35);
    color: #ff1744;
    &:hover {
      background: rgba(255, 23, 68, 0.25);
      box-shadow: 0 0 16px rgba(255, 23, 68, 0.3);
    }
  `,
  outline: css`
    background: transparent;
    border: 1px solid ${(p) => p.theme.colors.border.active};
    color: ${(p) => p.theme.colors.accent.primary};
    &:hover {
      background: rgba(0, 212, 255, 0.08);
      box-shadow: ${(p) => p.theme.glows.cyanSm};
    }
  `,
}

export const Button = styled.button<{ $variant?: ButtonVariant; $size?: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[2]};
  border-radius: ${(p) => p.theme.radii.button};
  font-family: ${(p) => p.theme.fonts.body};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  cursor: pointer;
  transition: ${(p) => p.theme.transitions.normal};
  white-space: nowrap;
  outline: none;
  border: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px ${(p) => p.theme.colors.accent.primary};
  }
  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${(p) => sizeStyles[p.$size ?? 'md']}
  ${(p) => variantStyles[p.$variant ?? 'primary']}
`
