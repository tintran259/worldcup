'use client'
import { FlagWrapper } from './styles'
export type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface FlagProps {
  countryCode: string
  countryName?: string
  size?: FlagSize
  className?: string
}

// Country code to emoji flag conversion
function countryCodeToEmoji(code: string): string {
  const upper = code.toUpperCase()
  return upper
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('')
}

export function Flag({ countryCode, countryName, size = 'md', className }: FlagProps) {
  return (
    <FlagWrapper $size={size} className={className} title={countryName ?? countryCode}>
      {countryCodeToEmoji(countryCode)}
    </FlagWrapper>
  )
}
