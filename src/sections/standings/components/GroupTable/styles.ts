import styled from 'styled-components'
import type { GroupRow, FormResult } from '../../types'

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const TH = styled.th<{ $r?: boolean }>`
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

export const TR = styled.tr<{ $s: GroupRow['advanceStatus'] }>`
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
  opacity: ${(p) => (p.$s === 'eliminated' ? 0.50 : 1)};
  background: ${(p) =>
    p.$s === 'qualified' ? 'rgba(37,99,235,0.035)' : 'transparent'};
  transition: background 0.12s ease, opacity 0.12s ease;
  &:hover   { background: rgba(37,99,235,0.06); opacity: 1; }
  &:last-child { border-bottom: none; }
`

export const TD = styled.td`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.secondary};
  text-align: center;
  padding: 4px 4px;
  &:first-child { text-align: left; padding-left: 0; }
`

export const TeamCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const PosNum = styled.span<{ $q: boolean }>`
  min-width: 10px;
  text-align: center;
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.$q ? p.theme.colors.accent.primary : p.theme.colors.text.muted};
`

export const TName = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
`

export const GDCell = styled(TD)<{ $v: number }>`
  color: ${(p) => p.$v > 0 ? '#10b981' : p.$v < 0 ? '#ef4444' : p.theme.colors.text.muted};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
`

export const PtsCell = styled(TD)`
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
`

export const StatusDot = styled.span<{ $s: GroupRow['advanceStatus'] }>`
  flex-shrink: 0;
  display: inline-block;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$s === 'qualified' ? p.theme.colors.accent.primary :
    p.$s === 'pending'   ? '#f59e0b' : '#cbd5e1'};
`

export const FormDots = styled.div`
  display: flex;
  gap: 2px;
`

export const FormDot = styled.span<{ $r: FormResult }>`
  width: 4px; height: 4px;
  border-radius: 50%;
  background: ${(p) =>
    p.$r === 'W' ? '#10b981' : p.$r === 'D' ? '#f59e0b' : '#ef4444'};
`
