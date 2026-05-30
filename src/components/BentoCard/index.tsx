'use client'

import React from 'react'
import { Root, Header, TitleRow, AccentDot, Title, Badge, Body } from './styles'
import type { BentoAccent } from './styles'

export type { BentoAccent }

export interface BentoCardProps {
  title:    string
  accent?:  BentoAccent
  badge?:   React.ReactNode
  /** Apply inner padding to the body. Set false when child fills the card edge-to-edge. */
  padBody?: boolean
  children: React.ReactNode
  className?: string
  style?:   React.CSSProperties
  /** Stagger delay for entrance animation */
  delay?:   number
}

export function BentoCard({
  title,
  accent  = 'none',
  badge,
  padBody = true,
  children,
  className,
  style,
  delay   = 0,
}: BentoCardProps) {
  return (
    <Root
      $accent={accent}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay }}
    >
      <Header>
        <TitleRow>
          <AccentDot $accent={accent} />
          <Title>{title}</Title>
        </TitleRow>
        {badge !== undefined && <Badge $accent={accent}>{badge}</Badge>}
      </Header>

      <Body $pad={padBody}>{children}</Body>
    </Root>
  )
}
