# egirl-ui Showcase

Interactive showcase application for the [egirl-ui component library](../README.md) with live theme switching between luxe and cyberpunk themes.

## Features

- 🎨 **Live Theme Switching** - Toggle between luxe and cyberpunk themes in real-time
- 📦 **60+ Components** - Browse all components organized by category
- 🚀 **Interactive Demos** - See components in action with real examples
- 💅 **Theme-Aware** - Components automatically adapt to the active theme
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices
- ⚡ **Fast** - Built with Vite for lightning-fast development

## Component Categories

- **Primitives** - Buttons, badges, inputs, cards, checkboxes, alerts, spinners
- **Layout** - Containers, grids, stacks, spacing utilities
- **Typography** - Headings and text with theme-aware fonts
- **Navigation** - Navigation bars, announcement bars
- **Feedback** - Modals, tooltips, tabs, dropdowns
- **Data** - Tables, pagination, galleries
- **Animated** - Fade-in, parallax sections

## Development

### Prerequisites

- Node.js 18+
- pnpm (workspace manager)

### Setup

1. **Install dependencies** (from workspace root):
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   cd @packages/egirl-ui/showcase
   pnpm dev
   ```

   The showcase will be available at `http://localhost:3051`

### Scripts

- `pnpm dev` - Start development server (port 3051)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm typecheck` - Type check without building

## Architecture

**Tech Stack:**
- ⚡ **Vite** - Lightning-fast build tool
- ⚛️ **React 18** - Modern React with hooks
- 💅 **styled-components** - CSS-in-JS styling with theme context
- 🛣️ **React Router** - Client-side routing
- 📦 **TypeScript** - Type-safe development

**Key Files:**
- `vite.config.ts` - Vite configuration with path aliases to egirl-ui source
- `src/App.tsx` - Main application with routing and theme provider
- `src/components/HomePage.tsx` - Landing page with feature overview
- `src/components/ComponentsPage.tsx` - Component demonstration pages
- `src/styles/global.css` - Global styles

## Theme Switching

The showcase demonstrates egirl-ui's core feature: runtime theme switching.

Components use semantic tokens from `@transftw/theme-provider`:

```tsx
// Components automatically adapt to theme
const StyledButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
`
```

Switch themes using the sidebar controls:
- **✨ Luxe** - Elegant serif fonts, soft shadows, charcoal/gold/rose colors
- **🌐 Cyberpunk** - Monospace fonts, neon glows, magenta/cyan/green colors

## Deployment

### Option 1: Static Hosting (Netlify, Vercel)

**Build the showcase:**
```bash
cd @packages/egirl-ui/showcase
pnpm build
```

**Deploy the `dist/` directory** to any static hosting provider:

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: `vercel --prod dist/`
- **AWS S3**: `aws s3 sync dist/ s3://your-bucket-name/`

### Option 2: Digital Ocean Apps Platform

Create `app.yaml`:
```yaml
name: egirl-ui-showcase
region: nyc
static_sites:
- name: showcase
  github:
    repo: transquinnftw/egirl-platform
    branch: main
    deploy_on_push: true
  source_dir: /@packages/egirl-ui/showcase
  build_command: pnpm build
  output_dir: dist
  routes:
  - path: /
```

Deploy:
```bash
doctl apps create --spec app.yaml
```

## Configuration

### Vite Path Aliases

Path aliases in `vite.config.ts` point to source files (not built packages):

```typescript
resolve: {
  alias: {
    '@transftw/egirl-ui': path.resolve(__dirname, '../src/index.ts'),
    '@transftw/theme-provider': path.resolve(__dirname, '../../theme-provider/src/index.ts'),
  }
}
```

This ensures:
- Hot reload works during development
- Production builds include source code
- No symlink issues on Windows

### Adding New Components

To showcase new components:

1. **Import the component** in `src/components/ComponentsPage.tsx`:
   ```tsx
   import { NewComponent } from '@transftw/egirl-ui'
   ```

2. **Add demo section** in the appropriate category renderer:
   ```tsx
   <ComponentSection>
     <ComponentTitle>NewComponent</ComponentTitle>
     <ComponentDescription>
       Description of what this component does.
     </ComponentDescription>
     <ComponentDemo>
       <NewComponent variant="primary">Demo</NewComponent>
     </ComponentDemo>
   </ComponentSection>
   ```

3. **Hot reload** will automatically update the showcase

## Project Structure

```
showcase/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx          # Landing page
│   │   └── ComponentsPage.tsx    # Component demonstrations
│   ├── styles/
│   │   └── global.css            # Global styles
│   ├── App.tsx                   # Main app with routing
│   └── main.tsx                  # Entry point
├── index.html                    # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── package.json
└── README.md
```

## Troubleshooting

### Build fails with "Cannot find module"

1. Verify workspace packages are installed: `pnpm install` (from root)
2. Check path aliases in `vite.config.ts` match package locations
3. Ensure `@transftw/egirl-ui` and `@transftw/theme-provider` exist

### Hot reload not working

1. Restart dev server: `pnpm dev`
2. Check for syntax errors in console
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Theme not switching

1. Verify `ThemeProvider` wraps the app in `App.tsx`
2. Check `useTheme()` hook is used correctly
3. Ensure styled-components is using theme context

## License

MIT

## Links

- **egirl-ui Package**: [../README.md](../README.md)
- **Theme Provider**: [../../theme-provider/README.md](../../theme-provider/README.md)
- **GitHub**: https://github.com/transquinnftw/egirl-platform
- **Author**: [QuinnFTW](https://github.com/transquinnftw)
