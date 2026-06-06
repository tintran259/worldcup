'use client'

import React from 'react'
import { ZoomCanvas } from '../ZoomCanvas'
import { SVGConnections } from '../SVGConnections'
import { RoundColumn } from '../RoundColumn'
import { useBracketStore } from '@/stores'
import { LoadingState, EmptyState } from '@/components/SectionStatus'
import {
  computeNodePositions,
  computeBracketDimensions,
  buildConnectorPaths,
} from '../../utils/bracketLayout'
import type { BracketRound } from '@/types/domain.types'
import { EmptyWrap } from './styles'

export interface BracketCanvasProps {
  rounds: BracketRound[]
  isLoading?: boolean
}

export function BracketCanvas({ rounds, isLoading = false }: BracketCanvasProps) {
  const { highlightedTeamId } = useBracketStore()

  if (!rounds.length) {
    return (
      <EmptyWrap>
        {isLoading ? (
          <LoadingState
            title="Đang tải sơ đồ giải đấu"
            sub="Đang dựng bracket từ dữ liệu trận đấu."
          />
        ) : (
          <EmptyState
            icon="🏆"
            title="Chưa có sơ đồ giải đấu"
            sub="Giải đấu chưa diễn ra hoặc chưa có dữ liệu vòng đấu loại trực tiếp."
          />
        )}
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
