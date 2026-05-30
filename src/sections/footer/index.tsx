'use client'

import { useBracketStore }   from '@/stores'
import { useCompetition }     from '@/hooks/useCompetition'
import { formatZoomPercent }  from '@/utils/format'
import { footerEntrance }    from './animations/footer'
import {
  FooterRoot,
  FooterLeft,
  FooterRight,
  FooterText,
  FooterDivider,
  ShortcutHint,
  KbdKey,
  ZoomDisplay,
  AccentDot,
} from './styles'

export function Footer() {
  const { zoom }    = useBracketStore()
  const competition = useCompetition()

  return (
    <FooterRoot
      variants={footerEntrance}
      initial="hidden"
      animate="visible"
    >
      <FooterLeft>
        <AccentDot />
        <FooterText>{competition.name}</FooterText>
      </FooterLeft>

      <FooterRight>
        <ShortcutHint>
          <KbdKey>Drag</KbdKey>
          to pan bracket
        </ShortcutHint>
        <FooterDivider />
        <ShortcutHint>
          <KbdKey>Scroll</KbdKey>
          to zoom
        </ShortcutHint>
        <FooterDivider />
        <ZoomDisplay>{formatZoomPercent(zoom)}</ZoomDisplay>
      </FooterRight>
    </FooterRoot>
  )
}
