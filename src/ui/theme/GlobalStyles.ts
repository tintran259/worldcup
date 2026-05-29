'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    /* ── Backgrounds ───────────────────────────────────────────────────── */
    --bg-base:          #f8fafc;
    --bg-surface:       #ffffff;
    --bg-elevated:      #f1f5f9;
    --bg-overlay:       #e2e8f0;
    --bg-glass:         rgba(255, 255, 255, 0.80);

    /* ── Text ──────────────────────────────────────────────────────────── */
    --text-primary:     #0f172a;
    --text-secondary:   #334155;
    --text-muted:       #64748b;
    --text-disabled:    #94a3b8;
    --text-live:        #ef4444;
    --text-winner:      #d97706;

    /* ── Borders ───────────────────────────────────────────────────────── */
    --border-subtle:    #e2e8f0;
    --border-default:   #cbd5e1;
    --border-active:    #2563eb;
    --border-live:      #ef4444;
    --border-winner:    #d97706;
    --border-glass:     rgba(0, 0, 0, 0.07);

    /* ── Accents ───────────────────────────────────────────────────────── */
    --accent-primary:   #2563eb;
    --accent-live:      #ef4444;
    --accent-winner:    #d97706;
    --accent-trail:     #10b981;

    /* ── Shadows (for shadow-based "glows" on light bg) ────────────────── */
    --glow-cyan:        0 0 0 3px rgba(37,99,235,0.22), 0 4px 12px rgba(37,99,235,0.10);
    --glow-gold:        0 0 0 3px rgba(217,119,6,0.22),  0 4px 12px rgba(217,119,6,0.10);
    --glow-live:        0 0 0 3px rgba(239,68,68,0.22),  0 4px 12px rgba(239,68,68,0.10);
    --glow-mint:        0 0 0 3px rgba(16,185,129,0.22), 0 4px 12px rgba(16,185,129,0.10);

    /* ── Fonts ─────────────────────────────────────────────────────────── */
    --font-display:    var(--font-outfit), 'Outfit', system-ui, sans-serif;
    --font-heading:    var(--font-outfit), 'Outfit', system-ui, sans-serif;
    --font-body:       var(--font-inter), 'Inter', system-ui, sans-serif;
    --font-mono:       var(--font-jetbrains), 'JetBrains Mono', monospace;
    --font-broadcast:  var(--font-outfit), 'Outfit', system-ui, sans-serif;

    /* ── Radii ─────────────────────────────────────────────────────────── */
    --radius-card:     8px;
    --radius-panel:    12px;
    --radius-badge:    4px;
    --radius-pill:     9999px;

    /* ── Easing ────────────────────────────────────────────────────────── */
    --ease-broadcast:  cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
    --duration-fast:   120ms;
    --duration-base:   200ms;
    --duration-slow:   350ms;

    --panel-width:     380px;
    --panel-width-lg:  440px;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    color-scheme: light;
    background: var(--bg-base);
    color: var(--text-primary);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background: var(--bg-base);
    overflow-x: hidden;
    min-height: 100dvh;
  }

  /* Scrollbar — clean light style */
  ::-webkit-scrollbar        { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track  { background: transparent; }
  ::-webkit-scrollbar-thumb  {
    background: rgba(100, 116, 139, 0.30);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.50); }

  /* Focus ring */
  :focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  /* Selection */
  ::selection {
    background: rgba(37, 99, 235, 0.15);
    color: #0f172a;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── Keyframes ──────────────────────────────────────────────────────── */

  @keyframes live-border-breathe {
    0%,  100% { box-shadow: 0 0 0 1px rgba(239,68,68,0.25), 0 2px 8px rgba(239,68,68,0.08); }
    50%        { box-shadow: 0 0 0 2px rgba(239,68,68,0.45), 0 4px 16px rgba(239,68,68,0.15); }
  }

  @keyframes pulse-live {
    0%,  100% { box-shadow: 0 0 0 2px rgba(239,68,68,0.30); }
    50%        { box-shadow: 0 0 0 4px rgba(239,68,68,0.55), 0 0 12px rgba(239,68,68,0.15); }
  }

  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 1; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  @keyframes breathe-cyan {
    0%,  100% { box-shadow: 0 0 0 2px rgba(37,99,235,0.25); opacity: 0.9; }
    50%        { box-shadow: 0 0 0 3px rgba(37,99,235,0.45); opacity: 1; }
  }

  @keyframes score-flash {
    0%   { transform: scale(1);    color: inherit; }
    30%  { transform: scale(1.30); color: #2563eb; }
    100% { transform: scale(1);    color: inherit; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`
