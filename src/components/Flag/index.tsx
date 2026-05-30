'use client'

import React from 'react'
import styled from 'styled-components'

type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeDimensions: Record<FlagSize, { width: number; height: number }> = {
  xs: { width: 16, height: 11 },
  sm: { width: 20, height: 14 },
  md: { width: 28, height: 20 },
  lg: { width: 40, height: 28 },
  xl: { width: 56, height: 40 },
}

const FlagWrapper = styled.span<{ $size: FlagSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => sizeDimensions[p.$size].width}px;
  height: ${(p) => sizeDimensions[p.$size].height}px;
  border-radius: ${(p) => p.theme.radii.xs};
  overflow: hidden;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.bg.overlay};
  font-size: ${(p) => {
    const sizes = { xs: '12px', sm: '14px', md: '18px', lg: '24px', xl: '32px' }
    return sizes[p.$size]
  }};
  line-height: 1;
`

interface FlagProps {
  countryCode: string
  countryName?: string
  size?: FlagSize
  className?: string
}

// Country code to emoji flag conversion
function countryCodeToEmoji(code: string): string {
  const upper = code.toUpperCase()
  return upper
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('')
}

export function Flag({ countryCode, countryName, size = 'md', className }: FlagProps) {
  return (
    <FlagWrapper $size={size} className={className} title={countryName ?? countryCode}>
      {countryCodeToEmoji(countryCode)}
    </FlagWrapper>
  )
}
