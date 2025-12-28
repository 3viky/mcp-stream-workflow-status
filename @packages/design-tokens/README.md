# @transftw/design-tokens

Shared design tokens (theme) for the egirl platform monorepo.

## Overview

This package provides a **single source of truth** for all design system values across the platform, including:

- **Colors**: Brand colors, semantic colors (success, error, warning, info), neutral grays
- **Spacing**: Consistent spacing scale (4px, 8px, 12px, 16px, etc.)
- **Typography**: Font sizes, weights, and line heights
- **Border Radii**: Standard border radius values
- **Shadows**: Box shadow presets
- **Breakpoints**: Responsive breakpoint values
- **Transitions**: Standard animation/transition timings
- **Z-indices**: Layering system for overlays, modals, tooltips, etc.

## Installation

This package is already available in the monorepo workspace:

```bash
pnpm add @transftw/design-tokens
```

## Usage

### Default Theme (Most Apps)

For most applications, simply import and use the default theme:

```typescript
import { theme } from '@transftw/design-tokens';
import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### Custom Theme with Overrides

If you need to customize specific values:

```typescript
import { createTheme } from '@transftw/design-tokens';

const customTheme = createTheme({
  colors: {
    primary: {
      600: '#ff0000', // Override primary brand color
    },
  },
  spacing: {
    custom: '2.5rem', // Add custom spacing value
  },
});
```

### Portal-Specific Theme

The portal app uses a flat color structure for convenience:

```typescript
import { portalTheme } from '@transftw/design-tokens';

// Access colors directly
const primaryColor = portalTheme.colors.primary; // '#9333ea'

// Or use nested palettes
const primaryShade = portalTheme.colors.primaryPalette[600]; // '#9333ea'
```

## Theme Structure

### Colors

```typescript
theme.colors.primary[600]    // Brand purple: #9333ea
theme.colors.gray[500]       // Neutral gray: #6b7280
theme.colors.success[500]    // Success green: #22c55e
theme.colors.error[500]      // Error red: #ef4444
theme.colors.warning[500]    // Warning yellow: #f59e0b
theme.colors.info[500]       // Info blue: #3b82f6
theme.colors.white           // #ffffff
theme.colors.black           // #000000
```

### Spacing

```typescript
theme.spacing[0]   // 0
theme.spacing[1]   // 0.25rem (4px)
theme.spacing[2]   // 0.5rem (8px)
theme.spacing[4]   // 1rem (16px)
theme.spacing[8]   // 2rem (32px)
```

### Typography

```typescript
theme.fontSizes.xs      // 0.75rem (12px)
theme.fontSizes.base    // 1rem (16px)
theme.fontSizes['2xl']  // 1.5rem (24px)

theme.fontWeights.normal    // 400
theme.fontWeights.semibold  // 600

theme.lineHeights.normal    // 1.5
theme.lineHeights.tight     // 1.25
```

### Border Radii

```typescript
theme.radii.sm    // 0.125rem (2px)
theme.radii.md    // 0.375rem (6px)
theme.radii.lg    // 0.5rem (8px)
theme.radii.full  // 9999px (pill shape)

// Alias for styled-components
theme.borderRadius.sm  // Same as theme.radii.sm
```

### Shadows

```typescript
theme.shadows.sm    // Subtle shadow
theme.shadows.base  // Default shadow
theme.shadows.lg    // Large shadow
```

### Breakpoints

```typescript
theme.breakpoints.sm    // 640px
theme.breakpoints.md    // 768px
theme.breakpoints.lg    // 1024px
theme.breakpoints.xl    // 1280px
theme.breakpoints['2xl'] // 1536px
```

### Transitions

```typescript
theme.transitions.fast  // 150ms cubic-bezier(0.4, 0, 0.2, 1)
theme.transitions.base  // 200ms cubic-bezier(0.4, 0, 0.2, 1)
theme.transitions.slow  // 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Z-Indices

```typescript
theme.zIndices.base      // 0
theme.zIndices.dropdown  // 1000
theme.zIndices.modal     // 1300
theme.zIndices.toast     // 1500
theme.zIndices.tooltip   // 1600
```

## TypeScript Support

All themes are fully typed:

```typescript
import type { Theme, BaseTheme, PortalTheme } from '@transftw/design-tokens';

// Use in styled-components
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

## Migration Guide

### From App-Specific Themes

If your app currently has its own `src/shared/styles/theme.ts`:

1. **Remove the local theme file**:
   ```bash
   rm @apps/{app-name}/src/shared/styles/theme.ts
   ```

2. **Update imports**:
   ```diff
   - import { theme } from '@/shared/styles/theme';
   + import { theme } from '@transftw/design-tokens';
   ```

3. **If you have custom values**, use `createTheme`:
   ```typescript
   import { createTheme } from '@transftw/design-tokens';

   export const theme = createTheme({
     // Your overrides here
   });
   ```

4. **Update styled-components theme typing** (if needed):
   ```typescript
   // In your app's styled.d.ts or theme setup
   import 'styled-components';
   import type { Theme } from '@transftw/design-tokens';

   declare module 'styled-components' {
     export interface DefaultTheme extends Theme {}
   }
   ```

## Benefits

- **Consistency**: All apps use the same design values
- **Maintainability**: Update design tokens in one place
- **Type Safety**: Full TypeScript support with autocomplete
- **Flexibility**: Apps can customize values as needed
- **Documentation**: Clear, centralized design system

## License

Private - Internal use only
