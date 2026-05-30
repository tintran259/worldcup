import styled from 'styled-components'

export const Wrapper = styled.div<{ $dragging: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.surface};
  touch-action: none;
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
  outline: none;

  background-image: radial-gradient(
    circle,
    rgba(100, 116, 139, 0.10) 1px,
    transparent 1px
  );
  background-size: 24px 24px;

  &:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.40);
    outline-offset: -2px;
  }
`

export const ContentLayer = styled.div<{ $width: number; $height: number }>`
  position: absolute;
  width: ${(p) => p.$width}px;
  height: ${(p) => p.$height}px;
  transform-origin: 0 0;
  will-change: transform;
`
