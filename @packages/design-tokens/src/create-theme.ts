import { baseTheme } from './theme'

/**
 * Deep merge utility for theme customization
 */
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(
        target[key] as Record<string, any>,
        source[key] as Record<string, any>
      ) as T[Extract<keyof T, string>]
    } else {
      output[key] = source[key] as T[Extract<keyof T, string>]
    }
  }

  return output
}

export type ThemeOverrides = Partial<typeof baseTheme>;

/**
 * Create a custom theme by merging overrides with the base theme
 *
 * @example
 * ```typescript
 * // Basic usage - use base theme as-is
 * const myTheme = createTheme();
 *
 * // Customize specific colors
 * const customTheme = createTheme({
 *   colors: {
 *     primary: {
 *       600: '#ff0000', // Override just the primary brand color
 *     },
 *   },
 * });
 *
 * // Add flat color values for component convenience
 * const portalTheme = createTheme({
 *   colors: {
 *     ...baseTheme.colors,
 *     primary: '#9333ea',
 *     secondary: '#6b7280',
 *     background: '#ffffff',
 *   },
 * });
 * ```
 */
export function createTheme(overrides?: ThemeOverrides) {
  const mergedTheme = overrides ? deepMerge(baseTheme, overrides) : baseTheme

  return {
    ...mergedTheme,
    // Alias for radii (for consistency with styled-components naming)
    get borderRadius() {
      return this.radii
    },
  } as const
}
