import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Primary nav tabs exposed in the tab bar
export type PrimaryTab = 'live' | 'standings' | 'history' | 'stats'
// Context tabs activated by clicking a bracket node (not shown in main tab bar)
export type ContextTab = 'match' | 'team'
export type PanelTab = PrimaryTab | ContextTab

export const PRIMARY_TABS: PrimaryTab[] = ['live', 'standings', 'history', 'stats']

interface PanelState {
  activeTab: PanelTab
  selectedMatchId: string | null
  selectedTeamId: string | null
  isCollapsed: boolean
  isMobileOpen: boolean
  previousTab: PanelTab | null

  setTab: (tab: PanelTab) => void
  openMatch: (matchId: string) => void
  openTeam: (teamId: string) => void
  closeMobilePanel: () => void
  openMobilePanel: () => void
  collapse: () => void
  expand: () => void
  toggleCollapse: () => void
}

export const usePanelStore = create<PanelState>()(
  devtools(
    (set) => ({
      activeTab: 'live',
      selectedMatchId: null,
      selectedTeamId: null,
      isCollapsed: false,
      isMobileOpen: false,
      previousTab: null,

      setTab: (tab) =>
        set((s) => ({ activeTab: tab, previousTab: s.activeTab })),

      openMatch: (matchId) =>
        set((s) => ({
          selectedMatchId: matchId,
          selectedTeamId: null,
          activeTab: 'match',
          previousTab: s.activeTab,
          isCollapsed: false,
          isMobileOpen: true,
        })),

      openTeam: (teamId) =>
        set((s) => ({
          selectedTeamId: teamId,
          activeTab: 'team',
          previousTab: s.activeTab,
          isCollapsed: false,
          isMobileOpen: true,
        })),

      closeMobilePanel: () => set({ isMobileOpen: false }),
      openMobilePanel: () => set({ isMobileOpen: true }),

      collapse: () => set({ isCollapsed: true }),
      expand: () => set({ isCollapsed: false }),
      toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
    }),
    { name: 'panel-store' }
  )
)
