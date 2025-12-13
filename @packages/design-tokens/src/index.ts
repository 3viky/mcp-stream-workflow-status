/**
 * @transftw/design-tokens
 *
 * Shared design tokens (theme) for the egirl platform monorepo.
 * Provides a single source of truth for design system values.
 *
 * @example
 * ```typescript
 * // Use the consolidated base tokens (recommended for theme adapters)
 * import { baseTokens } from '@transftw/design-tokens';
 *
 * // Use the default theme (most apps)
 * import { theme } from '@transftw/design-tokens';
 *
 * // Create a custom theme with overrides
 * import { createTheme } from '@transftw/design-tokens';
 * const myTheme = createTheme({ colors: { primary: { 600: '#ff0000' } } });
 *
 * // Use the portal-specific theme (portal app)
 * import { portalTheme } from '@transftw/design-tokens';
 * ```
 */

// Base tokens - Single source of truth (NEW)
export { baseTokens, colorPrimitives, typography, spacing, borderRadius, shadows, transitions, zIndices, breakpoints } from './base-tokens'
export type { BaseTokens, ColorPrimitives, Typography, Spacing, BorderRadius, Shadows, Transitions, ZIndices, Breakpoints } from './base-tokens'

// Legacy theme system (to be phased out)
export { theme, baseTheme } from './theme'
export { createTheme } from './create-theme'
export { portalTheme } from './portal-theme'
export type { Theme, BaseTheme } from './theme'
export type { ThemeOverrides } from './create-theme'
export type { PortalTheme } from './portal-theme'
