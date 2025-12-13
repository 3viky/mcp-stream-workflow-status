# @transftw/theme-provider

**Multi-theme system with semantic token normalization for cyberpunk-ui and luxe-ui.**

Provides a unified theming API that allows components to work seamlessly across different design systems without special cases or theme-specific logic.

## Features

- ✅ **Semantic Token Normalization** - Maps theme-specific tokens to universal semantics
- ✅ **Runtime Theme Switching** - Change themes without page reload
- ✅ **Type-Safe Theme Contract** - TypeScript enforces theme interface conformance
- ✅ **Zero Special Cases** - Components unaware of which theme is active
- ✅ **localStorage Persistence** - Theme preference persists across sessions
- ✅ **Theme Extensions** - Optional theme-specific effects (neon glow, shadows, etc.)

## Installation

```bash
pnpm add @transftw/theme-provider @transftw/cyberpunk-ui-core @transftw/luxe-ui styled-components
```

## Quick Start

### 1. Wrap Your App

```typescript
import { ThemeProvider } from '@transftw/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="cyberpunk">
      <YourApp />
    </ThemeProvider>
  )
}
```

### 2. Use Semantic Tokens in Components

```typescript
import styled from 'styled-components'

const Button = styled.button`
  /* ✅ These work for BOTH themes automatically */
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.body};

  &:hover {
    background: ${props => props.theme.colors.hover.surface};
  }
`

// Cyberpunk: primary = #ff00ff (neon magenta)
// Luxe: primary = #2C2C2C (charcoal)
// Component doesn't care which theme is active!
```

### 3. Switch Themes at Runtime

```typescript
import { useTheme } from '@transftw/theme-provider'

function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(themeName === 'cyberpunk' ? 'luxe' : 'cyberpunk')}>
      Current: {themeName}
    </button>
  )
}
```

## Semantic Token Contract

All themes implement the `ThemeInterface` which defines semantic tokens:

### Colors

| Semantic Token | Cyberpunk Value | Luxe Value | Purpose |
|---------------|-----------------|------------|---------|
| `colors.primary` | `#ff00ff` (magenta) | `#2C2C2C` (charcoal) | Primary brand color |
| `colors.secondary` | `#00ffff` (cyan) | `#D4AF37` (gold) | Secondary accent |
| `colors.accent` | `#00ff00` (green) | `#C9ADA7` (rose) | Highlight color |
| `colors.background` | `#000000` (black) | `#FFFFFF` (white) | Page background |
| `colors.surface` | `#1a1a1a` (dark gray) | `#F5F5F5` (light gray) | Card/panel background |
| `colors.text.primary` | `#ffffff` (white) | `#2C2C2C` (charcoal) | Primary text |
| `colors.text.secondary` | `#b0b0b0` (light gray) | `#616161` (dark gray) | Secondary text |
| `colors.text.muted` | `#666666` (gray) | `#9E9E9E` (medium gray) | Muted text |
| `colors.border` | `#333333` (dark gray) | `#E0E0E0` (light gray) | Borders |
| `colors.success` | `#00ff00` (green) | `#4CAF50` (green) | Success state |
| `colors.warning` | `#ffaa00` (orange) | `#FFA726` (orange) | Warning state |
| `colors.error` | `#ff4444` (red) | `#EF5350` (red) | Error state |
| `colors.info` | `#00ffff` (cyan) | `#42A5F5` (blue) | Info state |

### Spacing

All themes use the same spacing scale:

```typescript
spacing: {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
}
```

### Typography

```typescript
typography: {
  fontFamily: {
    heading: string,  // Cyberpunk: monospace | Luxe: Playfair Display
    body: string,     // Cyberpunk: sans-serif | Luxe: Inter
    mono: string      // Both: Courier New / Fira Code
  },
  fontSize: {
    xs: string,
    sm: string,
    base: string,
    lg: string,
    xl: string,
    '2xl': string,
    '3xl': string
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

### Other Tokens

- **shadows** - `none`, `sm`, `md`, `lg`, `xl`
- **borderRadius** - `none`, `sm`, `md`, `lg`, `full`
- **transitions** - `fast`, `normal`, `slow`
- **zIndex** - `base`, `dropdown`, `sticky`, `fixed`, `modal`, `popover`, `tooltip`, `toast`
- **breakpoints** - `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

## Theme Extensions

For theme-specific effects that don't translate across themes:

