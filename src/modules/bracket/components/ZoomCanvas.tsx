'use client'

import React, { useRef, useCallback } from 'react'
import styled from 'styled-components'
import { useZoomPan }     from '../hooks/useZoomPan'
import { usePinchZoom }   from '../hooks/usePinchZoom'
import { useKeyboardNav } from '../hooks/useKeyboardNav'
import { ZoomControls }   from './ZoomControls'
import { Minimap }        from './Minimap'
import { useBracketStore } from '@/store'
import type { BracketNodePosition } from '../types'

// ── Styled ────────────────────────────────────────────────────────────────────

const Wrapper = styled.div<{ $dragging: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.surface};
  touch-action: none;
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
  outline: none;

  /* Subtle dot-grid */
  background-image: radial-gradient(
    circle,
    rgba(100, 116, 139, 0.10) 1px,
    transparent 1px
  );
  background-size: 24px 24px;

  /* Double-click cursor hint */
  &:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.40);
    outline-offset: -2px;
  }
`

const ContentLayer = styled.div<{ $width: number; $height: number }>`
  position: absolute;
  width: ${(p) => p.$width}px;
  height: ${(p) => p.$height}px;
  transform-origin: 0 0;
  will-change: transform;
`

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ZoomCanvasProps {
  contentWidth:  number
  contentHeight: number
  /** Pre-computed node positions — forwarded to the Minimap */
  nodePositions: BracketNodePosition[]
  children: React.ReactNode
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ZoomCanvas({
  contentWidth,
  contentHeight,
  nodePositions,
  children,
}: ZoomCanvasProps) {
  const { setPan } = useBracketStore()

  // ── Core zoom/pan hook ───────────────────────────────────────────────────────
  const {
    wrapperRef,
    contentRef,
    isDragging,
    zoom,
    panX,
    panY,
    zoomIn,
    zoomOut,
    resetTransform,
    fitToContainer,
    zoomToPoint,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = useZoomPan({ contentWidth, contentHeight })

  // Live refs (needed by usePinchZoom and useKeyboardNav)
  const zRef  = useRef(zoom)
  const pxRef = useRef(panX)
  const pyRef = useRef(panY)
  // Update live refs from latest render values
  zRef.current  = zoom
  pxRef.current = panX
  pyRef.current = panY

  // Shared applyTransform for pinch (must mutate the same contentRef)
  const applyTransformDirect = useCallback((z: number, px: number, py: number) => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${px}px, ${py}px) scale(${z})`
    }
  }, [contentRef])

  // ── Pinch-to-zoom (touch) ────────────────────────────────────────────────────
  usePinchZoom({
    wrapperRef,
    zoomRef:  zRef,
    panXRef:  pxRef,
    panYRef:  pyRef,
    onZoom:   (newZoom, cx, cy) => zoomToPoint(newZoom, cx, cy),
    onPan:    (x, y) => setPan(x, y),
    applyTransform: applyTransformDirect,
  })

  // ── Keyboard navigation ───────────────────────────────────────────────────────
  useKeyboardNav({
    wrapperRef,
    zoomIn,
    zoomOut,
    fitToContainer,
    resetTransform,
    panXRef: pxRef,
    panYRef: pyRef,
    onPan: (x, y) => {
      pxRef.current = x
      pyRef.current = y
      applyTransformDirect(zRef.current, x, y)
      setPan(x, y)
    },
  })

  // ── Double-click to zoom in ───────────────────────────────────────────────────
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    zoomToPoint(zRef.current * 1.5, e.clientX - rect.left, e.clientY - rect.top)
  }, [wrapperRef, zoomToPoint, zRef])

  // ── Minimap navigate ──────────────────────────────────────────────────────────
  const handleMinimapNavigate = useCallback((nx: number, ny: number) => {
    pxRef.current = nx
    pyRef.current = ny
    applyTransformDirect(zRef.current, nx, ny)
    setPan(nx, ny)
  }, [applyTransformDirect, setPan, zRef, pxRef, pyRef])

  return (
    <Wrapper
      ref={wrapperRef}
      $dragging={isDragging}
      tabIndex={0}
      aria-label="Tournament bracket canvas — drag to pan, scroll to zoom"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* ── Zoomable content layer ── */}
      <ContentLayer
        ref={contentRef}
        $width={contentWidth}
        $height={contentHeight}
      >
        {children}
      </ContentLayer>

      {/* ── Minimap (bottom-left) ── */}
      <Minimap
        contentWidth={contentWidth}
        contentHeight={contentHeight}
        positions={nodePositions}
        wrapperRef={wrapperRef}
        onNavigate={handleMinimapNavigate}
      />

      {/* ── Zoom controls (bottom-right) ── */}
      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitToContainer}
        onReset={resetTransform}
      />
    </Wrapper>
  )
}
