'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'styled-components'
import type { ConnectorPath } from '../types'

interface BracketConnectorProps {
  connector: ConnectorPath
}

export function BracketConnector({ connector }: BracketConnectorProps) {
  const theme = useTheme()

  const stroke = connector.isActivePath
    ? theme.colors.bracket.lineActive
    : connector.isWinnerPath
      ? theme.colors.bracket.lineWinner
      : connector.isLivePath
        ? theme.colors.accent.live
        : theme.colors.bracket.line

  const strokeWidth = connector.isActivePath || connector.isWinnerPath ? 2 : 1

  const filter = connector.isActivePath
    ? theme.glows.svgCyan
    : connector.isWinnerPath
      ? theme.glows.svgMint
      : 'none'

  return (
    <motion.path
      d={connector.d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      filter={filter}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    />
  )
}
