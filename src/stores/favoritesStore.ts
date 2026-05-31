/**
 * Favorites store — quản lý đội bóng yêu thích của user.
 *
 * Persist vào localStorage để giữ lựa chọn qua các session.
 * Tất cả sections (standings, results, live, stats) đọc từ store này
 * để filter data.
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesState {
  /** Set các team IDs được đánh dấu yêu thích */
  teamIds: string[]
  /** Modal đang mở không */
  isModalOpen: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  toggleTeam:  (teamId: string) => void
  clearAll:    () => void
  openModal:   () => void
  closeModal:  () => void
  /** Helper — true nếu team được đánh dấu */
  isFavorite:  (teamId: string) => boolean
  /** Helper — true nếu user đang filter (có ít nhất 1 team) */
  hasActiveFilter: () => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        teamIds:     [],
        isModalOpen: false,

        toggleTeam: (teamId) => set((state) => {
          const exists = state.teamIds.includes(teamId)
          return {
            teamIds: exists
              ? state.teamIds.filter((id) => id !== teamId)
              : [...state.teamIds, teamId],
          }
        }),

        clearAll:    () => set({ teamIds: [] }),
        openModal:   () => set({ isModalOpen: true }),
        closeModal:  () => set({ isModalOpen: false }),

        isFavorite:      (teamId) => get().teamIds.includes(teamId),
        hasActiveFilter: ()       => get().teamIds.length > 0,
      }),
      {
        name:    'favorites-store',
        storage: createJSONStorage(() => localStorage),
        // Không persist modal state — chỉ persist data
        partialize: (state) => ({ teamIds: state.teamIds }),
      },
    ),
    { name: 'favorites-store' },
  ),
)
