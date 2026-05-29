'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag } from '@/ui/primitives/Flag'
import { GROUP_STANDINGS } from '@/lib/mock'
import type { GroupStage, GroupRow, FormResult } from '@/lib/mock'

// ═══════════════════════════════════════════════════════════════════════════════
// Shared micro-components
// ═══════════════════════════════════════════════════════════════════════════════

const StatusDot = styled.span<{ $s: GroupRow['advanceStatus'] }>`
  flex-shrink: 0;
  display: inline-block;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$s === 'qualified'  ? p.theme.colors.accent.primary :
    p.$s === 'pending'    ? '#f59e0b' : '#cbd5e1'};
`

const FormDots = styled.div`
  display: flex; gap: 2px;
`

const FormDot = styled.span<{ $r: FormResult }>`
  width: 4px; height: 4px; border-radius: 50%;
  background: ${(p) =>
    p.$r === 'W' ? '#10b981' : p.$r === 'D' ? '#f59e0b' : '#ef4444'};
`

// ═══════════════════════════════════════════════════════════════════════════════
// GroupTable — reused in both panel and modal
// ═══════════════════════════════════════════════════════════════════════════════

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TH = styled.th<{ $r?: boolean }>`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.07em;
  color: ${(p) => p.theme.colors.text.disabled};
  text-transform: uppercase;
  text-align: ${(p) => (p.$r ? 'right' : 'center')};
  padding: 3px 4px;
  &:first-child { text-align: left; padding-left: 0; }
`

const TR = styled.tr<{ $s: GroupRow['advanceStatus'] }>`
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  opacity: ${(p) => (p.$s === 'eliminated' ? 0.50 : 1)};
  background: ${(p) =>
    p.$s === 'qualified' ? 'rgba(37,99,235,0.035)' : 'transparent'};
  transition: background 0.12s ease, opacity 0.12s ease;
  &:hover   { background: rgba(37,99,235,0.06); opacity: 1; }
  &:last-child { border-bottom: none; }
`

const TD = styled.td`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.secondary};
  text-align: center;
  padding: 4px 4px;
  &:first-child { text-align: left; padding-left: 0; }
`

const TeamCell = styled.div`
  display: flex; align-items: center; gap: 6px;
`

const PosNum = styled.span<{ $q: boolean }>`
  min-width: 10px; text-align: center;
  font-size: 9px; font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.$q ? p.theme.colors.accent.primary : p.theme.colors.text.muted};
`

const TName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
`

const GDCell = styled(TD)<{ $v: number }>`
  color: ${(p) => p.$v > 0 ? '#10b981' : p.$v < 0 ? '#ef4444' : p.theme.colors.text.muted};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
`

const PtsCell = styled(TD)`
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
`

interface GroupTableProps { group: GroupStage; compact?: boolean }

function GroupTable({ group, compact }: GroupTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <TH style={{ width: 16 }}>#</TH>
          <TH style={{ textAlign: 'left' }}>Đội</TH>
          <TH>Đ</TH>
          {!compact && <><TH>T</TH><TH>H</TH><TH>B</TH></>}
          <TH>HS</TH>
          <TH>Pts</TH>
        </tr>
      </thead>
      <tbody>
        {group.teams.map((row) => (
          <TR key={row.team.id} $s={row.advanceStatus}>
            <TD>
              <TeamCell>
                <StatusDot $s={row.advanceStatus} />
                <PosNum $q={row.advanceStatus === 'qualified'}>{row.position}</PosNum>
              </TeamCell>
            </TD>
            <TD>
              <TeamCell>
                <Flag countryCode={row.team.code} size="xs" />
                <div>
                  <TName>{row.team.shortName}</TName>
                  {!compact && (
                    <FormDots>
                      {row.form.map((f, i) => <FormDot key={i} $r={f} title={f} />)}
                    </FormDots>
                  )}
                </div>
              </TeamCell>
            </TD>
            <TD>{row.played}</TD>
            {!compact && (
              <>
                <TD>{row.won}</TD>
                <TD>{row.drawn}</TD>
                <TD>{row.lost}</TD>
              </>
            )}
            <GDCell $v={row.goalDifference}>
              {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
            </GDCell>
            <PtsCell>{row.points}</PtsCell>
          </TR>
        ))}
      </tbody>
    </Table>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group block (panel view)
// ═══════════════════════════════════════════════════════════════════════════════

const GroupBlock = styled.div`
  margin-bottom: ${(p) => p.theme.space[4]};

  &:last-child { margin-bottom: 0; }
`

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.space[2]};
`

const GroupTitle = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
`

const ExpandBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(37,99,235,0.08);
    border-color: ${(p) => p.theme.colors.accent.primary};
    color: ${(p) => p.theme.colors.accent.primary};
  }

  svg { display: block; }
`

