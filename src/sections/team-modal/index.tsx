'use client'

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useTeamModalStore } from '@/stores'
import { TEAM_MAP } from '@/lib/mock/teams'
import { PLAYER_MAP } from '@/lib/mock/players'
import { OverviewTab } from './components/OverviewTab'
import { SquadTab } from './components/SquadTab'
import { TournamentStatsTab } from './components/TournamentStatsTab'
import { MatchesTab } from './components/MatchesTab'
import type { TeamModalTab } from '@/stores'
import { backdropVariants, modalContainerVariants, tabContentVariants } from './animations/modal'
import { drawerVariants, drawerOverlayVariants } from './animations/drawer'
import { countryCodeToFlagEmoji, getInitials } from '@/utils/match'
import { getRatingColor } from '@/utils/format'
import {
  Backdrop, ModalContainer, ModalHeader,
  TeamHeroRow, FlagCircle, TeamInfo, TeamNameText, TeamMetaRow,
  MetaChip, QualifiedBadge, CloseBtn,
  TabBar, TabBtn, TabText,
  BodyArea, ScrollPane,
  DrawerOverlay, DrawerPanel, DrawerHead, DrawerAvatar,
  DrawerPlayerInfo, DrawerName, DrawerSub, DrawerCloseBtn,
  DrawerBody, DrawerSection, DrawerSectionTitle,
  DrawerStatGrid, DrawerStatCard, DrawerStatVal, DrawerStatLabel,
  DrawerInfoRow, DrawerInfoKey, DrawerInfoVal,
  RatingBar, MarketValueTag,
} from './styles'

const TABS: { id: TeamModalTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'squad', label: 'Squad' },
  { id: 'stats', label: 'Stats' },
  { id: 'matches', label: 'Matches' },
]

// Aliases for shared utility functions (imported above)
const flagEmoji = countryCodeToFlagEmoji
const initials = getInitials

function ModalInner() {
  const {
    teamId, activeTab, activePlayerId,
    setTab, closeTeam, openPlayer, closePlayer,
  } = useTeamModalStore()

  const team = teamId ? TEAM_MAP.get(teamId) : null
  const player = activePlayerId ? PLAYER_MAP.get(activePlayerId) : null
  const tabIndex = TABS.findIndex(t => t.id === activeTab)

  const handleTabClick = useCallback((id: TeamModalTab) => {
    setTab(id)
  }, [setTab])

  if (!team) return null

  const teamColor = team.homeColor ?? '#2563eb'

  return (
    <ModalContainer
      variants={modalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label={`${team.name} — Team Details`}
    >
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
          {TABS.map((tab) => (
            <TabBtn
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            >
              <TabText>{tab.label}</TabText>
            </TabBtn>
          ))}
        </TabBar>
      </ModalHeader>

      <BodyArea>
        <AnimatePresence mode="wait" initial={false}>
          <ScrollPane
            key={activeTab}
            variants={tabContentVariants}
            custom={tabIndex}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeTab === 'overview' && <OverviewTab teamId={team.id} />}
            {activeTab === 'squad' && <SquadTab teamId={team.id} onPlayerClick={openPlayer} />}
            {activeTab === 'stats' && <TournamentStatsTab teamId={team.id} onPlayerClick={openPlayer} />}
            {activeTab === 'matches' && <MatchesTab teamId={team.id} />}
          </ScrollPane>
        </AnimatePresence>

        <AnimatePresence>
          {player && (
            <>
              <DrawerOverlay
                key="overlay"
                variants={drawerOverlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={closePlayer}
              />
              <DrawerPanel
                key="drawer"
                variants={drawerVariants}
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
                  <DrawerSection>
                    <DrawerSectionTitle>Tournament Stats</DrawerSectionTitle>
                    <DrawerStatGrid>
                      {[
                        { val: player.matchesPlayed, label: 'Matches' },
                        { val: player.tournamentGoals, label: 'Goals' },
                        { val: player.tournamentAssists, label: 'Assists' },
                        { val: player.minutesPlayed, label: 'Minutes' },
                        { val: player.tournamentYellowCards, label: 'Yellows', color: '#f59e0b' },
                        { val: player.tournamentRedCards, label: 'Reds', color: '#ef4444' },
                      ].map(({ val, label, color }) => (
                        <DrawerStatCard key={label}>
                          <DrawerStatVal style={color ? { color } : undefined}>{val}</DrawerStatVal>
                          <DrawerStatLabel>{label}</DrawerStatLabel>
                        </DrawerStatCard>
                      ))}
                    </DrawerStatGrid>
                  </DrawerSection>

                  <DrawerSection>
                    <DrawerSectionTitle>Rating</DrawerSectionTitle>
                    <DrawerStatVal>
                      {player.rating.toFixed(1)}
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}> / 10</span>
                    </DrawerStatVal>
                    <RatingBar
                      $pct={player.rating * 10}
                      $color={getRatingColor(player.rating)}
                    />
                  </DrawerSection>

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

export function TeamModal() {
  const { isOpen, activePlayerId, closeTeam, closePlayer } = useTeamModalStore()

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

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
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeTeam}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <ModalInner />
          </div>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body,
  )
}
