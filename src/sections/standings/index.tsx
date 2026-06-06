'use client'

import React, { useState, useCallback } from 'react'
import { GroupTable } from './components/GroupTable'
import { StandingsModal } from './components/StandingsModal'
import { useStandings } from './hooks/useStandings'
import { useFavorites } from '@/hooks/useFavorites'
import { LoadingState, EmptyState } from '@/components/SectionStatus'
import {
  PanelHeader,
  SectionTitle,
  ViewAllBtn,
  GroupBlock,
  GroupHeader,
  GroupTitle,
  ExpandBtn,
} from './styles'

function IconExpand() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M1 10L10 1M10 1H5M10 1V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StandingsTab() {
  const { groups, isLoading } = useStandings()
  const { hasActiveFilter } = useFavorites()
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  // Ẩn button "Tất cả" khi không có bảng đấu nào (giải không có vòng bảng)
  const hasGroups = groups.length > 0

  return (
    <>
      <PanelHeader>
        <SectionTitle>Bảng xếp hạng</SectionTitle>

        {hasGroups && (
          <ViewAllBtn onClick={openModal} whileTap={{ scale: 0.94 }} title="Xem tất cả bảng đấu">
            <IconExpand />
            Tất cả
          </ViewAllBtn>
        )}
      </PanelHeader>

      {isLoading && !hasGroups && (
        <LoadingState
          title="Đang tải bảng xếp hạng"
          sub="Đang đồng bộ thứ hạng các bảng đấu."
        />
      )}

      {!isLoading && !hasGroups && (
        <EmptyState
          icon="📊"
          title="Chưa có bảng xếp hạng"
          sub={
            hasActiveFilter
              ? 'Không có bảng đấu nào chứa đội yêu thích của bạn. Bỏ filter để xem tất cả.'
              : 'Giải đấu này chưa có dữ liệu vòng bảng hoặc chưa diễn ra.'
          }
        />
      )}

      {groups.map((group) => (
        <GroupBlock key={group.id}>
          <GroupHeader>
            <GroupTitle>{group.name}</GroupTitle>
            <ExpandBtn
              onClick={openModal}
              whileTap={{ scale: 0.90 }}
              aria-label="Phóng to bảng xếp hạng"
            >
              <IconExpand />
            </ExpandBtn>
          </GroupHeader>
          <GroupTable onCloseStandingModal={closeModal} group={group} />
        </GroupBlock>
      ))}

      {modalOpen && <StandingsModal onClose={closeModal} />}
    </>
  )
}
