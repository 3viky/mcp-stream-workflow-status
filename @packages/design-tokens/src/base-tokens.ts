/**
 * Base Design Tokens - Single Source of Truth
 *
 * Consolidated token system merging luxe-ui and cyberpunk-ui design systems.
 * Theme adapters map these primitives to semantic ThemeInterface tokens.
 *
 * Philosophy:
 * - Comprehensive color primitives for both aesthetic directions
 * - Flexible typography supporting both fixed and fluid scaling
 * - Generous spacing system (8px grid)
 * - Multiple shadow styles (subtle to dramatic to neon)
 * - Unified structural tokens (breakpoints, z-index, transitions)
 */

/**
 * Color Primitives
 *
 * Raw color values organized by theme affinity.
 * Both adapters select from this palette.
 */
export const colorPrimitives = {
  // Luxe palette - Sophisticated neutrals with refined accents
  luxe: {
    white: '#FFFFFF',
    cream: '#FAF9F6',
    lightGray: '#F5F5F5',
    gray: '#E0E0E0',
    mediumGray: '#9E9E9E',
    darkGray: '#616161',
    charcoal: '#2C2C2C',
    black: '#000000',
    gold: '#D4AF37',
    rose: '#C9ADA7',
    sage: '#9CAF88',
    slate: '#708090',
  },

  // Cyberpunk palette - Electric neons and deep darks
  cyberpunk: {
    black: '#000000',
    darkerBg: '#111111',
    darkBg: '#1a1a1a',
    electricMagenta: '#ff00ff',
    magentaDark: '#cc00cc',
    magentaLight: '#ff66ff',
    neonCyan: '#00ffff',
    cyanDark: '#00cccc',
    cyanLight: '#66ffff',
    neonGreen: '#00ff00',
    greenDark: '#00cc00',
    greenLight: '#66ff66',
    electricOrange: '#ffaa00',
    neonRed: '#ff4444',
    white: '#ffffff',
  },

  // Unified gray scale (merge of both systems)
  gray: {
    50: '#f9fafb',   // Very light (design-tokens)
    100: '#f3f4f6',  // Light
    200: '#e5e7eb',  // Light border
    300: '#d1d5db',  // Muted border
    400: '#9ca3af',  // Secondary text
    500: '#6b7280',  // Tertiary text
    600: '#4b5563',  // Medium dark
    700: '#374151',  // Dark border (cyberpunk)
    800: '#1f2937',  // Very dark
    900: '#111827',  // Almost black (design-tokens)
    950: '#111111',  // Darker (cyberpunk)
  },

  // Semantic feedback colors (shared across themes)
  semantic: {
    success: '#22c55e',
    successLight: '#4ade80',
    successDark: '#16a34a',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    info: '#3b82f6',
    infoLight: '#60a5fa',
    infoDark: '#2563eb',
  },
} as const

/**
 * Typography System
 *
 * Font definitions, sizes, weights, line heights, and letter spacing.
 * Supports both fixed sizing (cyberpunk) and fluid/responsive (luxe).
 */
export const typography = {
  fonts: {
    // Heading fonts
    heading: {
      luxe: '"Playfair Display", "Georgia", "Times New Roman", serif',
      cyberpunk: '"Courier New", "Consolas", monospace',
    },
    // Body fonts
    body: {
      luxe: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
      cyberpunk: '"Arial", sans-serif',
    },
    // Monospace fonts
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font sizes - Fixed values (cyberpunk-style)
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.125rem',   // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '2.5rem',  // 40px
    '4xl': '3rem',    // 48px
    '5xl': '3.5rem',  // 56px
  },

  // Fluid font sizes - Responsive clamp() values (luxe-style)
  fontSizesFluid: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',    // 12-14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',      // 14-16px
    base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',    // 16-18px
    md: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',      // 18-24px
    lg: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)',     // 24-36px
    xl: 'clamp(2rem, 1.5rem + 2.5vw, 3.5rem)',          // 32-56px
    '2xl': 'clamp(2.5rem, 2rem + 2.5vw, 4.5rem)',       // 40-72px
    '3xl': 'clamp(3rem, 2.5rem + 2.5vw, 5.5rem)',       // 48-88px
  },

  // Font weights
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing (primarily luxe)
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
 * 8px grid system with generous whitespace.
 * Comprehensive scale from luxe-ui.
 */
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const

/**
 * Border Radius
 *
 * Unified rounding scale.
 */
export const borderRadius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const

/**
 * Shadows
 *
 * Multiple shadow styles for different aesthetics:
 * - Light: Subtle, soft shadows (luxe)
 * - Dark: Deeper shadows with more contrast (cyberpunk base)
 * - Neon: Glowing effects (cyberpunk special)
 */
export const shadows = {
  // Light shadows (luxe aesthetic)
  light: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Dark shadows (cyberpunk aesthetic)
  dark: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },

  // Neon glows (cyberpunk special effects)
  neon: {
    magenta: '0 0 10px #ff00ff',
    cyan: '0 0 10px #00ffff',
    green: '0 0 10px #00ff00',
    orange: '0 0 10px #ffaa00',
    large: '0 0 15px',
  },
} as const

/**
 * Transitions
 *
 * Timing and easing functions for both aesthetic styles.
 */
export const transitions = {
  // Timings
  timing: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Complete transition strings (luxe style - smooth, sophisticated)
  luxe: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '700ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Complete transition strings (cyberpunk style - quick, snappy)
  cyberpunk: {
    fast: 'all 0.2s ease',
    base: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
} as const

/**
 * Z-Index Scale
 *
 * Unified layering system for consistent stacking.
 */
export const zIndices = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const

/**
 * Breakpoints
 *
 * Mobile-first responsive design breakpoints.
 * Consistent across all themes.
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
 * Complete Base Tokens Export
 *
 * Single source of truth for all design token values.
 */
export const baseTokens = {
  colorPrimitives,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndices,
  breakpoints,
} as const

/**
 * TypeScript types for token system
 */
export type ColorPrimitives = typeof colorPrimitives
export type Typography = typeof typography
export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
export type Transitions = typeof transitions
export type ZIndices = typeof zIndices
export type Breakpoints = typeof breakpoints
export type BaseTokens = typeof baseTokens
