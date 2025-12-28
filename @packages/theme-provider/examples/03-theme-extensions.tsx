/**
 * Example 03: Theme Extensions
 *
 * Demonstrates using optional theme-specific effects
 * that enhance components when available.
 */

import React from 'react'
import styled, { css } from 'styled-components'

const Card = styled.div`
  /* Base styling with semantic tokens - works for all themes */
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};

  /* Optional: Add cyberpunk-specific neon glow effect */
  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: ${props.theme.extensions.cyberpunk.neonGlow.magenta};

    /* Add scanlines effect */
    background-image: ${props.theme.extensions.cyberpunk.scanlines};
  `}

  /* Optional: Add luxe-specific elegant shadow */
  ${props => props.theme.extensions?.luxe && css`
    box-shadow: ${props.theme.extensions.luxe.elegantShadow};
  `}
`

const Heading = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};

  /* Optional: Add cyberpunk glitch effect */
  ${props => props.theme.extensions?.cyberpunk && css`
    filter: ${props.theme.extensions.cyberpunk.glitchEffect};
  `}
`

const Badge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};

  /* Optional: Add luxe gold shimmer effect */
  ${props => props.theme.extensions?.luxe && css`
    background: ${props.theme.extensions.luxe.goldShimmer};
  `}

  /* Optional: Add cyberpunk cyan glow */
  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: ${props.theme.extensions.cyberpunk.neonGlow.cyan};
  `}
`

export function ExtensionExample() {
  return (
    <Card>
      <Heading>Theme Extensions Example</Heading>
      <p>
        This card demonstrates optional theme-specific enhancements.
        <Badge>NEW</Badge>
      </p>
      <p>
        Base styling uses semantic tokens (works everywhere).
        Enhanced effects are added when theme supports them.
      </p>
    </Card>
  )
}

/**
 * Result:
 * - Cyberpunk theme: Card with neon glow, scanlines, and glitch effect
 * - Luxe theme: Card with elegant shadow and gold shimmer
 * - Component works in both themes
 * - Extensions are OPTIONAL - won't break if theme doesn't support them
 */
