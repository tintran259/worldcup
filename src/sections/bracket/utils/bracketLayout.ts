import type { BracketRound } from '@/types/domain.types'
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_GAP,
  ROUND_GAP,
  CANVAS_PADDING,
  LABEL_HEIGHT,
  type BracketNodePosition,
  type BracketDimensions,
  type ConnectorPath,
} from '../types'

/**
 * Computes absolute positions for every match node.
 *
 * Centering strategy: the base round (most matches) defines the vertical grid.
 * Each node in subsequent rounds is vertically centered between its two feeder
 * nodes, so bracket arms align perfectly at every depth.
 */
export function computeNodePositions(rounds: BracketRound[]): BracketNodePosition[] {
  const positions: BracketNodePosition[] = []
  if (!rounds.length) return positions

  const slotH = NODE_HEIGHT + NODE_GAP
  const top = CANVAS_PADDING + LABEL_HEIGHT

  rounds.forEach((round, roundIdx) => {
    const colX = CANVAS_PADDING + roundIdx * (NODE_WIDTH + ROUND_GAP)

    round.matches.forEach((match, matchIdx) => {
      let nodeY: number

      if (roundIdx === 0) {
        nodeY = top + matchIdx * slotH
      } else {
        // Center between the two feeder match nodes from the previous column
        const prevRound = rounds[roundIdx - 1]
        const f1Idx = matchIdx * 2
        const f2Idx = matchIdx * 2 + 1

        const centerOf = (idx: number): number => {
          const feederMatch = prevRound.matches[idx]
          if (!feederMatch) return 0
          const p = positions.find((q) => q.matchId === feederMatch.id)
          return p ? p.y + NODE_HEIGHT / 2 : 0
        }

        const c1 = centerOf(f1Idx)
        const c2 = f2Idx < prevRound.matches.length ? centerOf(f2Idx) : c1
        nodeY = (c1 + c2) / 2 - NODE_HEIGHT / 2
      }

      positions.push({ matchId: match.id, x: colX, y: nodeY, round: round.id })
    })
  })

  return positions
}

export function computeBracketDimensions(rounds: BracketRound[]): BracketDimensions {
  const baseCount = rounds[0]?.matches.length ?? 1
  const slotH = NODE_HEIGHT + NODE_GAP
  const totalWidth =
    CANVAS_PADDING * 2 + rounds.length * NODE_WIDTH + (rounds.length - 1) * ROUND_GAP
  const totalHeight =
    CANVAS_PADDING * 2 + LABEL_HEIGHT + baseCount * slotH - NODE_GAP

  return { totalWidth, totalHeight, roundCount: rounds.length }
}

/**
 * Generates a segmented (L-shaped elbow) SVG path from the right edge of one
 * node to the left edge of the next. The turn happens at the horizontal midpoint
 * of the ROUND_GAP, producing crisp right-angle bends.
 *
 * Shape:  ──┐
 *           │
 *           └──
 */
export function generateConnectorPath(
  fromX: number,
  fromCY: number,
  toX: number,
  toCY: number,
): string {
  const startX = fromX + NODE_WIDTH
  const endX = toX
  const midX = startX + ROUND_GAP / 2
  return `M ${startX} ${fromCY} H ${midX} V ${toCY} H ${endX}`
}

export function buildConnectorPaths(
  rounds: BracketRound[],
  positions: BracketNodePosition[],
  highlightedTeamId: string | null,
): ConnectorPath[] {
  const connectors: ConnectorPath[] = []
  const posMap = new Map(positions.map((p) => [p.matchId, p]))

  for (let roundIdx = 0; roundIdx < rounds.length - 1; roundIdx++) {
    const current = rounds[roundIdx]
    const next = rounds[roundIdx + 1]

    current.matches.forEach((match, matchIdx) => {
      const nextMatch = next.matches[Math.floor(matchIdx / 2)]
      if (!nextMatch) return

      const from = posMap.get(match.id)
      const to = posMap.get(nextMatch.id)
      if (!from || !to) return

      const isActivePath =
        highlightedTeamId !== null &&
        (match.homeTeam?.id === highlightedTeamId ||
          match.awayTeam?.id === highlightedTeamId ||
          nextMatch.homeTeam?.id === highlightedTeamId ||
          nextMatch.awayTeam?.id === highlightedTeamId)

      connectors.push({
        id: `${match.id}→${nextMatch.id}`,
        d: generateConnectorPath(
          from.x,
          from.y + NODE_HEIGHT / 2,
          to.x,
          to.y + NODE_HEIGHT / 2,
        ),
        isWinnerPath: !!match.winnerId,
        isActivePath,
        isLivePath: match.status === 'live',
        roundIndex: roundIdx,
        matchIndex: matchIdx,
      })
    })
  }

  return connectors
}
