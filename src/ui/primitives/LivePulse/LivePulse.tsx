'use client'

import React from 'react'
import styled, { keyframes } from 'styled-components'

const ringExpand = keyframes`
  0%   { transform: scale(1);   opacity: 1; }
  70%  { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
`

const dotPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
`

type PulseSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<PulseSize, string> = {
  sm: '6px',
  md: '8px',
  lg: '10px',
}

const Wrapper = styled.span<{ $size: PulseSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => sizeMap[p.$size]};
  height: ${(p) => sizeMap[p.$size]};
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent.live};
    animation: ${dotPulse} 2s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent.live};
    animation: ${ringExpand} 2s ease-out infinite;
  }
`

const LiveBadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1.5]};
  padding: ${(p) => p.theme.space[0.5]} ${(p) => p.theme.space[2]};
  border-radius: ${(p) => p.theme.radii.badge};
  background: rgba(255, 61, 0, 0.15);
  border: 1px solid rgba(255, 61, 0, 0.4);
  animation: live-border-breathe 2s ease-in-out infinite;

  span {
    font-family: ${(p) => p.theme.fonts.broadcast};
    font-size: 10px;
    font-weight: ${(p) => p.theme.fontWeights.black};
    letter-spacing: ${(p) => p.theme.letterSpacings.stadium};
    color: ${(p) => p.theme.colors.accent.live};
    text-transform: uppercase;
    line-height: 1;
  }
`

interface LivePulseProps {
  size?: PulseSize
  showLabel?: boolean
  className?: string
}

export function LivePulse({ size = 'md', showLabel = false, className }: LivePulseProps) {
  if (showLabel) {
    return (
      <LiveBadgeWrapper className={className}>
        <Wrapper $size={size} />
        <span>Live</span>
      </LiveBadgeWrapper>
    )
  }
  return <Wrapper $size={size} className={className} />
}
