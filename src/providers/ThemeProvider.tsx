'use client'

import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme, GlobalStyles } from '@/theme'

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  )
}
