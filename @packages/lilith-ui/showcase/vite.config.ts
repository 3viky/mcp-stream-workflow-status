import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // Base path for deployment
  base: '/',

  resolve: {
    alias: {
      // Path alias to egirl-ui source (import from source, not built package)
      '@transftw/lilith-ui': path.resolve(__dirname, '../src/index.ts'),
      '@transftw/theme-provider': path.resolve(__dirname, '../../theme-provider/src/index.ts'),
      '@transftw/design-tokens': path.resolve(__dirname, '../../design-tokens/src/index.ts'),

      // Showcase internal alias
      '@showcase': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'styled-vendor': ['styled-components'],
        },
      },
    },
  },

  server: {
    port: 3051,
    open: true,
  },
})
