import { colorPrimitives, typography, spacing, borderRadius, shadows, transitions, zIndices, breakpoints } from '@transftw/design-tokens'
import type { ThemeInterface } from '../types/ThemeInterface'

const { gray } = colorPrimitives

/**
 * Pitch Deck Theme Adapter
 *
 * Maps base design tokens to semantic ThemeInterface for investor presentations.
 *
 * Philosophy:
 * - Professional dark background with high contrast
 * - Purple/cyan accent palette for visual interest
 * - Clean, readable typography for data-heavy slides
 * - Smooth, professional transitions
 * - Minimal decorative effects to maintain focus
 */

// Custom colors for pitch deck - professional luxe investor presentation palette
const pitchDeckColors = {
  // Primary purple - sophisticated, trustworthy (slightly warmer)
  primary: '#9333ea',
  primaryDark: '#7e22ce',
  primaryLight: '#a855f7',

  // Accent gold - premium, luxury, success
  accent: '#d4af37',
  accentDark: '#b8941f',
  accentLight: '#f0d574',

  // Secondary rose gold - elegance, refinement
  secondary: '#e0b0a8',
  secondaryDark: '#c5948c',
  secondaryLight: '#f5cfc4',

  // Dark luxe backgrounds
  background: '#0a0a0a',
  surface: '#161616',
  surfaceLight: '#1f1f1f',

  // Text colors - higher contrast for readability
  white: '#ffffff',
  textMuted: '#b8b8b8',
  textSubtle: '#808080',
}

// Light theme colors - professional clean investor presentation palette
const pitchDeckLightColors = {
  // Primary purple - consistent with dark mode
  primary: '#9333ea',
  primaryDark: '#7e22ce',
  primaryLight: '#a855f7',

  // Accent gold - consistent with dark mode
  accent: '#d4af37',
  accentDark: '#b8941f',
  accentLight: '#f0d574',

  // Secondary rose gold - consistent with dark mode
  secondary: '#e0b0a8',
  secondaryDark: '#c5948c',
  secondaryLight: '#f5cfc4',

  // Light backgrounds
  background: '#ffffff',
  surface: '#f8f8f8',
  surfaceLight: '#f0f0f0',

  // Text colors - dark text for light background
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#6a6a6a',
}

export const pitchDeckAdapter: ThemeInterface = {
  colors: {
    primary: pitchDeckColors.primary,
    secondary: pitchDeckColors.secondary,
    accent: pitchDeckColors.accent,
    background: {
      primary: pitchDeckColors.background,
      secondary: pitchDeckColors.surface,
      tertiary: pitchDeckColors.surfaceLight,
    },
    surface: pitchDeckColors.surface,
    text: {
      primary: pitchDeckColors.white,
      secondary: pitchDeckColors.textMuted,
      muted: pitchDeckColors.textSubtle,
      tertiary: gray[400],
    },
    border: gray[700],
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: pitchDeckColors.accent,
    hover: {
      primary: pitchDeckColors.primaryLight,
      secondary: pitchDeckColors.secondaryLight,
      surface: pitchDeckColors.surfaceLight,
    },
    active: {
      primary: pitchDeckColors.primaryDark,
      secondary: pitchDeckColors.secondaryDark,
    },
    disabled: {
      background: gray[800],
      text: gray[500],
    },
  },
  spacing: {
    xs: spacing[1],    // 4px
    sm: spacing[2],    // 8px
    md: spacing[4],    // 16px
    lg: spacing[6],    // 24px
    xl: spacing[8],    // 32px
    xxl: spacing[12],  // 48px
  },
  typography: {
    fontFamily: {
      heading: typography.fonts.body.luxe,  // Inter for clean headings
      body: typography.fonts.body.luxe,     // Inter for body
      mono: typography.fonts.mono,          // Fira Code for code/data
    },
    fontSize: {
      xs: typography.fontSizes.xs,
      sm: typography.fontSizes.sm,
      md: typography.fontSizes.sm,
      base: typography.fontSizes.base,
      lg: typography.fontSizes.md,
      xl: typography.fontSizes.lg,
      '2xl': typography.fontSizes.xl,
      '3xl': typography.fontSizes['2xl'],
    },
    fontWeight: {
      light: typography.fontWeights.light,
      normal: typography.fontWeights.regular,
      medium: typography.fontWeights.medium,
      semibold: typography.fontWeights.semibold,
      bold: typography.fontWeights.bold,
    },
    lineHeight: {
      tight: typography.lineHeights.tight,
      normal: typography.lineHeights.base,
      relaxed: typography.lineHeights.relaxed,
      loose: typography.lineHeights.loose,
    },
  },
  shadows: {
    none: shadows.dark.none,
    sm: shadows.dark.sm,
    md: shadows.dark.md,
    lg: shadows.dark.lg,
    xl: shadows.dark.xl,
  },
  borderRadius: {
    none: borderRadius.none,
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    full: borderRadius.full,
  },
  transitions: {
    fast: transitions.luxe.fast,    // Smooth professional transitions
    normal: transitions.luxe.base,
    slow: transitions.luxe.slow,
  },
  zIndex: {
    base: zIndices.base,
    dropdown: zIndices.dropdown,
    sticky: zIndices.sticky,
    fixed: zIndices.fixed,
    modal: zIndices.modal,
    popover: zIndices.popover,
    tooltip: zIndices.tooltip,
    toast: zIndices.toast,
  },
  breakpoints: {
    xs: breakpoints.xs,
    sm: breakpoints.sm,
    md: breakpoints.md,
    lg: breakpoints.lg,
    xl: breakpoints.xl,
    '2xl': breakpoints['2xl'],
  },
  // Custom pitch deck extensions for special effects
  extensions: {
    // Optional: subtle glow effects for highlights
    cyberpunk: {
      neonGlow: {
        magenta: `0 0 10px ${pitchDeckColors.secondary}`,
        cyan: `0 0 10px ${pitchDeckColors.accent}`,
        green: '0 0 10px #22c55e',
        large: '0 0 20px',
      },
      scanlines: 'none',
      glitchEffect: 'none',
    },
  },
}

