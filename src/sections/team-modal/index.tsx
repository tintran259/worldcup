'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useTeamModalStore } from '@/stores'
import { useTeamDetail } from './hooks/useTeamDetail'
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
  Backdrop, ModalContainer, GrabHandle, ModalHeader,
  TeamHeroRow, FlagCircle, FlagImg, TeamInfo, TeamNameText, TeamMetaRow,
  MetaChip, QualifiedBadge, CloseBtn,
  TabBar, TabBtn, TabText,
  BodyArea, ScrollPane,
  DrawerOverlay, DrawerPanel, DrawerHead, DrawerAvatar,
  DrawerPlayerInfo, DrawerName, DrawerSub, DrawerCloseBtn,
  DrawerBody, DrawerSection, DrawerSectionTitle,
  DrawerStatGrid, DrawerStatCard, DrawerStatIcon, DrawerStatVal, DrawerStatLabel,
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

  // Fetch team + squad + matches từ API (1 lần cho tất cả 4 tabs)
  const { team, players, matches } = useTeamDetail(teamId)
  const player = activePlayerId ? players.find((p) => p.id === activePlayerId) ?? null : null
  const tabIndex = TABS.findIndex(t => t.id === activeTab)

  console.log("team:", team);
  console.log("players:", players);
  console.log("matches:", matches);
  console.log("activeTab:", activeTab);


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
      <GrabHandle aria-hidden="true" />
      <ModalHeader $teamColor={teamColor}>
        <TeamHeroRow>
          <FlagCircle aria-hidden="true">
            {team.flagUrl ? (
              <FlagImg
                src={team.flagUrl}
                alt={team.name}
                onError={(e) => {
                  // Fallback emoji nếu image fail load
                  const target = e.currentTarget
                  target.style.display = 'none'
                  target.parentElement!.textContent = flagEmoji(team.code)
                }}
              />
            ) : (
              flagEmoji(team.code)
            )}
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
            {activeTab === 'overview' && <OverviewTab team={team} players={players} matches={matches} />}
            {activeTab === 'squad' && <SquadTab team={team} players={players} onPlayerClick={openPlayer} />}
            {activeTab === 'stats' && <TournamentStatsTab team={team} players={players} matches={matches} onPlayerClick={openPlayer} />}
            {activeTab === 'matches' && <MatchesTab teamId={team.id} matches={matches} />}
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
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => {
                          const target = e.currentTarget
                          target.style.display = 'none'
                          target.parentElement!.textContent = initials(player.name)
                        }}
                      />
                    ) : (
                      initials(player.name)
                    )}
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
                      {(() => {
                        // Defensive: cast to Number để tránh undefined/null/NaN render trống
                        const safe = (n: number | undefined | null): number =>
                          typeof n === 'number' && !isNaN(n) ? n : 0
                        const stats = [
                          { icon: '⚽',  val: safe(player.matchesPlayed),         label: 'Matches', color: '#3b82f6' },
                          { icon: '🎯',  val: safe(player.tournamentGoals),       label: 'Goals',   color: '#10b981' },
                          { icon: '🅰️', val: safe(player.tournamentAssists),     label: 'Assists', color: '#8b5cf6' },
                          { icon: '⏱',  val: `${safe(player.minutesPlayed)}'`,   label: 'Minutes', color: '#0ea5e9' },
                          { icon: '🟨',  val: safe(player.tournamentYellowCards), label: 'Yellow',  color: '#f59e0b' },
                          { icon: '🟥',  val: safe(player.tournamentRedCards),    label: 'Red',     color: '#ef4444' },
                        ]
                        return stats.map(({ icon, val, label, color }) => (
                          <DrawerStatCard key={label} $accent={color}>
                            <DrawerStatIcon aria-hidden="true">{icon}</DrawerStatIcon>
                            <DrawerStatVal style={{ color }}>{val}</DrawerStatVal>
                            <DrawerStatLabel>{label}</DrawerStatLabel>
                          </DrawerStatCard>
                        ))
                      })()}
                    </DrawerStatGrid>
                  </DrawerSection>

                  <DrawerSection>
                    <DrawerSectionTitle>Rating</DrawerSectionTitle>
                    {(() => {
                      const rating = typeof player.rating === 'number' && !isNaN(player.rating)
                        ? player.rating
                        : 0
                      return (
                        <>
                          <DrawerStatVal style={{ color: getRatingColor(rating) }}>
                            {rating.toFixed(1)}
                            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}> / 10</span>
                          </DrawerStatVal>
                          <RatingBar
                            $pct={rating * 10}
                            $color={getRatingColor(rating)}
                          />
                        </>
                      )
                    })()}
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

  // Hydration-safe portal mount (xem comment trong LiveEventToast)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

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

  if (!mounted) return null

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
