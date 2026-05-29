'use client'

import { useEffect, useCallback } from 'react'
import { createPortal }     from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTeamModalStore } from '@/store'
import { TEAM_MAP }          from '@/lib/mock/teams'
import { PLAYER_MAP }        from '@/lib/mock/players'
import { OverviewTab }       from './tabs/OverviewTab'
import { SquadTab }          from './tabs/SquadTab'
import { TournamentStatsTab } from './tabs/TournamentStatsTab'
import { MatchesTab }        from './tabs/MatchesTab'
import type { TeamModalTab } from '@/store'

// ── Tab config ─────────────────────────────────────────────────────────────────

const TABS: { id: TeamModalTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'squad',    label: 'Squad'    },
  { id: 'stats',    label: 'Stats'    },
  { id: 'matches',  label: 'Matches'  },
]

// ── Design tokens ──────────────────────────────────────────────────────────────
// Header uses dark broadcast style; body is light.

const HEADER_BG = 'linear-gradient(150deg, rgba(6,11,24,0.98) 0%, rgba(12,20,44,0.97) 100%)'
const BORDER    = 'rgba(255,255,255,0.10)'

// ── Animations ─────────────────────────────────────────────────────────────────

const backdropV = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
}

const containerV = {
  hidden:  { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 32 },
  },
  exit: {
    opacity: 0, scale: 0.97, y: 10,
    transition: { duration: 0.18, ease: 'easeIn' as const },
  },
}

const tabContentV = {
  enter:  (d: number) => ({ x: d > 0 ?  28 : -28, opacity: 0 }),
  center: {
    x: 0, opacity: 1,
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit:   (d: number) => ({
    x: d > 0 ? -28 : 28, opacity: 0,
    transition: { duration: 0.14 },
  }),
}

const drawerV = {
  hidden:  { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, stiffness: 340, damping: 30 } },
  exit:    { x: '100%', transition: { duration: 0.20, ease: 'easeIn' as const } },
}

// ── Backdrop ───────────────────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(6, 11, 24, 0.60);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  ${(p) => p.theme.mq.maxMd} {
    padding: 0;
    align-items: flex-end;
  }
`

// ── Modal container ────────────────────────────────────────────────────────────

const ModalContainer = styled(motion.div)`
  position: relative;
  width: min(1000px, 94vw);
  max-height: 88dvh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 32px 80px rgba(0,0,0,0.28),
    0 0 0 1px rgba(255,255,255,0.06);

  ${(p) => p.theme.mq.maxXl} {
    width: 90vw;
    max-height: 85dvh;
  }

  ${(p) => p.theme.mq.maxMd} {
    width: 100dvw;
    max-height: 100dvh;
    border-radius: 0;
    border-radius: 20px 20px 0 0;
  }
`

// ── Modal header (dark) ────────────────────────────────────────────────────────

const ModalHeader = styled.div<{ $teamColor: string }>`
  flex-shrink: 0;
  background: ${HEADER_BG};
  position: relative;
  overflow: hidden;

  /* Team color accent — top edge */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${(p) => p.$teamColor};
    opacity: 0.90;
  }

  /* Subtle team color glow in top-left corner */
  &::after {
    content: '';
    position: absolute;
    top: -60px; left: -60px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, ${(p) => p.$teamColor}28 0%, transparent 65%);
    pointer-events: none;
  }
`

const TeamHeroRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px 28px 16px;

  ${(p) => p.theme.mq.maxMd} {
    padding: 20px 20px 14px;
    gap: 14px;
  }
`

const FlagCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.12);
  flex-shrink: 0;
  font-size: 44px;
  line-height: 1;
  user-select: none;

  ${(p) => p.theme.mq.maxMd} {
    width: 56px;
    height: 56px;
    font-size: 34px;
  }
