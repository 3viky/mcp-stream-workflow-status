import { colorPrimitives, typography, spacing, borderRadius, shadows, transitions, zIndices, breakpoints } from '@transftw/design-tokens'
import type { ThemeInterface } from '../types/ThemeInterface'

const { luxe, gray } = colorPrimitives
const { semantic } = colorPrimitives

/**
 * Creator Portal Theme Adapter
 *
 * Maps base design tokens to semantic ThemeInterface for creator-facing UIs.
 *
 * Philosophy:
 * - Warm, inviting palette with gold accents
 * - Professional yet approachable design
 * - Fluid responsive typography
 * - Soft, elegant shadows
 * - Smooth transitions
 */
export const creatorPortalThemeAdapter: ThemeInterface = {
  colors: {
    primary: luxe.charcoal,
    secondary: luxe.gold,
    accent: luxe.rose,
    background: {
      primary: luxe.white,
      secondary: luxe.cream,
      tertiary: luxe.lightGray,
    },
    surface: luxe.cream,
    text: {
      primary: luxe.charcoal,
      secondary: luxe.darkGray,
      muted: luxe.mediumGray,
      tertiary: gray[400],
    },
    border: luxe.gray,
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
    hover: {
      primary: 'rgba(44, 44, 44, 0.08)',
      secondary: 'rgba(212, 175, 55, 0.15)',
      surface: luxe.lightGray,
    },
    active: {
      primary: 'rgba(44, 44, 44, 0.12)',
      secondary: 'rgba(212, 175, 55, 0.25)',
    },
    disabled: {
      background: luxe.lightGray,
      text: luxe.mediumGray,
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
      heading: typography.fonts.heading.luxe,
      body: typography.fonts.body.luxe,
      mono: typography.fonts.mono,
    },
    fontSize: {
      xxs: '10px',
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
  extensions: {
    luxe: {
      goldShimmer: `linear-gradient(135deg, ${luxe.gold} 0%, ${luxe.gold} 50%, ${luxe.gold} 100%)`,
      elegantShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      subtleGradient: `linear-gradient(to bottom, ${luxe.white}, ${luxe.cream})`,
    },
  },
}
