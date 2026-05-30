'use client'

import { useState } from 'react'
import { FlagWrapper, FlagImage } from './styles'

export type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface FlagProps {
  /** ISO-2 country code (br, fr, ar...) — fallback khi không có URL */
  countryCode: string
  /** Tên đầy đủ cho title/alt text */
  countryName?: string
  /** URL cờ/logo từ API. Nếu có sẽ render <img>, không thì dùng emoji */
  flagUrl?: string
  size?:    FlagSize
  className?: string
}

/** Convert ISO-2 code → emoji flag (🇧🇷, 🇫🇷, ...) — dùng làm fallback */
function countryCodeToEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('')
}

export function Flag({
  countryCode,
  countryName,
  flagUrl,
  size = 'md',
  className,
}: FlagProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = flagUrl && !imgFailed

  return (
    <FlagWrapper
      $size={size}
      className={className}
      title={countryName ?? countryCode}
    >
      {showImage ? (
        <FlagImage
          src={flagUrl}
          alt={countryName ?? countryCode}
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      ) : (
        countryCodeToEmoji(countryCode)
      )}
    </FlagWrapper>
  )
}
