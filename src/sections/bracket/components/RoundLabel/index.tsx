'use client'

import React from 'react'
import type { RoundConfig } from '../../types'
import { Label, LabelText, LabelLine } from './styles'

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
