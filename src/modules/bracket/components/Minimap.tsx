'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useBracketStore } from '@/store'
import type { BracketNodePosition } from '../types'
import { NODE_WIDTH, NODE_HEIGHT, CANVAS_PADDING } from '../types'

// ── Minimap constants ─────────────────────────────────────────────────────────

const MM_WIDTH  = 160   // px — minimap panel width
const MM_PAD    = 4     // inner padding

// ── Styled ────────────────────────────────────────────────────────────────────

const Root = styled(motion.div)`
  position: absolute;
  bottom: ${(p) => p.theme.space[4]};
  left: ${(p) => p.theme.space[4]};
  z-index: ${(p) => p.theme.zIndex.card};
  width: ${MM_WIDTH}px;
  border-radius: ${(p) => p.theme.radii.card};
  background: rgba(6, 11, 24, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  overflow: hidden;
  user-select: none;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 4px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`

const Label = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 9px;
  letter-spacing: 0.10em;
  color: rgba(148,163,184,0.70);
  text-transform: uppercase;
`

const CollapseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  color: rgba(148,163,184,0.55);
  cursor: pointer;
  padding: 0;
  font-size: 10px;
  line-height: 1;
  &:hover { color: rgba(148,163,184,1); }
`

const Canvas = styled.div`
  position: relative;
  padding: ${MM_PAD}px;
  cursor: pointer;
`

const MatchDot = styled.rect`
  rx: 1;
  ry: 1;
`

// ── Component ─────────────────────────────────────────────────────────────────

export interface MinimapProps {
  contentWidth:  number
  contentHeight: number
  positions:     BracketNodePosition[]
  wrapperRef:    React.RefObject<HTMLDivElement | null>
  onNavigate:    (panX: number, panY: number) => void
}

export function Minimap({
  contentWidth,
  contentHeight,
  positions,
  wrapperRef,
  onNavigate,
}: MinimapProps) {
  const { zoom, panX, panY } = useBracketStore()
  const [collapsed, setCollapsed] = useState(false)
  const [wrapperSize, setWrapperSize] = useState({ w: 0, h: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  // Observe wrapper size for viewport rect computation
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setWrapperSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [wrapperRef])

  // Derived scale: how many minimap px per content px
  const mmInner = MM_WIDTH - MM_PAD * 2
  const scale   = mmInner / contentWidth
  const mmH     = contentHeight * scale

  // Viewport rectangle in minimap coords
  const vpX = (-panX / zoom) * scale
  const vpY = (-panY / zoom) * scale
  const vpW = (wrapperSize.w / zoom) * scale
  const vpH = (wrapperSize.h / zoom) * scale

  // ── Click-to-navigate ─────────────────────────────────────────────────────
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = (e.clientX - rect.left - MM_PAD) / scale
    const my = (e.clientY - rect.top  - MM_PAD) / scale
    // Center the viewport on that content point
    const npx = wrapperSize.w / 2 - mx * zoom
    const npy = wrapperSize.h / 2 - my * zoom
    onNavigate(npx, npy)
  }, [scale, zoom, wrapperSize, onNavigate])

  return (
    <Root
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {/* ── Header ── */}
      <Header>
        <Label>Minimap</Label>
        <CollapseBtn
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? 'Expand' : 'Collapse'}
          aria-label={collapsed ? 'Expand minimap' : 'Collapse minimap'}
        >
          {collapsed ? '▲' : '▼'}
        </CollapseBtn>
      </Header>

      {/* ── SVG canvas ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="mm-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <Canvas onClick={handleCanvasClick}>
              <svg
                ref={svgRef}
                width={mmInner}
                height={mmH}
                viewBox={`0 0 ${mmInner} ${mmH}`}
                style={{ display: 'block' }}
              >
                {/* ── Match node dots ── */}
                {positions.map((pos) => {
                  const x = (pos.x - CANVAS_PADDING) * scale
                  const y = (pos.y - CANVAS_PADDING) * scale
                  const w = NODE_WIDTH  * scale
                  const h = NODE_HEIGHT * scale
                  const fill = pos.round === 'final'
                    ? 'rgba(251,191,36,0.55)'
                    : pos.round === 'semi-final'
                      ? 'rgba(167,243,208,0.40)'
                      : pos.round === 'quarter-final'
                        ? 'rgba(147,197,253,0.40)'
                        : 'rgba(148,163,184,0.22)'

                  return (
                    <rect
                      key={pos.matchId}
                      x={x}
                      y={y}
                      width={Math.max(w, 2)}
                      height={Math.max(h, 1.5)}
                      rx={1}
                      ry={1}
                      fill={fill}
                    />
                  )
                })}

                {/* ── Viewport indicator ── */}
                <rect
                  x={Math.max(0, vpX)}
                  y={Math.max(0, vpY)}
                  width={Math.min(vpW, mmInner - Math.max(0, vpX))}
                  height={Math.min(vpH, mmH - Math.max(0, vpY))}
                  fill="rgba(37,99,235,0.10)"
                  stroke="rgba(37,99,235,0.65)"
                  strokeWidth={1}
                  rx={1}
                  ry={1}
                />
              </svg>
            </Canvas>

            {/* ── Zoom readout ── */}
            <div style={{
              padding: '2px 8px 6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Label style={{ opacity: 0.45 }}>
                {Math.round(zoom * 100)}%
              </Label>
              <Label style={{ opacity: 0.45 }}>
                F = fit
              </Label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Root>
  )
}
