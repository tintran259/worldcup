import styled from 'styled-components'

export const EmptyWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.bg.surface};
`
