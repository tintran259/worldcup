'use client'

import React from 'react'
import styled from 'styled-components'
import { ZoomCanvas }       from './ZoomCanvas'
import { SVGConnections }   from './SVGConnections'
import { RoundColumn }      from './RoundColumn'
import { useBracketStore }  from '@/store'
import {
  computeNodePositions,
  computeBracketDimensions,
  buildConnectorPaths,
} from '../utils/bracketLayout'
import type { BracketRound } from '@/types/domain.types'

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.bg.surface};
`

const EmptyTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BracketCanvasProps {
  rounds: BracketRound[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BracketCanvas({ rounds }: BracketCanvasProps) {
  const { highlightedTeamId } = useBracketStore()

  if (!rounds.length) {
    return (
      <EmptyWrap>
        <EmptyTitle>Tournament Bracket</EmptyTitle>
      </EmptyWrap>
    )
  }

  // Layout computation (pure, memo-stable between renders when rounds reference is stable)
  const nodePositions = computeNodePositions(rounds)
  const dimensions    = computeBracketDimensions(rounds)
  const connectors    = buildConnectorPaths(rounds, nodePositions, highlightedTeamId)
  const posMap        = new Map(nodePositions.map((p) => [p.matchId, p]))

  return (
    <ZoomCanvas
      contentWidth={dimensions.totalWidth}
      contentHeight={dimensions.totalHeight}
      nodePositions={nodePositions}
    >
      {/* SVG connector lines — behind the cards */}
      <SVGConnections
        connectors={connectors}
        width={dimensions.totalWidth}
        height={dimensions.totalHeight}
      />

      {/* One column of cards per round */}
      {rounds.map((round, roundIndex) => (
        <RoundColumn
          key={round.id}
          round={round}
          roundIndex={roundIndex}
          positions={posMap}
        />
      ))}
    </ZoomCanvas>
  )
}