export const pitchDeckLightAdapter: ThemeInterface = {
  colors: {
    primary: pitchDeckLightColors.primary,
    secondary: pitchDeckLightColors.secondary,
    accent: pitchDeckLightColors.accent,
    background: {
      primary: pitchDeckLightColors.background,
      secondary: pitchDeckLightColors.surface,
      tertiary: pitchDeckLightColors.surfaceLight,
    },
    surface: pitchDeckLightColors.surface,
    text: {
      primary: pitchDeckLightColors.textPrimary,
      secondary: pitchDeckLightColors.textSecondary,
      muted: pitchDeckLightColors.textMuted,
      tertiary: gray[500],
    },
    border: gray[300],
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: pitchDeckLightColors.accent,
    hover: {
      primary: pitchDeckLightColors.primaryLight,
      secondary: pitchDeckLightColors.secondaryLight,
      surface: pitchDeckLightColors.surfaceLight,
    },
    active: {
      primary: pitchDeckLightColors.primaryDark,
      secondary: pitchDeckLightColors.secondaryDark,
    },
    disabled: {
      background: gray[200],
      text: gray[400],
    },
  },
  spacing: {
    xs: spacing[1],    // 4px
    sm: spacing[2],    // 8px
    md: spacing[4],    // 16px
    lg: spacing[6],    // 24px
    xl: spacing[8],    // 32px
    xxl: spacing[12],  // 48px
  },
  typography: {
    fontFamily: {
      heading: typography.fonts.body.luxe,  // Inter for clean headings
      body: typography.fonts.body.luxe,     // Inter for body
      mono: typography.fonts.mono,          // Fira Code for code/data
    },
    fontSize: {
      xs: typography.fontSizes.xs,
      sm: typography.fontSizes.sm,
      md: typography.fontSizes.sm,
      base: typography.fontSizes.base,
      lg: typography.fontSizes.md,
      xl: typography.fontSizes.lg,
      '2xl': typography.fontSizes.xl,
      '3xl': typography.fontSizes['2xl'],
    },
    fontWeight: {
      light: typography.fontWeights.light,
      normal: typography.fontWeights.regular,
      medium: typography.fontWeights.medium,
      semibold: typography.fontWeights.semibold,
      bold: typography.fontWeights.bold,
    },
    lineHeight: {
      tight: typography.lineHeights.tight,
      normal: typography.lineHeights.base,
      relaxed: typography.lineHeights.relaxed,
      loose: typography.lineHeights.loose,
    },
  },
  shadows: {
    none: shadows.light.none,
    sm: shadows.light.sm,
    md: shadows.light.md,
    lg: shadows.light.lg,
    xl: shadows.light.xl,
  },
  borderRadius: {
    none: borderRadius.none,
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    full: borderRadius.full,
  },
  transitions: {
    fast: transitions.luxe.fast,    // Smooth professional transitions
    normal: transitions.luxe.base,
    slow: transitions.luxe.slow,
  },
  zIndex: {
    base: zIndices.base,
    dropdown: zIndices.dropdown,
    sticky: zIndices.sticky,
    fixed: zIndices.fixed,
    modal: zIndices.modal,
    popover: zIndices.popover,
    tooltip: zIndices.tooltip,
    toast: zIndices.toast,
  },
  breakpoints: {
    xs: breakpoints.xs,
    sm: breakpoints.sm,
    md: breakpoints.md,
    lg: breakpoints.lg,
    xl: breakpoints.xl,
    '2xl': breakpoints['2xl'],
  },
  // Custom pitch deck extensions for special effects
  extensions: {
    // Optional: subtle effects for light mode highlights
    cyberpunk: {
      neonGlow: {
        magenta: `0 0 10px ${pitchDeckLightColors.secondary}`,
        cyan: `0 0 10px ${pitchDeckLightColors.accent}`,
        green: '0 0 10px #22c55e',
        large: '0 0 20px',
      },
      scanlines: 'none',
      glitchEffect: 'none',
    },
  },
}
