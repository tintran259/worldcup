'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBracketStore } from '@/stores'
import type { BracketNodePosition } from '../../types'
import { NODE_WIDTH, NODE_HEIGHT, CANVAS_PADDING } from '../../types'
import { Root, Header, Label, CollapseBtn, Canvas, MM_WIDTH, MM_PAD } from './styles'

export interface MinimapProps {
  contentWidth: number
  contentHeight: number
  positions: BracketNodePosition[]
  wrapperRef: React.RefObject<HTMLDivElement | null>
  onNavigate: (panX: number, panY: number) => void
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

  // Observe wrapper size for accurate viewport rect
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

  const mmInner = MM_WIDTH - MM_PAD * 2
  const scale = mmInner / contentWidth
  const mmH = contentHeight * scale

  // Viewport indicator in minimap coords
  const vpX = (-panX / zoom) * scale
  const vpY = (-panY / zoom) * scale
  const vpW = (wrapperSize.w / zoom) * scale
  const vpH = (wrapperSize.h / zoom) * scale

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = (e.clientX - rect.left - MM_PAD) / scale
    const my = (e.clientY - rect.top - MM_PAD) / scale
    // Center the viewport on the clicked content point
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
                {/* Match node dots colour-coded by round */}
                {positions.map((pos) => {
                  const x = (pos.x - CANVAS_PADDING) * scale
                  const y = (pos.y - CANVAS_PADDING) * scale
                  const w = NODE_WIDTH * scale
                  const h = NODE_HEIGHT * scale
                  const fill =
                    pos.round === 'final' ? 'rgba(251,191,36,0.55)' :
                      pos.round === 'semi-final' ? 'rgba(167,243,208,0.40)' :
                        pos.round === 'quarter-final' ? 'rgba(147,197,253,0.40)' :
                          'rgba(148,163,184,0.22)'
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

                {/* Viewport indicator rect */}
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

            <div style={{
              padding: '2px 8px 6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Label style={{ opacity: 0.45 }}>{Math.round(zoom * 100)}%</Label>
              <Label style={{ opacity: 0.45 }}>F = fit</Label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Root>
  )
}
