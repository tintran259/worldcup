'use client'

import { useRef, useState, useCallback, useEffect, RefObject } from 'react'
import { useBracketStore } from '@/stores'

export const MIN_ZOOM = 0.18
export const MAX_ZOOM = 3.0
export const ZOOM_STEP = 0.15

const FRICTION = 0.87
const MIN_VELOCITY = 0.4
const CANVAS_PADDING = 40

export interface UseZoomPanOptions {
  contentWidth: number
  contentHeight: number
}

export interface UseZoomPanReturn {
  wrapperRef: RefObject<HTMLDivElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  isDragging: boolean
  zoom: number
  panX: number
  panY: number
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
  fitToContainer: () => void
  zoomToPoint: (newZoom: number, cx: number, cy: number) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
}

export function useZoomPan({ contentWidth, contentHeight }: UseZoomPanOptions): UseZoomPanReturn {
  const { zoom, panX, panY, setZoom, setPan } = useBracketStore()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  // Live mutable refs so event-handler closures never go stale
  const zRef = useRef(zoom)
  const pxRef = useRef(panX)
  const pyRef = useRef(panY)
  useEffect(() => { zRef.current = zoom }, [zoom])
  useEffect(() => { pxRef.current = panX }, [panX])
  useEffect(() => { pyRef.current = panY }, [panY])

  // Drag state (mutation-only, no re-render)
  const dragging = useRef(false)
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const momentumFrame = useRef<number | null>(null)

  // Direct DOM transform bypasses React for every-frame updates
  const applyTransform = useCallback((z: number, px: number, py: number) => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${px}px, ${py}px) scale(${z})`
    }
  }, [])

  const commitTransform = useCallback((z: number, px: number, py: number) => {
    const cz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
    zRef.current = cz
    pxRef.current = px
    pyRef.current = py
    applyTransform(cz, px, py)
    setZoom(cz)
    setPan(px, py)
  }, [applyTransform, setZoom, setPan])

  // Sync on store-driven changes (e.g. external resets)
  useEffect(() => { applyTransform(zoom, panX, panY) }, [zoom, panX, panY, applyTransform])

  const zoomToPoint = useCallback((newZoom: number, cx: number, cy: number) => {
    const cz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom))
    const z = zRef.current
    const px = pxRef.current
    const py = pyRef.current
    // Content coordinate under cursor → new pan keeps that point fixed
    const cpx = (cx - px) / z
    const cpy = (cy - py) / z
    const npx = cx - cpx * cz
    const npy = cy - cpy * cz
    commitTransform(cz, npx, npy)
  }, [commitTransform])

  const fitToContainer = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !contentWidth || !contentHeight) return
    const { width, height } = wrapper.getBoundingClientRect()
    const p = CANVAS_PADDING
    const sx = (width - p * 2) / contentWidth
    const sy = (height - p * 2) / contentHeight
    const fz = Math.min(sx, sy, 1)
    const fx = (width - contentWidth * fz) / 2
    const fy = (height - contentHeight * fz) / 2
    commitTransform(fz, fx, fy)
  }, [contentWidth, contentHeight, commitTransform])

  // Center on first mount when pan is at origin
  useEffect(() => {
    if (panX === 0 && panY === 0) fitToContainer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const step = e.ctrlKey ? 0.06 : ZOOM_STEP
    const delta = e.deltaY < 0 ? step : -step
    zoomToPoint(zRef.current + delta, cx, cy)
  }, [zoomToPoint])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Mouse drag with inertia
  const cancelMomentum = () => {
    if (momentumFrame.current !== null) {
      cancelAnimationFrame(momentumFrame.current)
      momentumFrame.current = null
    }
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-node]')) return
    cancelMomentum()
    dragging.current = true
    setIsDragging(true)
    dragOrigin.current = { x: e.clientX, y: e.clientY, panX: pxRef.current, panY: pyRef.current }
    lastPos.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    velocity.current.x = velocity.current.x * 0.6 + dx * 0.4
    velocity.current.y = velocity.current.y * 0.6 + dy * 0.4
    lastPos.current = { x: e.clientX, y: e.clientY }
    const npx = dragOrigin.current.panX + (e.clientX - dragOrigin.current.x)
    const npy = dragOrigin.current.panY + (e.clientY - dragOrigin.current.y)
    pxRef.current = npx
    pyRef.current = npy
    applyTransform(zRef.current, npx, npy)
    setPan(npx, npy)
  }, [applyTransform, setPan])

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    setIsDragging(false)

    const tick = () => {
      velocity.current.x *= FRICTION
      velocity.current.y *= FRICTION
      const vx = velocity.current.x
      const vy = velocity.current.y
      if (Math.abs(vx) < MIN_VELOCITY && Math.abs(vy) < MIN_VELOCITY) {
        momentumFrame.current = null
        return
      }
      const npx = pxRef.current + vx
      const npy = pyRef.current + vy
      pxRef.current = npx
      pyRef.current = npy
      applyTransform(zRef.current, npx, npy)
      setPan(npx, npy)
      momentumFrame.current = requestAnimationFrame(tick)
    }
    momentumFrame.current = requestAnimationFrame(tick)
  }, [applyTransform, setPan])

  useEffect(() => () => { cancelMomentum() }, [])

  const zoomIn = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const { width, height } = wrapper.getBoundingClientRect()
    zoomToPoint(zRef.current + ZOOM_STEP, width / 2, height / 2)
  }, [zoomToPoint])

  const zoomOut = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const { width, height } = wrapper.getBoundingClientRect()
    zoomToPoint(zRef.current - ZOOM_STEP, width / 2, height / 2)
  }, [zoomToPoint])

  const resetTransform = useCallback(() => {
    commitTransform(1, 0, 0)
  }, [commitTransform])

  return {
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
  }
}
