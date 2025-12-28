/**
 * Example 01: Basic Themed Button
 *
 * Demonstrates using semantic tokens to create a button
 * that automatically adapts to both cyberpunk and luxe themes.
 */

import React from 'react'
import styled from 'styled-components'

export const ThemedButton = styled.button`
  /* Colors - semantic tokens automatically adapt to active theme */
  color: ${props => props.theme.colors.text.primary};
  background: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};

  /* Spacing - consistent across all themes */
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};

  /* Typography - theme-appropriate fonts */
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};

  /* Border radius - theme-specific rounding */
  border-radius: ${props => props.theme.borderRadius.md};

  /* Transitions - smooth interactions */
  transition: ${props => props.theme.transitions.normal};

  cursor: pointer;

  /* Hover state - using semantic hover colors */
  &:hover {
    background: ${props => props.theme.colors.hover.primary};
    border-color: ${props => props.theme.colors.hover.primary};
  }

  /* Active state */
  &:active {
    background: ${props => props.theme.colors.active.primary};
  }

  /* Disabled state */
  &:disabled {
    background: ${props => props.theme.colors.disabled.background};
    color: ${props => props.theme.colors.disabled.text};
    cursor: not-allowed;
  }
`

// Usage:
export function ButtonExample() {
  return (
    <div>
      <ThemedButton>Click Me</ThemedButton>
      <ThemedButton disabled>Disabled</ThemedButton>
    </div>
  )
}

/**
 * Result:
 * - Cyberpunk theme: Neon magenta button with white text
 * - Luxe theme: Charcoal button with white text
 * - No theme-specific code required!
 */
