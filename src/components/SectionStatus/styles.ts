import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const StatusWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  padding: ${(p) => p.theme.space[8]} ${(p) => p.theme.space[3]};
  text-align: center;

  ${(p) => p.theme.mq.maxSm} {
    padding: ${(p) => p.theme.space[6]} ${(p) => p.theme.space[2]};
    gap: ${(p) => p.theme.space[2]};
  }
`

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.border.subtle};
  border-top-color: ${(p) => p.theme.colors.accent.primary};
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.5s;
  }
`

export const StatusIcon = styled.div`
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  line-height: 1;
  opacity: 0.7;
`

export const StatusTitle = styled.p`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.md};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  margin: 0;

  ${(p) => p.theme.mq.maxSm} {
    font-size: ${(p) => p.theme.fontSizes.sm};
  }
`

export const StatusSub = styled.p`
  font-size: ${(p) => p.theme.fontSizes.sm};
  color: ${(p) => p.theme.colors.text.disabled};
  max-width: 320px;
  margin: 0;
  line-height: 1.5;

  ${(p) => p.theme.mq.maxSm} {
    font-size: ${(p) => p.theme.fontSizes.xs};
  }
`
