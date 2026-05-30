'use client'

import React, { useRef, useCallback } from 'react'
import { useZoomPan } from '../../hooks/useZoomPan'
import { usePinchZoom } from '../../hooks/usePinchZoom'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import { ZoomControls } from '../ZoomControls'
import { Minimap } from '../Minimap'
import { useBracketStore } from '@/stores'
import type { BracketNodePosition } from '../../types'
import { Wrapper, ContentLayer } from './styles'

export interface ZoomCanvasProps {
  contentWidth: number
  contentHeight: number
  /** Pre-computed node positions forwarded to the Minimap */
  nodePositions: BracketNodePosition[]
  children: React.ReactNode
}

export function ZoomCanvas({
  contentWidth,
  contentHeight,
  nodePositions,
  children,
}: ZoomCanvasProps) {
  const { setPan } = useBracketStore()

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

  // Live refs so pinch and keyboard handlers always see current values
  const zRef = useRef(zoom)
  const pxRef = useRef(panX)
  const pyRef = useRef(panY)
  zRef.current = zoom
  pxRef.current = panX
  pyRef.current = panY

  // Direct DOM transform shared with pinch (avoids React re-render per frame)
  const applyTransformDirect = useCallback((z: number, px: number, py: number) => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${px}px, ${py}px) scale(${z})`
    }
  }, [contentRef])

  usePinchZoom({
    wrapperRef,
    zoomRef: zRef,
    panXRef: pxRef,
    panYRef: pyRef,
    onZoom: (newZoom, cx, cy) => zoomToPoint(newZoom, cx, cy),
    onPan: (x, y) => setPan(x, y),
    applyTransform: applyTransformDirect,
  })

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

  // Double-click zooms into the clicked canvas point
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    zoomToPoint(zRef.current * 1.5, e.clientX - rect.left, e.clientY - rect.top)
  }, [wrapperRef, zoomToPoint, zRef])

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
      <ContentLayer
        ref={contentRef}
        $width={contentWidth}
        $height={contentHeight}
      >
        {children}
      </ContentLayer>

      <Minimap
        contentWidth={contentWidth}
        contentHeight={contentHeight}
        positions={nodePositions}
        wrapperRef={wrapperRef}
        onNavigate={handleMinimapNavigate}
      />

      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitToContainer}
        onReset={resetTransform}
      />
    </Wrapper>
  )
}
