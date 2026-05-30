'use client'

import React from 'react'
import { ZoomCanvas } from '../ZoomCanvas'
import { SVGConnections } from '../SVGConnections'
import { RoundColumn } from '../RoundColumn'
import { useBracketStore } from '@/stores'
import {
  computeNodePositions,
  computeBracketDimensions,
  buildConnectorPaths,
} from '../../utils/bracketLayout'
import type { BracketRound } from '@/types/domain.types'
import { EmptyWrap, EmptyTitle } from './styles'

export interface BracketCanvasProps {
  rounds: BracketRound[]
}

export function BracketCanvas({ rounds }: BracketCanvasProps) {
  const { highlightedTeamId } = useBracketStore()

  if (!rounds.length) {
    return (
      <EmptyWrap>
        <EmptyTitle>Tournament Bracket</EmptyTitle>
      </EmptyWrap>
    )
  }

  const nodePositions = computeNodePositions(rounds)
  const dimensions = computeBracketDimensions(rounds)
  const connectors = buildConnectorPaths(rounds, nodePositions, highlightedTeamId)
  const posMap = new Map(nodePositions.map((p) => [p.matchId, p]))

  return (
    <ZoomCanvas
      contentWidth={dimensions.totalWidth}
      contentHeight={dimensions.totalHeight}
      nodePositions={nodePositions}
    >
      {/* SVG connector lines sit behind the match cards */}
      <SVGConnections
        connectors={connectors}
        width={dimensions.totalWidth}
        height={dimensions.totalHeight}
      />

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
