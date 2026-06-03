import styled from 'styled-components'
import { motion } from 'framer-motion'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const PositionGroup = styled.div``

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`

export const GroupLabel = styled.h3`
  display: flex;
  align-items: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
`

export const GroupCount = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.disabled};
  background: ${(p) => p.theme.colors.bg.elevated};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 999px;
  padding: 1px 7px;
`

// ── List layout ──────────────────────────────────────────────────────────────

export const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 36px 32px 36px 1fr auto 48px;
  grid-template-areas: 'pos jersey avatar name stats rating';
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 10px;
  cursor: pointer;
  will-change: transform;
  transition: background 180ms ease, border-color 180ms ease;

  /* Mobile: stats wrap below name */
  ${(p) => p.theme.mq.maxMd} {
    grid-template-columns: 32px 28px 32px 1fr 42px;
    grid-template-areas:
      'pos jersey avatar name rating'
      'pos jersey avatar stats stats';
    row-gap: 6px;
    gap: 10px;
    padding: 10px 12px;
  }

  &:hover {
    background: ${(p) => p.theme.colors.bg.elevated};
    border-color: ${(p) => p.theme.colors.border.default};
  }
`

// ── Player avatar ────────────────────────────────────────────────────────────

export const AvatarCol = styled.div`
  grid-area: avatar;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.elevated};
  flex-shrink: 0;
  ${(p) => p.theme.mq.maxMd} { width: 32px; height: 32px; }
`

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const AvatarFallback = styled.div<{ $color: string }>`
  width: 100%;
  height: 100%;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 11px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  letter-spacing: 0.02em;
  ${(p) => p.theme.mq.maxMd} { font-size: 10px; }
`

// ── Position badge (FIFA Online style) ───────────────────────────────────────

export const PosBadge = styled.span`
  grid-area: pos;
  width: 36px; height: 24px;
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 11px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  letter-spacing: 0.04em;
  ${(p) => p.theme.mq.maxMd} { width: 32px; height: 22px; font-size: 10px; }
`

// ── Jersey number ────────────────────────────────────────────────────────────

export const JerseyCol = styled.div`
  grid-area: jersey;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.lg};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.disabled};
  text-align: center;
  ${(p) => p.theme.mq.maxMd} { font-size: ${(p) => p.theme.fontSizes.base}; }
`

// ── Name + meta ──────────────────────────────────────────────────────────────

export const NameCol = styled.div`
  grid-area: name;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const PlayerName = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`

export const PlayerMeta = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 10px;
  color: ${(p) => p.theme.colors.text.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const CaptainTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px; height: 14px;
  border-radius: 3px;
  background: #f59e0b;
  color: #fff;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  line-height: 1;
  flex-shrink: 0;
`

// ── Inline stats ─────────────────────────────────────────────────────────────

export const StatsCol = styled.div`
  grid-area: stats;
  display: flex;
  align-items: center;
  gap: 14px;

  ${(p) => p.theme.mq.maxMd} {
    gap: 12px;
    justify-content: space-between;
    padding-top: 4px;
    border-top: 1px solid ${(p) => p.theme.colors.border.subtle};
  }

  /* Trên màn rất nhỏ (≤479px): ẩn YC/RC để tránh cramped — full stats vẫn ở drawer */
  ${(p) => p.theme.mq.maxSm} {
    gap: 10px;
    .stat-extra { display: none; }
  }
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 22px;
`

export const StatVal = styled.span<{ $color?: string }>`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: ${(p) => p.$color ?? p.theme.colors.text.primary};
  line-height: 1;
`

export const StatKey = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 2px;
`

// ── Rating pill ──────────────────────────────────────────────────────────────

export const RatingPill = styled.div<{ $color: string }>`
  grid-area: rating;
  width: 48px; height: 32px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.base};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  background: ${(p) => p.$color};
  box-shadow: 0 2px 6px ${(p) => p.$color}40;
  ${(p) => p.theme.mq.maxMd} { width: 42px; height: 28px; font-size: ${(p) => p.theme.fontSizes.sm}; }
`

// ── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: ${(p) => p.theme.colors.text.disabled};
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.sm};
`
