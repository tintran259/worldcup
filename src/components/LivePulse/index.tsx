'use client'

import { LiveBadgeWrapper, PulseSize, Wrapper } from './styles'

interface LivePulseProps {
  size?: PulseSize
  showLabel?: boolean
  className?: string
}

export function LivePulse({ size = 'md', showLabel = false, className }: LivePulseProps) {
  if (showLabel) {
    return (
      <LiveBadgeWrapper className={className}>
        <Wrapper $size={size} />
        <span>Live</span>
      </LiveBadgeWrapper>
    )
  }
  return <Wrapper $size={size} className={className} />
}
