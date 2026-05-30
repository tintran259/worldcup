import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type TeamModalTab = 'overview' | 'squad' | 'stats' | 'matches'

interface TeamModalState {
  isOpen:         boolean
  teamId:         string | null
  activeTab:      TeamModalTab
  activePlayerId: string | null

  openTeam:    (teamId: string) => void
  closeTeam:   () => void
  setTab:      (tab: TeamModalTab) => void
  openPlayer:  (playerId: string) => void
  closePlayer: () => void
}

export const useTeamModalStore = create<TeamModalState>()(
  devtools(
    (set) => ({
      isOpen:         false,
      teamId:         null,
      activeTab:      'overview',
      activePlayerId: null,

      openTeam:    (teamId) => set({ isOpen: true, teamId, activeTab: 'overview', activePlayerId: null }),
      closeTeam:   ()       => set({ isOpen: false, activePlayerId: null }),
      setTab:      (tab)    => set({ activeTab: tab, activePlayerId: null }),
      openPlayer:  (id)     => set({ activePlayerId: id }),
      closePlayer: ()       => set({ activePlayerId: null }),
    }),
    { name: 'team-modal-store' },
  ),
)
