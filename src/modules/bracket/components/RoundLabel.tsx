'use client'

import React from 'react'
import styled from 'styled-components'
import type { RoundConfig } from '../types'
import { NODE_WIDTH } from '../types'

const Label = styled.div`
  position: absolute;
  width: ${NODE_WIDTH}px;
  text-align: center;
  padding-bottom: ${(p) => p.theme.space[3]};
`

const LabelText = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

const LabelLine = styled.div`
  width: 24px;
  height: 1px;
  background: ${(p) => p.theme.colors.border.subtle};
  margin: ${(p) => p.theme.space[1]} auto 0;
`

interface RoundLabelProps {
  config: RoundConfig
  x: number
  y: number
}

export function RoundLabel({ config, x, y }: RoundLabelProps) {
  return (
    <Label style={{ left: x, top: y }}>
      <LabelText>{config.shortLabel}</LabelText>
      <LabelLine />
    </Label>
  )
}
