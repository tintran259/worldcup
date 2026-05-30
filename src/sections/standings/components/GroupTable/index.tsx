'use client'

import React from 'react'
import { Flag } from '@/components/Flag'
import { useTeamModalStore } from '@/stores'
import type { GroupStage } from '../../types'
import {
  Table, TH, TR, TD, TeamCell, PosNum, TName,
  GDCell, PtsCell, StatusDot, FormDots, FormDot,
} from './styles'

export interface GroupTableProps {
  group: GroupStage
  /** When compact is true, W/D/L columns and form dots are hidden */
  compact?: boolean
}

export function GroupTable({ group, compact }: GroupTableProps) {
  const { openTeam } = useTeamModalStore()

  return (
    <Table>
      <thead>
        <tr>
          <TH style={{ width: 16 }}>#</TH>
          <TH style={{ textAlign: 'left' }}>Đội</TH>
          <TH>Đ</TH>
          {!compact && <><TH>T</TH><TH>H</TH><TH>B</TH></>}
          <TH>HS</TH>
          <TH>Pts</TH>
        </tr>
      </thead>
      <tbody>
        {group.teams.map((row) => (
          <TR key={row.team.id} $s={row.advanceStatus}
            onClick={() => openTeam(row.team.id)}
            style={{ cursor: 'pointer' }}
          >
            <TD>
              <TeamCell>
                <StatusDot $s={row.advanceStatus} />
                <PosNum $q={row.advanceStatus === 'qualified'}>{row.position}</PosNum>
              </TeamCell>
            </TD>
            <TD>
              <TeamCell>
                <Flag countryCode={row.team.code} flagUrl={row.team.flagUrl} size="xs" />
                <div>
                  <TName>{row.team.shortName}</TName>
                  {!compact && (
                    <FormDots>
                      {row.form.map((f, i) => <FormDot key={i} $r={f} title={f} />)}
                    </FormDots>
                  )}
                </div>
              </TeamCell>
            </TD>
            <TD>{row.played}</TD>
            {!compact && (
              <>
                <TD>{row.won}</TD>
                <TD>{row.drawn}</TD>
                <TD>{row.lost}</TD>
              </>
            )}
            <GDCell $v={row.goalDifference}>
              {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
            </GDCell>
            <PtsCell>{row.points}</PtsCell>
          </TR>
        ))}
      </tbody>
    </Table>
  )
}
