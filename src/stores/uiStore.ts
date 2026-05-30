import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  isMobileMenuOpen: boolean
  isOnboarded: boolean
  activeTooltipId: string | null

  openMobileMenu: () => void
  closeMobileMenu: () => void
  markOnboarded: () => void
  setTooltip: (id: string | null) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isMobileMenuOpen: false,
      isOnboarded: false,
      activeTooltipId: null,

      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      markOnboarded: () => set({ isOnboarded: true }),
      setTooltip: (activeTooltipId) => set({ activeTooltipId }),
    }),
    { name: 'ui-store' }
  )
)
