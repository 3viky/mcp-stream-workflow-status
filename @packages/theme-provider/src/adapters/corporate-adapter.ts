import { colorPrimitives, typography, spacing, borderRadius, shadows, transitions, zIndices, breakpoints } from '@transftw/design-tokens'
import type { ThemeInterface } from '../types/ThemeInterface'

const { gray } = colorPrimitives
const { semantic } = colorPrimitives

/**
 * Corporate Theme Adapter
 *
 * Maps base design tokens to semantic ThemeInterface for corporate/business pages.
 *
 * Philosophy:
 * - Professional blue and gray palette
 * - Clean, trustworthy design
 * - Fixed typography sizing
 * - Subtle shadows
 * - Standard transitions
 */
export const corporateThemeAdapter: ThemeInterface = {
  colors: {
    primary: '#1a365d',           // Deep professional blue
    secondary: '#2b6cb0',          // Lighter blue accent
    accent: '#3182ce',             // Bright blue for CTAs
    background: {
      primary: '#FFFFFF',
      secondary: gray[50],
      tertiary: gray[100],
    },
    surface: gray[50],
    text: {
      primary: gray[900],
      secondary: gray[600],
      muted: gray[500],
      tertiary: gray[400],
    },
    border: gray[200],
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    hover: {
      primary: '#2c5282',
      secondary: '#2b6cb0',
      surface: gray[100],
    },
    active: {
      primary: '#1a365d',
      secondary: '#2b6cb0',
    },
    disabled: {
      background: gray[100],
      text: gray[400],
    },
  },
  spacing: {
    xxxs: '1px',
    xxs: '2px',
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
    xxl: spacing[12],
    xxxl: spacing[16],
    xxxxl: spacing[20],
    xxxxxl: spacing[24],
  },
  typography: {
    fontFamily: {
      heading: typography.fonts.body.luxe,
      body: typography.fonts.body.luxe,
      mono: typography.fonts.mono,
    },
    fontSize: {
      xxs: '10px',
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
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
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
    xs: borderRadius.xs,
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    xl: borderRadius.xl,
    full: borderRadius.full,
  },
  transitions: {
    fast: transitions.luxe.fast,
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
  extensions: {},
}
