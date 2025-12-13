import { colorPrimitives, typography, spacing, borderRadius, shadows, transitions, zIndices, breakpoints } from '@transftw/design-tokens'
import type { ThemeInterface } from '../types/ThemeInterface'

const { luxe } = colorPrimitives
const { semantic } = colorPrimitives

/**
 * Luxe Theme Adapter
 *
 * Maps base design tokens to semantic ThemeInterface for the Luxe aesthetic.
 *
 * Philosophy:
 * - Neutral, sophisticated palette (charcoal, gold, rose)
 * - Light backgrounds with generous whitespace
 * - Fluid responsive typography
 * - Soft, subtle shadows
 * - Elegant, slower transitions
 */
export const luxeAdapter: ThemeInterface = {
  colors: {
    primary: luxe.charcoal,
    secondary: luxe.gold,
    accent: luxe.rose,
    background: {
      primary: luxe.white,
      secondary: luxe.lightGray,
      tertiary: luxe.cream,
    },
    surface: luxe.lightGray,
    text: {
      primary: luxe.charcoal,
      secondary: luxe.darkGray,
      muted: luxe.mediumGray,
      tertiary: luxe.darkGray,
    },
    border: luxe.gray,
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    hover: {
      primary: 'rgba(44, 44, 44, 0.12)',       // charcoal with 12% opacity
      secondary: 'rgba(212, 175, 55, 0.12)',   // gold with 12% opacity
      surface: 'rgba(44, 44, 44, 0.04)',       // subtle surface hover
    },
    active: {
      primary: 'rgba(44, 44, 44, 0.08)',       // charcoal with 8% opacity
      secondary: 'rgba(212, 175, 55, 0.20)',   // gold with 20% opacity
    },
    disabled: {
      background: luxe.gray,
      text: luxe.mediumGray,
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
      heading: typography.fonts.heading.luxe,
      body: typography.fonts.body.luxe,
      mono: typography.fonts.mono,
    },
    fontSize: {
      xs: typography.fontSizesFluid.xs,
      sm: typography.fontSizesFluid.sm,
      md: typography.fontSizesFluid.sm,
      base: typography.fontSizesFluid.base,
      lg: typography.fontSizesFluid.md,
      xl: typography.fontSizesFluid.lg,
      '2xl': typography.fontSizesFluid.xl,
      '3xl': typography.fontSizesFluid['2xl'],
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
    sm: borderRadius.xs,
    md: borderRadius.md,
    lg: borderRadius.lg,
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
  extensions: {
    luxe: {
      goldShimmer: `linear-gradient(135deg, ${luxe.gold} 0%, ${luxe.gold} 50%, ${luxe.gold} 100%)`,
      elegantShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      subtleGradient: `linear-gradient(to bottom, ${luxe.white}, ${luxe.cream})`,
    },
  },
}
