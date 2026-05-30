import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface BracketState {
  zoom: number
  panX: number
  panY: number
  highlightedTeamId: string | null
  hoveredMatchId: string | null
  selectedMatchId: string | null

  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  highlightTeam: (teamId: string | null) => void
  hoverMatch: (matchId: string | null) => void
  selectMatch: (matchId: string | null) => void
  reset: () => void
}

const initialState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  highlightedTeamId: null,
  hoveredMatchId: null,
  selectedMatchId: null,
}

export const useBracketStore = create<BracketState>()(
  devtools(
    (set) => ({
      ...initialState,
      setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.3), 2.5) }),
      setPan: (panX, panY) => set({ panX, panY }),
      highlightTeam: (highlightedTeamId) => set({ highlightedTeamId }),
      hoverMatch: (hoveredMatchId) => set({ hoveredMatchId }),
      selectMatch: (selectedMatchId) => set({ selectedMatchId }),
      reset: () => set(initialState),
    }),
    { name: 'bracket-store' }
  )
)
