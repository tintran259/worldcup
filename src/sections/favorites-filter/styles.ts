import styled from 'styled-components'
import { motion } from 'framer-motion'

// ── Backdrop ───────────────────────────────────────────────────────────────────

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(6, 11, 24, 0.55);
  backdrop-filter: blur(4px);
  z-index: 600;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  ${(p) => p.theme.mq.md} {
    align-items: center;
  }
`

// ── Sheet container (iOS style) ────────────────────────────────────────────────

export const Sheet = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  max-height: 85dvh;
  background: ${(p) => p.theme.colors.bg.elevated};
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.18);

  ${(p) => p.theme.mq.md} {
    border-radius: 20px;
    max-height: 80dvh;
  }
`

// Grab handle (iOS look)
export const GrabHandle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border.default};
  margin: 8px auto 4px;
  flex-shrink: 0;
`

// ── Header ────────────────────────────────────────────────────────────────────

export const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  flex-shrink: 0;
`

export const HeaderTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const SheetTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
  letter-spacing: 0.02em;
`

export const SheetSub = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const TextBtn = styled(motion.button)<{ $variant?: 'primary' | 'danger' }>`
  background: transparent;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  cursor: pointer;
  color: ${(p) =>
    p.$variant === 'danger'
      ? p.theme.colors.accent.danger
      : p.theme.colors.accent.primary};

  &:disabled {
    color: ${(p) => p.theme.colors.text.disabled};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.04);
  }
`

// ── Search ────────────────────────────────────────────────────────────────────

export const SearchBar = styled.div`
  padding: 8px 16px 12px;
  flex-shrink: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: ${(p) => p.theme.colors.bg.surface};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.primary};
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: ${(p) => p.theme.colors.text.disabled};
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.accent.primary};
    background: ${(p) => p.theme.colors.bg.base};
  }
`

// ── Team list ─────────────────────────────────────────────────────────────────

export const TeamList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 0 16px;

  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.25) transparent;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 2px;
  }
`

export const TeamRow = styled(motion.button)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 16px;
  background: ${(p) =>
    p.$selected ? 'rgba(37, 99, 235, 0.06)' : 'transparent'};
  border: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;

  &:hover {
    background: ${(p) =>
    p.$selected
      ? 'rgba(37, 99, 235, 0.10)'
      : 'rgba(0, 0, 0, 0.03)'};
  }

  &:last-child {
    border-bottom: none;
  }
`

export const TeamInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
`

export const TeamName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TeamCode = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

// iOS-style checkmark — chỉ hiện khi selected
export const Checkmark = styled.div<{ $visible: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: scale(${(p) => (p.$visible ? 1 : 0.6)});
  transition: opacity 0.15s ease, transform 0.15s ease;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
`

// Loading + empty states
export const EmptyState = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${(p) => p.theme.colors.text.muted};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.sm};
`
