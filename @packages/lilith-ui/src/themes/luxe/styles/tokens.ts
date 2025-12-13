/**
 * Luxe Design Tokens
 *
 * Premium design system inspired by high-end luxury marketing sites.
 * Features neutral palettes, elegant typography, and sophisticated spacing.
 */

/**
 * Color Palette - Luxe Minimalist
 *
 * Neutral backgrounds with refined accent colors.
 * Inspired by luxury brand aesthetics.
 */
export const colors = {
  // Neutrals - Primary palette
  white: '#FFFFFF',
  cream: '#FAF9F6',
  lightGray: '#F5F5F5',
  gray: '#E0E0E0',
  mediumGray: '#9E9E9E',
  darkGray: '#616161',
  charcoal: '#2C2C2C',
  black: '#000000',

  // Accents - Refined touches
  gold: '#D4AF37',
  rose: '#C9ADA7',
  sage: '#9CAF88',
  slate: '#708090',

  // Semantic colors
  primary: '#2C2C2C', // Charcoal
  secondary: '#D4AF37', // Gold
  accent: '#C9ADA7', // Rose

  // Backgrounds
  background: '#FFFFFF',
  backgroundAlt: '#FAF9F6', // Cream
  backgroundElevated: '#F5F5F5',

  // Text
  text: '#2C2C2C',
  textSecondary: '#616161',
  textTertiary: '#9E9E9E',
  textInverse: '#FFFFFF',

  // UI Elements
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  borderDark: '#9E9E9E',

  // States
  hover: 'rgba(44, 44, 44, 0.04)',
  active: 'rgba(44, 44, 44, 0.08)',
  focus: '#D4AF37',
  disabled: '#E0E0E0',

  // Feedback
  success: '#4CAF50',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
} as const

/**
 * Typography System
 *
 * Fluid, responsive typography with elegant font pairings.
 * Uses system fonts for performance with fallbacks to premium aesthetics.
 */
export const typography = {
  fonts: {
    // Serif for headings - elegant, authoritative
    heading: '"Playfair Display", "Georgia", "Times New Roman", serif',

    // Sans-serif for body - clean, readable
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',

    // Monospace for code/technical content
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font sizes - Fluid responsive scale
  sizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12-14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14-16px
    base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', // 16-18px
    md: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)', // 18-24px
    lg: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)', // 24-36px
    xl: 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)', // 32-56px
    '2xl': 'clamp(2.5rem, 2rem + 2.5vw, 4.5rem)', // 40-72px
    '3xl': 'clamp(3rem, 2.5rem + 2.5vw, 5.5rem)', // 48-88px
  },

  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

/**
 * Spacing Scale
 *
 * Premium spacing system with generous whitespace.
 * Based on 8px grid for consistency.
 */
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
} as const

/**
 * Border Radius
 *
 * Subtle rounding for refined aesthetic.
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
} as const

/**
 * Shadows
 *
 * Soft, subtle shadows for depth without harshness.
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

/**
 * Transitions
 *
 * Smooth, sophisticated animations.
 * Slower than typical for premium feel.
 */
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '700ms cubic-bezier(0.4, 0, 0.2, 1)',

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

/**
 * Z-Index Scale
 *
 * Layering system for consistent stacking.
 */
export const zIndices = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
} as const

/**
 * Breakpoints
 *
 * Mobile-first responsive design breakpoints.
 */
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Container Sizes
 *
 * Maximum widths for content containers.
 */
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  full: '100%',
} as const

/**
 * Complete Luxe Theme Object
 */
export const luxeTheme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndices,
  breakpoints,
  containers,
} as const

/**
 * TypeScript type for theme
 */
export type LuxeTheme = typeof luxeTheme;
