import { colorPrimitives, typography, spacing, borderRadius, shadows, transitions, zIndices, breakpoints } from '@transftw/design-tokens'
import type { ThemeInterface } from '../types/ThemeInterface'

const { cyberpunk } = colorPrimitives
const { gray } = colorPrimitives

/**
 * Cyberpunk Theme Adapter
 *
 * Maps base design tokens to semantic ThemeInterface for the Cyberpunk aesthetic.
 *
 * Philosophy:
 * - Electric neon palette (magenta, cyan, green)
 * - Dark backgrounds with high contrast
 * - Fixed typography sizing
 * - Deep, dramatic shadows with neon glows
 * - Quick, snappy transitions
 */
export const cyberpunkAdapter: ThemeInterface = {
  colors: {
    primary: cyberpunk.electricMagenta,
    secondary: cyberpunk.neonCyan,
    accent: cyberpunk.neonGreen,
    background: {
      primary: cyberpunk.black,
      secondary: cyberpunk.darkBg,
      tertiary: gray[800],
    },
    surface: cyberpunk.darkBg,
    text: {
      primary: cyberpunk.white,
      secondary: gray[400],
      muted: gray[500],
      tertiary: gray[600],
    },
    border: gray[700],
    success: cyberpunk.neonGreen,
    warning: cyberpunk.electricOrange,
    error: cyberpunk.neonRed,
    info: cyberpunk.neonCyan,
    hover: {
      primary: cyberpunk.magentaLight,        // #ff66ff
      secondary: cyberpunk.cyanLight,         // #66ffff
      surface: cyberpunk.darkBg,              // #1a1a1a
    },
    active: {
      primary: cyberpunk.magentaDark,         // #cc00cc
      secondary: cyberpunk.cyanDark,          // #00cccc
    },
    disabled: {
      background: gray[800],                  // #222222
      text: gray[500],                        // #666666
    },
  },
  spacing: {
    xxxs: '1px',
    xxs: '2px',
    xs: spacing[1],    // 4px
    sm: spacing[2],    // 8px
    md: spacing[4],    // 16px
    lg: spacing[6],    // 24px
    xl: spacing[8],    // 32px
    xxl: spacing[12],  // 48px
    xxxl: spacing[16], // 64px
    xxxxl: spacing[20], // 80px
    xxxxxl: spacing[24], // 96px
  },
  typography: {
    fontFamily: {
      heading: typography.fonts.heading.cyberpunk,
      body: typography.fonts.body.cyberpunk,
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
    none: shadows.dark.none,
    sm: shadows.dark.sm,
    md: shadows.dark.md,
    lg: shadows.dark.lg,
    xl: shadows.dark.xl,
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
    fast: transitions.cyberpunk.fast,
    normal: transitions.cyberpunk.base,
    slow: transitions.cyberpunk.slow,
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
  extensions: {
    cyberpunk: {
      neonGlow: {
        magenta: shadows.neon.magenta,
        cyan: shadows.neon.cyan,
        green: shadows.neon.green,
        large: shadows.neon.large,
      },
      scanlines: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
      glitchEffect: 'drop-shadow(2px 0 0 #ff00ff) drop-shadow(-2px 0 0 #00ffff)',
    },
  },
}
