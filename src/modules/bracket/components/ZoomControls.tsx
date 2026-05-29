'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useBracketStore } from '@/store'

// ── Styled ────────────────────────────────────────────────────────────────────

const Root = styled(motion.div)`
  position: absolute;
  bottom: ${(p) => p.theme.space[4]};
  right: ${(p) => p.theme.space[4]};
  z-index: ${(p) => p.theme.zIndex.card};
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${(p) => p.theme.radii.sm};
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(6,11,24,0.88);
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.30);
`

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: none;
  border: none;
  color: rgba(203,213,225,0.75);
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(37,99,235,0.14);
    color: #93b4fd;
  }

  &:active {
    background: rgba(37,99,235,0.22);
    transform: scale(0.94);
  }

  /* Divider between buttons in a group */
  & + & {
    border-top: 1px solid rgba(255,255,255,0.05);
  }
`

const ZoomPct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 8px;
  background: rgba(6,11,24,0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${(p) => p.theme.radii.sm};
  box-shadow: 0 4px 16px rgba(0,0,0,0.30);
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.05em;
  color: rgba(148,163,184,0.65);
  white-space: nowrap;
`

// ── Tooltip ───────────────────────────────────────────────────────────────────

const TooltipWrap = styled.div`
  position: relative;
  &:hover > span { opacity: 1; pointer-events: none; }
`

const Tooltip = styled.span`
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(6,11,24,0.94);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 4px;
  padding: 3px 7px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: rgba(203,213,225,0.85);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
`

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ZoomControlsProps {
  onZoomIn:        () => void
  onZoomOut:       () => void
  onFit:           () => void
  onReset:         () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ZoomControls({ onZoomIn, onZoomOut, onFit, onReset }: ZoomControlsProps) {
  const { zoom } = useBracketStore()
  const pct = Math.round(zoom * 100)

  return (
    <Root
      initial={{ opacity: 0, scale: 0.90 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {/* Zoom % readout */}
      <ZoomPct>{pct}%</ZoomPct>

      {/* +/− group */}
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

      {/* Fit / reset group */}
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
