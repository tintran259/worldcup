'use client'

import React from 'react'
import { RoundLabel } from './RoundLabel'
import { MatchCard } from './MatchCard'
import { ROUND_CONFIGS, CANVAS_PADDING, NODE_WIDTH, ROUND_GAP } from '../types'
import type { BracketRound } from '@/types/domain.types'
import type { BracketNodePosition } from '../types'

interface RoundColumnProps {
  round: BracketRound
  roundIndex: number
  /** Pre-computed position map: matchId → {x, y} */
  positions: Map<string, BracketNodePosition>
}

/**
 * Renders one bracket column: the round label at the top followed by
 * absolutely-positioned match cards. This component has no DOM container of
 * its own — it renders fragments so all nodes live in the same absolute
 * positioning context as the canvas content div.
 */
export function RoundColumn({ round, roundIndex, positions }: RoundColumnProps) {
  const config = ROUND_CONFIGS.find((c) => c.id === round.id)
  const columnX = CANVAS_PADDING + roundIndex * (NODE_WIDTH + ROUND_GAP)

  return (
    <>
      {config && <RoundLabel config={config} x={columnX} y={CANVAS_PADDING} />}

      {round.matches.map((match, matchIdx) => {
        const pos = positions.get(match.id)
        if (!pos) return null

        return (
          // data-node prevents the canvas drag handler from activating when
          // the pointer goes down on a card
          <div
            key={match.id}
            data-node
            style={{ position: 'absolute', left: pos.x, top: pos.y }}
          >
            <MatchCard match={match} index={matchIdx} />
          </div>
        )
      })}
    </>
  )
}