`

const TeamInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TeamNameText = styled.h1`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['3xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  letter-spacing: ${(p) => p.theme.letterSpacings.wide};
  color: #f0f4ff;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;

  ${(p) => p.theme.mq.maxMd} {
    font-size: ${(p) => p.theme.fontSizes['2xl']};
  }
`

const TeamMetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`

const MetaChip = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(148,163,184,0.85);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 6px;
  padding: 2px 8px;
`

const QualifiedBadge = styled.span<{ $q: boolean }>`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${(p) => p.$q ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.15)'};
  color: ${(p) => p.$q ? '#34d399' : '#f87171'};
  border: 1px solid ${(p) => p.$q ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.30)'};
`

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${BORDER};
  background: rgba(255,255,255,0.06);
  color: rgba(148,163,184,0.90);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
  line-height: 1;

  &:hover {
    background: rgba(255,255,255,0.12);
    color: #f0f4ff;
  }
`

// ── Tab bar ────────────────────────────────────────────────────────────────────

const TabBar = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 24px;
  border-top: 1px solid rgba(255,255,255,0.06);

  ${(p) => p.theme.mq.maxMd} {
    padding: 0 16px;
  }
`

const TabBtn = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 0 4px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${(p) => p.$active ? '#f0f4ff' : 'rgba(148,163,184,0.70)'};
  transition: color 0.15s ease;
  flex: 1;

  &:hover { color: ${(p) => p.$active ? '#f0f4ff' : 'rgba(248,250,252,0.80)'}; }

  /* Active indicator */
  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 4px; right: 4px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${(p) => p.$active ? '#3b82f6' : 'transparent'};
    transition: background 0.18s ease;
  }
`

const TabText = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.wider};
  text-transform: uppercase;
  line-height: 1;
`

// ── Modal body (light) ─────────────────────────────────────────────────────────

const BodyArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  background: ${(p) => p.theme.colors.bg.base};
  overflow: hidden;
`

const ScrollPane = styled(motion.div)`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;

  scrollbar-width: thin;
  scrollbar-color: rgba(100,116,139,0.25) transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(100,116,139,0.25);
    border-radius: 2px;
  }

  ${(p) => p.theme.mq.maxMd} {
    padding: 16px;
  }
`

// ── Player Drawer ──────────────────────────────────────────────────────────────

const DrawerOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(6,11,24,0.40);
  z-index: 20;
`

const DrawerPanel = styled(motion.aside)`
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: min(360px, 100%);
  background: ${(p) => p.theme.colors.bg.surface};
  border-left: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: -8px 0 40px rgba(0,0,0,0.14);
  z-index: 21;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const DrawerHead = styled.div`
  flex-shrink: 0;
  padding: 20px 20px 16px;
  background: ${HEADER_BG};
  display: flex;
  align-items: flex-start;
  gap: 14px;
`

const DrawerAvatar = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: 18px;
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: #fff;
  border: 2px solid rgba(255,255,255,0.20);
  letter-spacing: 0.02em;
`

const DrawerPlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const DrawerName = styled.h2`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xl};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: #f0f4ff;
  letter-spacing: 0.02em;
  line-height: 1.2;
`

const DrawerSub = styled.p`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: rgba(148,163,184,0.80);
  margin-top: 4px;
  letter-spacing: 0.04em;
`

const DrawerCloseBtn = styled.button`
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid ${BORDER};
  background: rgba(255,255,255,0.06);
  color: rgba(148,163,184,0.80);
  cursor: pointer;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  &:hover { background: rgba(255,255,255,0.12); color: #f0f4ff; }
`

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  scrollbar-width: thin;
  scrollbar-color: rgba(100,116,139,0.20) transparent;
  &::-webkit-scrollbar { width: 3px; }
`

const DrawerSection = styled.div`
  margin-bottom: 20px;
`

const DrawerSectionTitle = styled.h3`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xs']};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};
`

const DrawerStatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const DrawerStatCard = styled.div`
  background: ${(p) => p.theme.colors.bg.elevated};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  border-radius: 8px;
  padding: 10px 12px;
`

const DrawerStatVal = styled.div`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes['2xl']};
  font-weight: ${(p) => p.theme.fontWeights.black};
  color: ${(p) => p.theme.colors.text.primary};
  line-height: 1;
`

const DrawerStatLabel = styled.div`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.text.muted};
  margin-top: 3px;
`

const DrawerInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.subtle};

  &:last-child { border-bottom: none; }
`

const DrawerInfoKey = styled.span`
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  color: ${(p) => p.theme.colors.text.muted};
`

const DrawerInfoVal = styled.span`
  font-family: ${(p) => p.theme.fonts.body};
  font-size: ${(p) => p.theme.fontSizes.sm};
  font-weight: ${(p) => p.theme.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text.primary};
