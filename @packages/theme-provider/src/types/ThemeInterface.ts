export interface ThemeInterface {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    surface: string
    text: {
      primary: string
      secondary: string
      tertiary: string
      muted: string
    }
    border: string
    success: string
    warning: string
    error: string
    info: string
    hover: {
      primary: string
      secondary: string
      surface: string
    }
    active: {
      primary: string
      secondary: string
    }
    disabled: {
      background: string
      text: string
    }
  }
  spacing: {
    xxxs?: string  // ~1px
    xxs?: string   // ~2px
    xs: string     // 4px
    sm: string     // 8px
    md: string     // 16px
    lg: string     // 24px
    xl: string     // 32px
    xxl: string    // 48px
    xxxl?: string  // 64px
    xxxxl?: string // 80px
    xxxxxl?: string // 96px
  }
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
    fontSize: {
      xxs?: string  // 10px
      xs: string    // 12px
      sm: string    // 14px
      md: string    // 16px
      base: string  // 16px
      lg: string    // 18px
      xl: string    // 20px
      '2xl': string // 24px
      '3xl': string // 30px
    }
    fontWeight: {
      light: number
      normal: number
      medium: number
      semibold: number
      bold: number
    }
    lineHeight: {
      tight: number
      normal: number
      relaxed: number
      loose: number
    }
  }
  letterSpacing?: {
    tight?: string
    normal?: string
    wide?: string
  }
  borderWidth?: {
    thin?: string   // 1px
    medium?: string // 2px
    thick?: string  // 3px
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    none: string
    xs?: string  // 2px
    sm: string   // 4px
    md: string   // 6px
    lg: string   // 8px
    xl?: string  // 12px
    full: string
  }
  transitions: {
    fast: string
    normal: string
    slow: string
  }
  zIndex: {
    base: number
    dropdown: number
    sticky: number
    fixed: number
    modal: number
    popover: number
    tooltip: number
    toast: number
  }
  breakpoints: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  extensions?: {
    cyberpunk?: {
      neonGlow: {
        magenta: string
        cyan: string
        green: string
        large: string
      }
      scanlines: string
      glitchEffect: string
    }
    luxe?: {
      goldShimmer: string
      elegantShadow: string
      subtleGradient: string
    }
  }
}

export type ThemeName = 'cyberpunk' | 'luxe'

export interface ThemeContextValue {
  theme: ThemeInterface
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
}
