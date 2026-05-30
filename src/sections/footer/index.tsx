'use client'

import { useBracketStore }  from '@/stores'
import { formatZoomPercent } from '@/utils/format'
import { HOST_NATIONS }      from '@/constants/tournament'
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
  const { zoom } = useBracketStore()

  return (
    <FooterRoot
      variants={footerEntrance}
      initial="hidden"
      animate="visible"
    >
      <FooterLeft>
        <AccentDot />
        <FooterText>FIFA World Cup 2026</FooterText>
        <FooterDivider />
        <FooterText>{HOST_NATIONS.join(' · ')}</FooterText>
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
