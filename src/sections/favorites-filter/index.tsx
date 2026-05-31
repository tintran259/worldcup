'use client'

/**
 * FavoritesFilterModal — iPhone-style sheet để chọn đội yêu thích.
 *
 * Mở/đóng qua useFavoritesStore.
 * Lựa chọn được persist vào localStorage tự động.
 */

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { Flag } from '@/components/Flag'
import { useFavoritesStore } from '@/stores'
import { useAllTeams } from './hooks/useAllTeams'
import {
  backdropVariants, sheetVariants, rowVariants,
} from './animations/modal'
import {
  Backdrop, Sheet, GrabHandle,
  SheetHeader, HeaderTitleBlock, SheetTitle, SheetSub, HeaderActions, TextBtn,
  SearchBar, SearchInput,
  TeamList, TeamRow, TeamInfo, TeamName, TeamCode, Checkmark,
  EmptyState,
} from './styles'

function CheckIcon() { return <>✓</> }

export function FavoritesFilterModal() {
  const { isModalOpen, closeModal, teamIds, toggleTeam, clearAll } = useFavoritesStore()
  const { teams, isLoading } = useAllTeams()

  // Hydration-safe portal mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Đóng bằng Escape
  useEffect(() => {
    if (!isModalOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isModalOpen, closeModal])

  // Khóa scroll body khi modal mở
  useEffect(() => {
    if (!isModalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isModalOpen])

  // Search filter
  const [query, setQuery] = useState('')
  useEffect(() => { if (!isModalOpen) setQuery('') }, [isModalOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return teams
    return teams.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q),
    )
  }, [teams, query])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <Backdrop
          key="fav-backdrop"
          variants={backdropVariants}
          initial="hidden" animate="visible" exit="exit"
          onClick={closeModal}
        >
          <Sheet
            key="fav-sheet"
            variants={sheetVariants}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filter favorite teams"
          >
            <GrabHandle aria-hidden="true" />

            <SheetHeader>
              <HeaderTitleBlock>
                <SheetTitle>Đội yêu thích</SheetTitle>
                <SheetSub>
                  {teamIds.length > 0 ? `${teamIds.length} đã chọn` : 'Chưa chọn đội nào'}
                </SheetSub>
              </HeaderTitleBlock>

              <HeaderActions>
                {teamIds.length > 0 && (
                  <TextBtn
                    onClick={clearAll}
                    whileTap={{ scale: 0.94 }}
                    $variant="danger"
                  >
                    Xóa hết
                  </TextBtn>
                )}
                <TextBtn onClick={closeModal} whileTap={{ scale: 0.94 }}>
                  Xong
                </TextBtn>
              </HeaderActions>
            </SheetHeader>

            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Tìm đội bóng..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus={false}
              />
            </SearchBar>

            <TeamList>
              {isLoading && teams.length === 0 && (
                <EmptyState>Đang tải danh sách đội...</EmptyState>
              )}

              {!isLoading && filtered.length === 0 && (
                <EmptyState>
                  {query ? `Không tìm thấy đội "${query}"` : 'Chưa có đội nào'}
                </EmptyState>
              )}

              {filtered.map((team, idx) => {
                const selected = teamIds.includes(team.id)
                return (
                  <TeamRow
                    key={team.id}
                    $selected={selected}
                    custom={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => toggleTeam(team.id)}
                    whileTap={{ scale: 0.98 }}
                    role="checkbox"
                    aria-checked={selected}
                  >
                    <Flag
                      countryCode={team.code}
                      flagUrl={team.flagUrl}
                      countryName={team.name}
                      size="sm"
                    />
                    <TeamInfo>
                      <TeamName>{team.name}</TeamName>
                      <TeamCode>{team.shortName}</TeamCode>
                    </TeamInfo>
                    <Checkmark $visible={selected} aria-hidden="true">
                      <CheckIcon />
                    </Checkmark>
                  </TeamRow>
                )
              })}
            </TeamList>
          </Sheet>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  )
}
