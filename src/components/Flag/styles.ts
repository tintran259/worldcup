import styled from "styled-components";
import { FlagSize } from ".";

export const sizeDimensions: Record<FlagSize, { width: number; height: number }> = {
  xs: { width: 16, height: 11 },
  sm: { width: 20, height: 14 },
  md: { width: 28, height: 20 },
  lg: { width: 40, height: 28 },
  xl: { width: 56, height: 40 },
}

export const FlagWrapper = styled.span<{ $size: FlagSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => sizeDimensions[p.$size].width}px;
  height: ${(p) => sizeDimensions[p.$size].height}px;
  border-radius: ${(p) => p.theme.radii.xs};
  overflow: hidden;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.bg.overlay};
  font-size: ${(p) => {
    const sizes = { xs: '12px', sm: '14px', md: '18px', lg: '24px', xl: '32px' }
    return sizes[p.$size]
  }};
  line-height: 1;
`

/**
 * Image fill bên trong FlagWrapper.
 * Logo team từ api-football thường là PNG vuông trong suốt → dùng `contain`
 * để giữ tỷ lệ và không bị crop.
 */
export const FlagImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`
