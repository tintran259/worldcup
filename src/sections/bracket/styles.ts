import styled from 'styled-components'

const GAP       = 10
const RIGHT_COL = '290px'

export const BentoPage = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  padding: ${GAP}px;
  gap: ${GAP}px;

  /* Desktop xl+: 3 columns, 4 rows */
  grid-template-columns: 1fr ${RIGHT_COL} ${RIGHT_COL};
  grid-template-rows: 60px 1fr 1fr 40px;
  grid-template-areas:
    'header   header    header'
    'bracket  live      stats'
    'bracket  standings history'
    'footer   footer    footer';

  /* Tablet lg (1024–1279): 2 columns */
  ${(p) => p.theme.mq.maxXl} {
    grid-template-columns: 1fr ${RIGHT_COL};
    grid-template-rows: 60px 1fr 1fr auto 40px;
    grid-template-areas:
      'header   header'
      'bracket  live'
      'bracket  standings'
      'history  stats'
      'footer   footer';
  }

  /* Mobile <md: single column — side cards collapse into a tab switcher */
  ${(p) => p.theme.mq.maxMd} {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 340px auto 40px;
    grid-template-areas:
      'header'
      'bracket'
      'tabs'
      'footer';
    height: auto;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
`

export const HeaderCell = styled.div`
  grid-area: header;
  border-radius: 14px;
  overflow: hidden;
  & > header {
    height: 100%;
    border-radius: 14px;
  }
`

export const BracketCell = styled.div`
  grid-area: bracket;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.surface};
  border: 1px solid ${(p) => p.theme.colors.border.subtle};
  box-shadow: ${(p) => p.theme.shadows.card};

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 16px 16px 0 0;
    background: linear-gradient(90deg, rgba(37,99,235,0.48) 0%, transparent 55%);
    z-index: 1;
    pointer-events: none;
  }
`

export const BracketOverlay = styled.div`
  position: absolute;
  top: 12px; left: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.90);
  backdrop-filter: blur(8px);
  border: 1px solid ${(p) => p.theme.colors.border.default};
  box-shadow: ${(p) => p.theme.shadows.xs};
  pointer-events: none;
`

export const OverlayDot = styled.div`
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: 0 0 6px var(--accent-primary);
`

export const OverlayLabel = styled.span`
  font-family: ${(p) => p.theme.fonts.broadcast};
  font-size: ${(p) => p.theme.fontSizes.xs};
  font-weight: ${(p) => p.theme.fontWeights.bold};
  letter-spacing: ${(p) => p.theme.letterSpacings.widest};
  color: ${(p) => p.theme.colors.text.muted};
  text-transform: uppercase;
`

/* Desktop/tablet-only side cells */

export const LiveCell = styled.div`
  grid-area: live;
  display: flex;
  flex-direction: column;
  min-height: 0;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const StatsCell = styled.div`
  grid-area: stats;
  display: flex;
  flex-direction: column;
  min-height: 0;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const StandingsCell = styled.div`
  grid-area: standings;
  display: flex;
  flex-direction: column;
  min-height: 0;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

export const HistoryCell = styled.div`
  grid-area: history;
  display: flex;
  flex-direction: column;
  min-height: 0;
  ${(p) => p.theme.mq.maxMd} { display: none; }
`

/* Mobile-only tab switcher */

export const MobileTabsCell = styled.div`
  grid-area: tabs;
  display: none;
  flex-direction: column;
  min-height: 360px;
  ${(p) => p.theme.mq.maxMd} { display: flex; }
`

export const FooterCell = styled.div`
  grid-area: footer;
  border-radius: 10px;
  overflow: hidden;
  & > footer { height: 100%; border-radius: 10px; }
`
