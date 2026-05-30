'use client'

import React, { useState, useCallback } from 'react'
import { GroupTable } from './components/GroupTable'
import { StandingsModal } from './components/StandingsModal'
import { useStandings } from './hooks/useStandings'
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
  const { groups } = useStandings()
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <PanelHeader>
        <SectionTitle>Bảng xếp hạng</SectionTitle>

        <ViewAllBtn onClick={openModal} whileTap={{ scale: 0.94 }} title="Xem tất cả bảng đấu">
          <IconExpand />
          Tất cả
        </ViewAllBtn>
      </PanelHeader>

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
          <GroupTable group={group} />
        </GroupBlock>
      ))}

      {modalOpen && <StandingsModal onClose={closeModal} />}
    </>
  )
}
