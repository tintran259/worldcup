'use client'

import React from 'react'
import { useBracketStore } from '@/stores'
import { Root, Group, Btn, ZoomPct, TooltipWrap, Tooltip } from './styles'

export interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onReset: () => void
}

export function ZoomControls({ onZoomIn, onZoomOut, onFit, onReset }: ZoomControlsProps) {
  const { zoom } = useBracketStore()
  const pct = Math.round(zoom * 100)

  return (
    <Root
      initial={{ opacity: 0, scale: 0.90 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <ZoomPct>{pct}%</ZoomPct>

      <Group>
        <TooltipWrap>
          <Btn onClick={onZoomIn} aria-label="Zoom in">＋</Btn>
          <Tooltip>Zoom in (+)</Tooltip>
        </TooltipWrap>
        <TooltipWrap>
          <Btn onClick={onZoomOut} aria-label="Zoom out">－</Btn>
          <Tooltip>Zoom out (−)</Tooltip>
        </TooltipWrap>
      </Group>

      <Group>
        <TooltipWrap>
          <Btn onClick={onFit} aria-label="Fit to screen" style={{ fontSize: '13px' }}>⊞</Btn>
          <Tooltip>Fit to screen (F)</Tooltip>
        </TooltipWrap>
        <TooltipWrap>
          <Btn onClick={onReset} aria-label="Reset zoom" style={{ fontSize: '12px' }}>↺</Btn>
          <Tooltip>Reset (0)</Tooltip>
        </TooltipWrap>
      </Group>
    </Root>
  )
}