// ── Expand icon ───────────────────────────────────────────────────────────────

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

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Modal
// ═══════════════════════════════════════════════════════════════════════════════

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

const ModalPanel = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 960px;
  max-height: calc(100vh - 48px);
  border-radius: 18px;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  flex-shrink: 0;
`

const ModalTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.text.primary};
  text-transform: uppercase;
`

const ModalSub = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.05em;
  margin-left: 8px;
`

const CloseBtn = styled(motion.button)`
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.35);
    color: #ef4444;
  }
`

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  /* Scrollbar */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.border.subtle};
    border-radius: 3px;
  }
`

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ModalGroupCard = styled(motion.div)`
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 10px;
  padding: 12px;
  background: ${(p) => p.theme.colors.bg.elevated};

  /* Blue left accent */
  border-left: 3px solid ${(p) => p.theme.colors.accent.primary};
`

const ModalGroupTitle = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
  margin-bottom: 8px;
`

// Legend row at the bottom of the modal
const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  flex-shrink: 0;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.03em;
`

// ── Framer Motion variants ────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.30, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0, scale: 0.96, y: 8,
    transition: { duration: 0.18 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.28, delay: i * 0.04 },
  }),
}

// ═══════════════════════════════════════════════════════════════════════════════
// Modal component (portal)
// ═══════════════════════════════════════════════════════════════════════════════

interface StandingsModalProps { onClose: () => void }

function StandingsModal({ onClose }: StandingsModalProps) {
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
          {/* ── Header ── */}
          <ModalHeader>
            <div>
              <ModalTitle>Bảng xếp hạng</ModalTitle>
              <ModalSub>FIFA World Cup 2026™ · 12 bảng đấu</ModalSub>
            </div>
            <CloseBtn
              onClick={onClose}
              whileTap={{ scale: 0.92 }}
              aria-label="Đóng"
            >
              <IconClose />
            </CloseBtn>
          </ModalHeader>

          {/* ── Grid ── */}
          <ModalBody>
            <ModalGrid>
              {GROUP_STANDINGS.map((group, i) => (
                <ModalGroupCard
                  key={group.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ModalGroupTitle>{group.name}</ModalGroupTitle>
                  <GroupTable group={group} compact />
                </ModalGroupCard>
              ))}
            </ModalGrid>
          </ModalBody>

          {/* ── Legend ── */}
          <Legend>
            <LegendItem>
              <StatusDot $s="qualified" />
              Đã vượt qua
            </LegendItem>
            <LegendItem>
              <StatusDot $s="pending" />
              Chưa xác định
            </LegendItem>
            <LegendItem>
              <StatusDot $s="eliminated" />
              Bị loại
            </LegendItem>
          </Legend>
        </ModalPanel>
      </Backdrop>
    </AnimatePresence>
  )

  // Render into document.body via portal (avoids z-index stacking issues)
  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null
}

// ═══════════════════════════════════════════════════════════════════════════════
// Panel header
// ═══════════════════════════════════════════════════════════════════════════════

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.space[3]};
`

const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

const ViewAllBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: transparent;
  color: ${(p) => p.theme.colors.text.muted};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(37,99,235,0.08);
    border-color: ${(p) => p.theme.colors.accent.primary};
    color: ${(p) => p.theme.colors.accent.primary};
  }

  svg { flex-shrink: 0; }
`

// ═══════════════════════════════════════════════════════════════════════════════
// Main export
// ═══════════════════════════════════════════════════════════════════════════════

export function StandingsTab() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal  = useCallback(() => setModalOpen(true),  [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      {/* ── Panel header ── */}
      <PanelHeader>
        <SectionTitle>Bảng xếp hạng</SectionTitle>

        <ViewAllBtn
          onClick={openModal}
          whileTap={{ scale: 0.94 }}
          title="Xem tất cả bảng đấu"
        >
          <IconExpand />
          Tất cả
        </ViewAllBtn>
      </PanelHeader>

      {/* ── Group list ── */}
      {GROUP_STANDINGS.map((group) => (
        <GroupBlock key={group.id}>
          <GroupHeader>
            <GroupTitle>{group.name}</GroupTitle>

            <ExpandBtn
              onClick={openModal}
              whileTap={{ scale: 0.90 }}
              title={`Xem tất cả bảng đấu`}
              aria-label="Phóng to bảng xếp hạng"
            >
              <IconExpand />
            </ExpandBtn>
          </GroupHeader>

          <GroupTable group={group} />
        </GroupBlock>
      ))}

      {/* ── Modal (portal) ── */}
      {modalOpen && <StandingsModal onClose={closeModal} />}
    </>
  )
}
