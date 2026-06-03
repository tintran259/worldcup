'use client'

/**
 * useCountdown — đếm ngược đến target date.
 *
 * Trả về { days, hours, minutes, seconds, totalMs, isExpired }.
 * Update mỗi giây qua setInterval, tự cleanup khi unmount.
 *
 * Khi totalMs <= 0 → isExpired=true, tất cả values = 0.
 */

import { useEffect, useState } from 'react'

export interface CountdownValue {
  days:      number
  hours:     number
  minutes:   number
  seconds:   number
  totalMs:   number
  isExpired: boolean
}

function compute(target: number): CountdownValue {
  const diff = target - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true }
  }

  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))

  return { days, hours, minutes, seconds, totalMs: diff, isExpired: false }
}

/**
 * @param target Date hoặc ISO string hoặc timestamp ms. Null → countdown vô hiệu.
 */
export function useCountdown(target: Date | string | number | null): CountdownValue {
  const targetMs = target ? new Date(target).getTime() : 0

  const [value, setValue] = useState<CountdownValue>(() =>
    targetMs ? compute(targetMs) : { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true },
  )

  useEffect(() => {
    if (!targetMs) return
    setValue(compute(targetMs))    // sync ngay lập tức

    const id = setInterval(() => setValue(compute(targetMs)), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  return value
}
