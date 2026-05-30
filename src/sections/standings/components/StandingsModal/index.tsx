'use client'

import { useEffect } from 'react'
import { createPortal }  from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { GroupTable }      from '../GroupTable'
import { useStandings }    from '../../hooks/useStandings'
import { useCompetition }  from '@/hooks/useCompetition'
import {
  backdropVariants,
  modalVariants,
  groupCardVariants,
} from '../../animations/modal'
import {
  Backdrop,
  ModalPanel,
  ModalHeader,
  ModalTitle,
  ModalSub,
  CloseBtn,
  ModalBody,
  ModalGrid,
  ModalGroupCard,
  ModalGroupTitle,
  Legend,
  LegendItem,
  LegendDot,
} from './styles'

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export interface StandingsModalProps {
  onClose: () => void
}

export function StandingsModal({ onClose }: StandingsModalProps) {
  const { groups }   = useStandings()
  const competition  = useCompetition()

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const content = (
    <AnimatePresence>
      <Backdrop
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <ModalPanel
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Bảng xếp hạng tất cả vòng bảng"
        >
          <ModalHeader>
            <div>
              <ModalTitle>Bảng xếp hạng</ModalTitle>
              <ModalSub>{competition.name} · {groups.length} bảng đấu</ModalSub>
            </div>
            <CloseBtn onClick={onClose} whileTap={{ scale: 0.92 }} aria-label="Đóng">
              <IconClose />
            </CloseBtn>
          </ModalHeader>

          <ModalBody>
            <ModalGrid>
              {groups.map((group, i) => (
                <ModalGroupCard
                  key={group.id}
                  custom={i}
                  variants={groupCardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ModalGroupTitle>{group.name}</ModalGroupTitle>
                  <GroupTable group={group} compact />
                </ModalGroupCard>
              ))}
            </ModalGrid>
          </ModalBody>

          <Legend>
            <LegendItem>
              <LegendDot $s="qualified" />
              Đã vượt qua
            </LegendItem>
            <LegendItem>
              <LegendDot $s="pending" />
              Chưa xác định
            </LegendItem>
            <LegendItem>
              <LegendDot $s="eliminated" />
              Bị loại
            </LegendItem>
          </Legend>
        </ModalPanel>
      </Backdrop>
    </AnimatePresence>
  )

  // Rendered into document.body to avoid z-index stacking issues
  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null
}
