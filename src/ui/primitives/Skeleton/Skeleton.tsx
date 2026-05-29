'use client'

import styled, { keyframes, css } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`

interface SkeletonProps {
  $width?: string
  $height?: string
  $radius?: string
  $circle?: boolean
}

export const Skeleton = styled.span<SkeletonProps>`
  display: block;
  width: ${(p) => p.$width ?? '100%'};
  height: ${(p) => p.$height ?? '16px'};
  border-radius: ${(p) => (p.$circle ? '50%' : (p.$radius ?? p.theme.radii.sm))};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.09) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;

  ${(p) =>
    p.$circle &&
    css`
      width: ${p.$width ?? '40px'};
      height: ${p.$width ?? '40px'};
    `}
`

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[4]};
  background: ${(p) => p.theme.colors.bg.surface};
  border-radius: ${(p) => p.theme.radii.card};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
`
