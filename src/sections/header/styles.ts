import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

const shimmerSlide = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

export const HeaderRoot = styled(motion.header)`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.panel};
  width: 100%;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[4]};
  padding: 0 ${(p) => p.theme.space[5]};

  background: ${(p) => p.theme.glass.frosted.background};
  backdrop-filter: ${(p) => p.theme.glass.frosted.backdropFilter};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(37, 99, 235, 0.35) 30%,
      rgba(37, 99, 235, 0.15) 70%,
      transparent 100%
    );
  }

  ${(p) => p.theme.mq.md} {
    padding: 0 ${(p) => p.theme.space[6]};
  }
`

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  flex-shrink: 0;
`

export const LogoMark = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
`

export const FifaWordmark = styled.span`
  font-family: ${(p) => p.theme.fonts.display};
  font-size: ${(p) => p.theme.fontSizes['4xl']};
  letter-spacing: ${(p) => p.theme.letterSpacings.stadium};
  line-height: 1;
  color: ${(p) => p.theme.colors.text.primary};
  text-transform: uppercase;
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.text.primary} 0%,
    rgba(255, 255, 255, 0.9) 40%,
    ${(p) => p.theme.colors.text.primary} 80%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmerSlide} 6s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: none;
    -webkit-text-fill-color: ${(p) => p.theme.colors.text.primary};
    color: ${(p) => p.theme.colors.text.primary};
  }
`

export const HeaderDivider = styled.div`
  width: 1px;
  height: 28px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${(p) => p.theme.colors.border.default},
    transparent
  );
  flex-shrink: 0;
`

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
`

export const TournamentYear = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.accent.primary};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  text-shadow: ${(p) => p.theme.glows.textCyan};
  line-height: 1;
`

export const TournamentSubtitle = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.stadium};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  line-height: 1;
`

export const CenterSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.space[3]};
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const PhasePill = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[4]};
  border-radius: ${(p) => p.theme.radii.pill};
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.18);
`

export const PhaseLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.accent.primary};
  text-transform: uppercase;
`

export const PhaseProgress = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1]};
`

export const ProgressDot = styled.div<{ $active: boolean; $done: boolean }>`
  width: 5px; height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active
      ? p.theme.colors.accent.primary
      : p.$done
        ? 'rgba(0,212,255,0.35)'
        : p.theme.colors.border.subtle};
  box-shadow: ${(p) => (p.$active ? p.theme.glows.cyanSm : 'none')};
  transition: all 0.3s ease;
`

export const CenterDivider = styled.div`
  width: 1px;
  height: 18px;
  background: ${(p) => p.theme.colors.border.subtle};
`

export const MatchCounter = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
`

export const CountLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
`

export const CountValue = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.theme.colors.text.primary};
`

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[3]};
  flex-shrink: 0;
  margin-left: auto;
`

export const ConnectionDot = styled(motion.div)<{ $status: 'connected' | 'disconnected' | 'idle' }>`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${(p) =>
    p.$status === 'connected'    ? p.theme.colors.accent.trail :
    p.$status === 'disconnected' ? p.theme.colors.accent.danger :
                                   p.theme.colors.text.disabled};
  box-shadow: ${(p) => p.$status === 'connected' ? p.theme.glows.mintSm : 'none'};
`

export const ConnectionLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const ConnectionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1.5]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[2.5]};
  border-radius: ${(p) => p.theme.radii.pill};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  background: rgba(0, 0, 0, 0.2);
`

export const PanelToggleBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[2]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.button};
  border: 1px solid ${(p) => p.theme.colors.border.glass};
  background: ${(p) => p.theme.glass.sm.background};
  backdrop-filter: ${(p) => p.theme.glass.sm.backdropFilter};
  color: ${(p) => p.theme.colors.text.secondary};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.border.active};
    color: ${(p) => p.theme.colors.text.primary};
    background: rgba(37, 99, 235, 0.06);
  }

  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const ToggleIcon = styled.span<{ $open: boolean }>`
  display: inline-block;
  width: 14px; height: 10px;
  position: relative;
  transition: transform 0.2s ease;

  &::before, &::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 1.5px;
    border-radius: 1px;
    background: currentColor;
    transition: transform 0.2s ease, opacity 0.2s ease, top 0.2s ease;
  }

  &::before {
    top: ${(p) => (p.$open ? '50%' : '0')};
    transform: ${(p) => (p.$open ? 'translateY(-50%) rotate(45deg)' : 'none')};
  }

  &::after {
    top: ${(p) => (p.$open ? '50%' : '100%')};
    transform: ${(p) => (p.$open ? 'translateY(-50%) rotate(-45deg)' : 'none')};
    opacity: ${(p) => (p.$open ? 1 : 1)};
  }
`

export const MobilePanelBtn = styled(motion.button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border.glass};
  background: ${(p) => p.theme.glass.sm.background};
  color: ${(p) => p.theme.colors.text.secondary};
  cursor: pointer;
  font-size: 16px;

  ${(p) => p.theme.mq.maxMd} { display: flex; }
`

// ── Favorites filter button ──────────────────────────────────────────────────

export const FilterBtn = styled(motion.button)<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space[1.5]};
  padding: ${(p) => p.theme.space[1.5]} ${(p) => p.theme.space[3]};
  border-radius: ${(p) => p.theme.radii.pill};
  border: 1px solid ${(p) =>
    p.$active ? p.theme.colors.accent.primary : p.theme.colors.border.glass};
  background: ${(p) =>
    p.$active ? 'rgba(37, 99, 235, 0.10)' : p.theme.glass.sm.background};
  backdrop-filter: ${(p) => p.theme.glass.sm.backdropFilter};
  color: ${(p) =>
    p.$active ? p.theme.colors.accent.primary : p.theme.colors.text.secondary};
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent.primary};
    color: ${(p) => p.theme.colors.accent.primary};
  }
`

// Badge số teams đã chọn (pill nhỏ bên cạnh icon)
export const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.accent.primary};
  color: #fff;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  line-height: 1;
`

export const FilterLabel = styled.span`
  ${(p) => p.theme.mq.maxMd} { display: none; }
`