`

const RatingBar = styled.div<{ $pct: number; $color: string }>`
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.theme.colors.border.subtle};
  overflow: hidden;
  margin-top: 4px;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: ${(p) => p.$color};
    border-radius: 3px;
    transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
`

const MarketValueTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(251,191,36,0.10);
  border: 1px solid rgba(251,191,36,0.22);
  border-radius: 6px;
  padding: 3px 10px;
  font-family: ${(p) => p.theme.fonts.mono};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  color: #b45309;
`

// ── Emoji flag helper ──────────────────────────────────────────────────────────

function flagEmoji(code: string): string {
  return code.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

// ── Inner modal ────────────────────────────────────────────────────────────────

function ModalInner() {
  const {
    teamId,
    activeTab,
    activePlayerId,
    setTab,
    closeTeam,
    openPlayer,
    closePlayer,
  } = useTeamModalStore()

  const team   = teamId ? TEAM_MAP.get(teamId) : null
  const player = activePlayerId ? PLAYER_MAP.get(activePlayerId) : null

  const tabIndex   = TABS.findIndex(t => t.id === activeTab)
  const prevTabIdx = TABS.findIndex(t => t.id === activeTab) // stable — we store dir manually below

  // Tab transition direction
  const handleTabClick = useCallback((id: TeamModalTab, idx: number) => {
    setTab(id)
  }, [setTab])

  if (!team) return null

  const teamColor = team.homeColor ?? '#2563eb'

  return (
    <ModalContainer
      variants={containerV}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label={`${team.name} — Team Details`}
    >
      {/* ── Header ── */}
      <ModalHeader $teamColor={teamColor}>
        <TeamHeroRow>
          <FlagCircle aria-hidden="true">
            {flagEmoji(team.code)}
          </FlagCircle>

          <TeamInfo>
            <TeamNameText>{team.name}</TeamNameText>
            <TeamMetaRow>
              <MetaChip>#{team.fifaRank} FIFA</MetaChip>
              <MetaChip>{team.confederation}</MetaChip>
              <MetaChip>Group {team.group}</MetaChip>
              <QualifiedBadge $q={team.qualified}>
                {team.qualified ? '✓ Qualified' : 'Eliminated'}
              </QualifiedBadge>
            </TeamMetaRow>
          </TeamInfo>

          <CloseBtn onClick={closeTeam} aria-label="Close">✕</CloseBtn>
        </TeamHeroRow>

        <TabBar role="tablist">
          {TABS.map((tab, idx) => (
            <TabBtn
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id, idx)}
            >
              <TabText>{tab.label}</TabText>
            </TabBtn>
          ))}
        </TabBar>
      </ModalHeader>

      {/* ── Body ── */}
      <BodyArea>
        <AnimatePresence mode="wait" initial={false}>
          <ScrollPane
            key={activeTab}
            variants={tabContentV}
            custom={tabIndex}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeTab === 'overview' && <OverviewTab teamId={team.id} />}
            {activeTab === 'squad'    && <SquadTab    teamId={team.id} onPlayerClick={openPlayer} />}
            {activeTab === 'stats'    && <TournamentStatsTab teamId={team.id} onPlayerClick={openPlayer} />}
            {activeTab === 'matches'  && <MatchesTab  teamId={team.id} />}
          </ScrollPane>
        </AnimatePresence>

        {/* ── Player Drawer ── */}
        <AnimatePresence>
          {player && (
            <>
              <DrawerOverlay
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={closePlayer}
              />
              <DrawerPanel
                key="drawer"
                variants={drawerV}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DrawerHead>
                  <DrawerAvatar $color={teamColor}>
                    {initials(player.name)}
                  </DrawerAvatar>
                  <DrawerPlayerInfo>
                    <DrawerName>{player.name}</DrawerName>
                    <DrawerSub>
                      #{player.shirtNumber} · {player.position} · {player.club}
                    </DrawerSub>
                  </DrawerPlayerInfo>
                  <DrawerCloseBtn onClick={closePlayer} aria-label="Close player">✕</DrawerCloseBtn>
                </DrawerHead>

                <DrawerBody>
                  {/* Tournament stats */}
                  <DrawerSection>
                    <DrawerSectionTitle>Tournament Stats</DrawerSectionTitle>
                    <DrawerStatGrid>
                      <DrawerStatCard>
                        <DrawerStatVal>{player.matchesPlayed}</DrawerStatVal>
                        <DrawerStatLabel>Matches</DrawerStatLabel>
                      </DrawerStatCard>
                      <DrawerStatCard>
                        <DrawerStatVal>{player.tournamentGoals}</DrawerStatVal>
                        <DrawerStatLabel>Goals</DrawerStatLabel>
                      </DrawerStatCard>
                      <DrawerStatCard>
                        <DrawerStatVal>{player.tournamentAssists}</DrawerStatVal>
                        <DrawerStatLabel>Assists</DrawerStatLabel>
                      </DrawerStatCard>
                      <DrawerStatCard>
                        <DrawerStatVal>{player.minutesPlayed}</DrawerStatVal>
                        <DrawerStatLabel>Minutes</DrawerStatLabel>
                      </DrawerStatCard>
                      <DrawerStatCard>
                        <DrawerStatVal style={{ color: '#f59e0b' }}>
                          {player.tournamentYellowCards}
                        </DrawerStatVal>
                        <DrawerStatLabel>Yellows</DrawerStatLabel>
                      </DrawerStatCard>
                      <DrawerStatCard>
                        <DrawerStatVal style={{ color: '#ef4444' }}>
                          {player.tournamentRedCards}
                        </DrawerStatVal>
                        <DrawerStatLabel>Reds</DrawerStatLabel>
                      </DrawerStatCard>
                    </DrawerStatGrid>
                  </DrawerSection>

                  {/* Rating */}
                  <DrawerSection>
                    <DrawerSectionTitle>Rating</DrawerSectionTitle>
                    <DrawerStatVal>
                      {player.rating.toFixed(1)}
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}> / 10</span>
                    </DrawerStatVal>
                    <RatingBar
                      $pct={player.rating * 10}
                      $color={
                        player.rating >= 9.0 ? '#10b981' :
                        player.rating >= 8.0 ? '#3b82f6' : '#f59e0b'
                      }
                    />
                  </DrawerSection>

                  {/* Profile */}
                  <DrawerSection>
                    <DrawerSectionTitle>Profile</DrawerSectionTitle>
                    <DrawerInfoRow>
                      <DrawerInfoKey>Age</DrawerInfoKey>
                      <DrawerInfoVal>{player.age}</DrawerInfoVal>
                    </DrawerInfoRow>
                    <DrawerInfoRow>
                      <DrawerInfoKey>Club</DrawerInfoKey>
                      <DrawerInfoVal>{player.club}</DrawerInfoVal>
                    </DrawerInfoRow>
                    <DrawerInfoRow>
                      <DrawerInfoKey>League</DrawerInfoKey>
                      <DrawerInfoVal>{player.clubLeague}</DrawerInfoVal>
                    </DrawerInfoRow>
                    {player.isCaptain && (
                      <DrawerInfoRow>
                        <DrawerInfoKey>Role</DrawerInfoKey>
                        <DrawerInfoVal>⭐ Captain</DrawerInfoVal>
                      </DrawerInfoRow>
                    )}
                    <DrawerInfoRow>
                      <DrawerInfoKey>Market Value</DrawerInfoKey>
                      <MarketValueTag>💰 {player.marketValue}</MarketValueTag>
                    </DrawerInfoRow>
                  </DrawerSection>
                </DrawerBody>
              </DrawerPanel>
            </>
          )}
        </AnimatePresence>
      </BodyArea>
    </ModalContainer>
  )
}

// ── Exported portal component ──────────────────────────────────────────────────

export function TeamModal() {
  const { isOpen, activePlayerId, closeTeam, closePlayer } = useTeamModalStore()

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (activePlayerId) closePlayer()
      else closeTeam()
    }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, activePlayerId, closePlayer, closeTeam])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          key="team-modal-backdrop"
          variants={backdropV}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeTeam}
        >
          {/* Stop click propagation so the modal itself doesn't close */}
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ModalInner />
          </div>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  )
}
