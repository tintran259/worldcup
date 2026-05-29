'use client'

import { useRef, useCallback, useEffect, RefObject } from 'react'
import { MIN_ZOOM, MAX_ZOOM } from './useZoomPan'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UsePinchZoomOptions {
  wrapperRef: RefObject<HTMLDivElement | null>
  zoomRef:    RefObject<number>
  panXRef:    RefObject<number>
  panYRef:    RefObject<number>
  onZoom:     (newZoom: number, cx: number, cy: number) => void
  onPan:      (x: number, y: number) => void
  applyTransform: (z: number, px: number, py: number) => void
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePinchZoom({
  wrapperRef,
  zoomRef,
  panXRef,
  panYRef,
  onZoom,
  onPan,
  applyTransform,
}: UsePinchZoomOptions) {
  // Touch state refs
  const pinchDist   = useRef<number | null>(null)
  const touchOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const isTouching  = useRef(false)

  const getTouchDist = (t: TouchList): number => {
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    return Math.hypot(dx, dy)
  }

  const getTouchMidpoint = (t: TouchList, rect: DOMRect) => ({
    x: (t[0].clientX + t[1].clientX) / 2 - rect.left,
    y: (t[0].clientY + t[1].clientY) / 2 - rect.top,
  })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    if (e.touches.length === 2) {
      pinchDist.current = getTouchDist(e.touches)
    } else if (e.touches.length === 1) {
      isTouching.current = true
      touchOrigin.current = {
        x:    e.touches[0].clientX,
        y:    e.touches[0].clientY,
        panX: panXRef.current,
        panY: panYRef.current,
      }
    }
  }, [wrapperRef, panXRef, panYRef])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()

    if (e.touches.length === 2 && pinchDist.current !== null) {
      // ── Pinch zoom ────────────────────────────────────────────────────────
      const dist   = getTouchDist(e.touches)
      const scale  = dist / pinchDist.current
      const newZ   = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomRef.current * scale))
      const mid    = getTouchMidpoint(e.touches, rect)
      pinchDist.current = dist
      onZoom(newZ, mid.x, mid.y)
    } else if (e.touches.length === 1 && isTouching.current) {
      // ── Single-finger pan ─────────────────────────────────────────────────
      const dx  = e.touches[0].clientX - touchOrigin.current.x
      const dy  = e.touches[0].clientY - touchOrigin.current.y
      const npx = touchOrigin.current.panX + dx
      const npy = touchOrigin.current.panY + dy
      panXRef.current = npx
      panYRef.current = npy
      applyTransform(zoomRef.current, npx, npy)
      onPan(npx, npy)
    }
  }, [wrapperRef, zoomRef, panXRef, panYRef, onZoom, onPan, applyTransform])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) pinchDist.current = null
    if (e.touches.length === 0) isTouching.current = false
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove',  handleTouchMove,  { passive: false })
    el.addEventListener('touchend',   handleTouchEnd)
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove',  handleTouchMove)
      el.removeEventListener('touchend',   handleTouchEnd)
    }
  }, [wrapperRef, handleTouchStart, handleTouchMove, handleTouchEnd])
}
