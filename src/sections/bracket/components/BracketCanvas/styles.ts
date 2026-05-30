import styled from 'styled-components'

export const EmptyWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.bg.surface};
`

export const EmptyTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`
