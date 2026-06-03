'use client'

import { useEffect, RefObject } from 'react'

const PAN_STEP = 80

export interface UseKeyboardNavOptions {
  wrapperRef:     RefObject<HTMLDivElement | null>
  zoomIn:         () => void
  zoomOut:        () => void
  fitToContainer: () => void
  resetTransform: () => void
  panXRef:        RefObject<number>
  panYRef:        RefObject<number>
  onPan:          (x: number, y: number) => void
}

export function useKeyboardNav({
  wrapperRef,
  zoomIn,
  zoomOut,
  fitToContainer,
  resetTransform,
  panXRef,
  panYRef,
  onPan,
}: UseKeyboardNavOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const wrapper = wrapperRef.current
      if (wrapper && !wrapper.contains(document.activeElement) && document.activeElement !== wrapper) {
        return
      }
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      switch (e.key) {
        case '=': case '+': e.preventDefault(); zoomIn();          break
        case '-':           e.preventDefault(); zoomOut();         break
        case '0':           e.preventDefault(); resetTransform();  break
        case 'f': case 'F': e.preventDefault(); fitToContainer();  break
        case 'ArrowLeft':   e.preventDefault(); onPan(panXRef.current + PAN_STEP, panYRef.current); break
        case 'ArrowRight':  e.preventDefault(); onPan(panXRef.current - PAN_STEP, panYRef.current); break
        case 'ArrowUp':     e.preventDefault(); onPan(panXRef.current, panYRef.current + PAN_STEP); break
        case 'ArrowDown':   e.preventDefault(); onPan(panXRef.current, panYRef.current - PAN_STEP); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [wrapperRef, zoomIn, zoomOut, fitToContainer, resetTransform, panXRef, panYRef, onPan])
}
