# @transftw/egirl-ui

Unified theme-agnostic UI component library for the egirl-platform.

## Philosophy

egirl-ui consolidates the best components from luxe-ui and cyberpunk-ui into a single, theme-agnostic library. Components automatically adapt their visual style based on the active theme (luxe or cyberpunk) without requiring code changes.

## Features

- **Theme-Agnostic**: Components use semantic tokens from `@transftw/theme-provider`
- **Runtime Theme Switching**: Change from luxe to cyberpunk theme without page reload
- **Comprehensive**: ~60 components covering primitives, layout, typography, navigation, feedback, and data display
- **Type-Safe**: Full TypeScript support with proper theme typing
- **Styled-Components**: Modern CSS-in-JS with theme context integration

## Installation

```bash
pnpm add @transftw/egirl-ui
```

## Usage

### Basic Setup

Wrap your app with the `ThemeProvider` from `@transftw/theme-provider`:

```tsx
import { ThemeProvider } from '@transftw/theme-provider'
import { Button, Card } from '@transftw/egirl-ui'

function App() {
  return (
    <ThemeProvider defaultTheme="luxe">
      <Card>
        <Button variant="primary">Click Me</Button>
      </Card>
    </ThemeProvider>
  )
}
```

### Theme Switching

```tsx
import { useTheme } from '@transftw/theme-provider'
import { Button } from '@transftw/egirl-ui'

function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme()

  return (
    <Button
      onClick={() => setTheme(themeName === 'luxe' ? 'cyberpunk' : 'luxe')}
    >
      Switch to {themeName === 'luxe' ? 'Cyberpunk' : 'Luxe'} Theme
    </Button>
  )
}
```

### Accessing Theme in Custom Components

```tsx
import styled from 'styled-components'

const CustomBox = styled.div`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};

  /* Conditional cyberpunk effects */
  ${props => props.theme.extensions?.cyberpunk && `
    box-shadow: ${props.theme.extensions.cyberpunk.neonGlow.magenta};
  `}
`
```

## Component Categories

### Primitives
- `Button` - Primary, secondary, and accent button variants
- `Badge` - Status indicators and labels
- `Input` / `Textarea` - Form inputs with theme-aware styling
- `Card` - Container component with elevation

### Layout
- `Container` - Centered content container with max-width
- `Section` - Full-width section with padding
- `Grid` / `Stack` - Flexbox layout helpers
- `Spacer` - Spacing utility component

### Typography
- `Heading` - H1-H6 with theme-aware fonts
- `Text` - Body text with variants

### Navigation
- `Navigation` - Header navigation component
- `Tabs` - Tabbed interface
- `Breadcrumbs` - Breadcrumb navigation

### Feedback
- `Alert` - Notification messages
- `Toast` - Toast notification system
- `Modal` - Dialog overlays
- `Tooltip` - Hover tooltips
- `Spinner` / `Progress` - Loading indicators

### Data
- `DataTable` - Sortable, filterable data table
- `Pagination` - Page navigation
- `Gallery` - Image gallery

### Animated
- `FadeIn` - Fade-in animation wrapper
- `ParallaxSection` - Parallax scroll effects

## Theme Differences

Components automatically adapt to the active theme:

| Aspect | Luxe Theme | Cyberpunk Theme |
|--------|------------|-----------------|
| **Colors** | Charcoal, gold, rose | Magenta, cyan, green |
| **Background** | White/cream | Black/dark gray |
| **Typography** | Playfair Display (serif) | Courier New (mono) |
| **Shadows** | Soft, subtle | Deep, dramatic + neon glows |
| **Transitions** | Slower, elegant | Quick, snappy |
| **Font Sizing** | Fluid/responsive | Fixed |

## Migration from luxe-ui

Replace imports:
```tsx
// Before
import { Button } from '@transftw/luxe-ui'

// After
import { Button } from '@transftw/egirl-ui'
```

Components work identically but now support theme switching!

## Development

```bash
# Type-check
pnpm type-check

# Use in local development
pnpm install
```

## Architecture

egirl-ui components follow these principles:

1. **Semantic Token Usage**: Components NEVER import theme objects directly. They always access `props.theme` from styled-components context.

2. **No Theme Detection**: Components don't check which theme is active. They use semantic tokens that automatically map to the correct values.

3. **Extension System**: Theme-specific effects (like neon glows) are accessed via `props.theme.extensions?.cyberpunk` only when needed.

4. **Type Safety**: All theme access is type-checked via the `ThemeInterface` contract.

## License

MIT
