/**
 * Global Styles for Luxe UI
 *
 * Provides foundational styles when using luxe-ui components.
 * Import once at the root of your application.
 */

import { createGlobalStyle } from 'styled-components'

import { luxeTheme } from './tokens.js'

export const LuxeGlobalStyles = createGlobalStyle`
  /* Import premium fonts */
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  /* CSS Reset & Foundational Styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${luxeTheme.typography.fonts.body};
    font-size: ${luxeTheme.typography.sizes.base};
    font-weight: ${luxeTheme.typography.weights.regular};
    line-height: ${luxeTheme.typography.lineHeights.base};
    color: ${luxeTheme.colors.text};
    background-color: ${luxeTheme.colors.background};
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${luxeTheme.typography.fonts.heading};
    font-weight: ${luxeTheme.typography.weights.semibold};
    line-height: ${luxeTheme.typography.lineHeights.tight};
    color: ${luxeTheme.colors.text};
    margin-bottom: ${luxeTheme.spacing[4]};
  }

  h1 {
    font-size: ${luxeTheme.typography.sizes['3xl']};
  }

  h2 {
    font-size: ${luxeTheme.typography.sizes['2xl']};
  }

  h3 {
    font-size: ${luxeTheme.typography.sizes.xl};
  }

  h4 {
    font-size: ${luxeTheme.typography.sizes.lg};
  }

  h5 {
    font-size: ${luxeTheme.typography.sizes.md};
  }

  h6 {
    font-size: ${luxeTheme.typography.sizes.base};
  }

  /* Paragraphs */
  p {
    margin-bottom: ${luxeTheme.spacing[4]};
    line-height: ${luxeTheme.typography.lineHeights.relaxed};
  }

  /* Links */
  a {
    color: ${luxeTheme.colors.primary};
    text-decoration: none;
    transition: color ${luxeTheme.transitions.base};

    &:hover {
      color: ${luxeTheme.colors.secondary};
    }

    &:focus-visible {
      outline: 2px solid ${luxeTheme.colors.focus};
      outline-offset: 2px;
      border-radius: ${luxeTheme.borderRadius.sm};
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${luxeTheme.spacing[4]};
    padding-left: ${luxeTheme.spacing[6]};
  }

  li {
    margin-bottom: ${luxeTheme.spacing[2]};
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;

    &:focus-visible {
      outline: 2px solid ${luxeTheme.colors.focus};
      outline-offset: 2px;
    }
  }

  /* Form elements */
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;

    &:focus-visible {
      outline: 2px solid ${luxeTheme.colors.focus};
      outline-offset: 0;
    }
  }

  /* Remove default input styles */
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }

  /* Selection */
  ::selection {
    background-color: ${luxeTheme.colors.secondary};
    color: ${luxeTheme.colors.white};
  }

  /* Scrollbar styling (webkit browsers) */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${luxeTheme.colors.backgroundAlt};
  }

  ::-webkit-scrollbar-thumb {
    background: ${luxeTheme.colors.mediumGray};
    border-radius: ${luxeTheme.borderRadius.base};

    &:hover {
      background: ${luxeTheme.colors.darkGray};
    }
  }

  /* Focus visible polyfill */
  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }
`
