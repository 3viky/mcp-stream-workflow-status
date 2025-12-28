import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { cyberpunkAdapter } from '../adapters/cyberpunk-adapter'
import { luxeAdapter } from '../adapters/luxe-adapter'
import type { ThemeInterface, ThemeName, ThemeContextValue } from '../types/ThemeInterface'

/**
 * Theme context - internal, use useTheme() hook instead
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeName
  storageKey?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'cyberpunk',
  storageKey = 'app-theme',
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'cyberpunk' || stored === 'luxe') {
        return stored
      }
    }
    return defaultTheme
  })

  const theme: ThemeInterface = themeName === 'cyberpunk' ? cyberpunkAdapter : luxeAdapter

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, themeName)
    }
  }, [themeName, storageKey])

  useEffect(() => {
    if (themeName === 'cyberpunk' && typeof document !== 'undefined') {
      const linkId = 'cyberpunk-css-variables'
      let link = document.getElementById(linkId) as HTMLLinkElement

      if (!link) {
        link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        link.href = '/cyberpunk-variables.css'
        document.head.appendChild(link)
      }
    }
  }, [themeName])

  const contextValue: ThemeContextValue = {
    theme,
    themeName,
    setTheme: setThemeName,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <SCThemeProvider theme={theme as any}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}