```typescript
const CyberpunkSpinner = styled.div`
  /* Use semantic tokens for base styling */
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};

  /* Optional: Add theme-specific enhancement */
  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: ${props.theme.extensions.cyberpunk.neonGlow.magenta};
  `}
`
```

### Available Extensions

**Cyberpunk Extensions:**
- `neonGlow.magenta`, `neonGlow.cyan`, `neonGlow.green`, `neonGlow.large`
- `scanlines` - Retro scanline effect
- `glitchEffect` - Drop shadow glitch effect

**Luxe Extensions:**
- `goldShimmer` - Gold gradient shimmer effect
- `elegantShadow` - Soft, sophisticated shadow
- `subtleGradient` - Subtle background gradient

## API Reference

### ThemeProvider

```typescript
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: 'cyberpunk' | 'luxe'  // Default: 'cyberpunk'
  storageKey?: string                   // Default: 'app-theme'
}
```

### useTheme Hook

```typescript
interface ThemeContextValue {
  theme: ThemeInterface           // Current theme object
  themeName: 'cyberpunk' | 'luxe' // Active theme name
  setTheme: (name: ThemeName) => void // Switch theme
}

const { theme, themeName, setTheme } = useTheme()
```

## Migration Guide

### From Hardcoded Styles

**Before:**
```typescript
const Card = styled.div`
  background: #1a1a1a;
  padding: 16px;
  border: 1px solid #333;
  color: #ffffff;
`
```

**After:**
```typescript
const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};
`
```

### From Old ThemeProvider

**Before:**
```typescript
import { ThemeProvider } from 'styled-components'
import { luxeTheme } from '@transftw/luxe-ui'

<ThemeProvider theme={luxeTheme}>
  <App />
</ThemeProvider>
```

**After:**
```typescript
import { ThemeProvider } from '@transftw/theme-provider'

<ThemeProvider defaultTheme="luxe">
  <App />
</ThemeProvider>
```

## Best Practices

### ✅ DO

- Use semantic tokens (`theme.colors.primary`, not `theme.colors.electricMagenta`)
- Use theme spacing (`theme.spacing.md`, not `'16px'`)
- Use theme breakpoints (`theme.breakpoints.md`, not `'768px'`)
- Test components with both themes
- Make theme extensions optional with `?.` operator

### ❌ DON'T

- Don't check `themeName` to render different components
- Don't hardcode colors, spacing, or font sizes
- Don't access raw theme values outside semantic interface
- Don't create theme-specific components

### When Theme-Specific Logic is Necessary

If you absolutely need theme-specific behavior:

```typescript
import { useTheme } from '@transftw/theme-provider'

function SpecialComponent() {
  const { themeName } = useTheme()

  // Use sparingly - prefer semantic tokens!
  if (themeName === 'cyberpunk') {
    return <CyberpunkSpecificFeature />
  }

  return <LuxeSpecificFeature />
}
```

## Testing

### Mock Theme for Tests

```typescript
import { ThemeProvider } from '@transftw/theme-provider'
import { cyberpunkAdapter } from '@transftw/theme-provider/adapters'
import { render } from '@testing-library/react'

function renderWithTheme(component: React.ReactElement, theme = 'cyberpunk') {
  return render(
    <ThemeProvider defaultTheme={theme}>
      {component}
    </ThemeProvider>
  )
}

test('button renders with correct theme', () => {
  const { container } = renderWithTheme(<Button>Click me</Button>)
  // Theme is applied automatically
})
```

### Test Both Themes

```typescript
describe('Button', () => {
  it('renders with cyberpunk theme', () => {
    const { getByText } = renderWithTheme(<Button>Test</Button>, 'cyberpunk')
    // assertions
  })

  it('renders with luxe theme', () => {
    const { getByText } = renderWithTheme(<Button>Test</Button>, 'luxe')
    // assertions
  })
})
```

## Architecture

```
packages/theme-provider/
├── src/
│   ├── types/
│   │   └── ThemeInterface.ts      # Semantic token contract
│   ├── adapters/
│   │   ├── cyberpunk-adapter.ts   # Maps cyberpunk → ThemeInterface
│   │   └── luxe-adapter.ts        # Maps luxe → ThemeInterface
│   ├── components/
│   │   ├── ThemeProvider.tsx      # Provider component
│   │   └── useTheme.ts            # Theme hook
│   └── index.ts
└── README.md
```

## Related Packages

- **@transftw/cyberpunk-ui-core** - Cyberpunk design system components
- **@transftw/luxe-ui** - Luxe design system components
- **@transftw/react-components** - Themed business components
- **@transftw/react-layouts** - Themed layout components

## License

See project root LICENSE file.
