/**
 * Competition store — quản lý competition đang được user chọn (client-side).
 *
 * Persist vào localStorage để giữ lựa chọn qua session.
 * apiClient tự động gắn ?competition=<key> vào request.
 * BFF routes đọc query và override env default.
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

interface CompetitionState {
  /** Key của competition đang chọn — null = dùng env default */
  selectedKey: string | null
  /** Modal switcher đang mở không */
  isModalOpen: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  selectCompetition: (key: string) => void
  resetToDefault: () => void
  openModal: () => void
  closeModal: () => void
}

export const useCompetitionStore = create<CompetitionState>()(
  devtools(
    persist(
      (set) => ({
        selectedKey: null,
        isModalOpen: false,

        selectCompetition: (key) => set({ selectedKey: key, isModalOpen: false }),
        resetToDefault: () => set({ selectedKey: null }),
        openModal: () => set({ isModalOpen: true }),
        closeModal: () => set({ isModalOpen: false }),
      }),
      {
        name: 'competition-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ selectedKey: state.selectedKey }),
      },
    ),
    { name: 'competition-store' },
  ),
)

/**
 * Helper non-React để đọc selectedKey (apiClient dùng).
 * Tránh import store directly trong service modules.
 */
export function getSelectedCompetitionKey(): string | null {
  if (typeof window === 'undefined') return null
  return useCompetitionStore.getState().selectedKey
}
