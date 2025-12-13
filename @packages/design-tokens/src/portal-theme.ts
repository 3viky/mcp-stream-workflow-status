import { baseTheme } from './theme'

/**
 * Portal-specific theme with flat color values for component convenience
 *
 * This variant includes both nested color palettes and flat color aliases.
 * Use this for apps that need direct color references (e.g., `theme.colors.primary`)
 * rather than palette-based references (e.g., `theme.colors.primary[600]`)
 */
export const portalTheme = {
  colors: {
    // Flat color values for components
    primary: '#9333ea',
    secondary: '#6b7280',
    background: '#ffffff',
    backgroundAlt: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',

    // Primary brand color (purple) - nested palette
    primaryPalette: baseTheme.colors.primary,

    // Neutral grays - nested palette
    gray: baseTheme.colors.gray,

    // Semantic colors - nested palettes
    successPalette: baseTheme.colors.success,
    errorPalette: baseTheme.colors.error,
    warningPalette: baseTheme.colors.warning,
    infoPalette: baseTheme.colors.info,

    // Base colors
    white: baseTheme.colors.white,
    black: baseTheme.colors.black,
  },

  spacing: baseTheme.spacing,
  fontSizes: baseTheme.fontSizes,
  fontWeights: baseTheme.fontWeights,
  lineHeights: baseTheme.lineHeights,
  radii: baseTheme.radii,

  // Portal uses both radii and borderRadius
  borderRadius: {
    none: '0',
    small: '0.25rem',  // 4px
    medium: '0.5rem',  // 8px
    large: '0.75rem',  // 12px
    full: '9999px',
  },

  shadows: {
    none: 'none',
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  breakpoints: baseTheme.breakpoints,
  transitions: baseTheme.transitions,
  zIndices: baseTheme.zIndices,
} as const

export type PortalTheme = typeof portalTheme;
