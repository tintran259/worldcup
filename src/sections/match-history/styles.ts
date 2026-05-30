import styled from 'styled-components'

export const SectionTitle = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin-bottom: ${(p) => p.theme.space[4]};
`

export const MatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.card};
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  cursor: pointer;
  transition: ${(p) => p.theme.transitions.normal};
  margin-bottom: ${(p) => p.theme.space[2]};

  &:hover {
    border-color: ${(p) => p.theme.colors.border.default};
    background: ${(p) => p.theme.colors.bg.overlay};
  }
`

export const TeamBlock = styled.div<{ $align: 'left' | 'right' }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  flex-direction: ${(p) => (p.$align === 'right' ? 'row-reverse' : 'row')};
`

export const TeamLabel = styled.span<{ $isWinner: boolean }>`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) =>
    p.$isWinner ? p.theme.fontWeights.bold : p.theme.fontWeights.regular};
  text-transform: uppercase;
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) =>
    p.$isWinner ? p.theme.colors.text.primary : p.theme.colors.text.muted};
`

export const ScoreCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1.5]};
`

export const ScoreDigit = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  min-width: 14px;
  text-align: center;
  line-height: 1;
`

export const ScoreDash = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
`

// Container cho score + meta row (date, cards) ở dưới
export const ScoreColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

// Row chứa date và card counts
export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.text.disabled};
  text-transform: uppercase;
  white-space: nowrap;
`

export const MetaDot = styled.span`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
`

// Pill nhỏ hiện số thẻ vàng/đỏ — chỉ show khi có data
export const CardPill = styled.span<{ $color: 'yellow' | 'red' }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 5px;
  border-radius: 4px;
  background: ${(p) => p.$color === 'yellow' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'};
  color:      ${(p) => p.$color === 'yellow' ? '#92400e'                : '#991b1b'};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};

  /* Khối màu nhỏ */
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 8px;
    border-radius: 1px;
    background: ${(p) => p.$color === 'yellow' ? '#f59e0b' : '#ef4444'};
  }
`
