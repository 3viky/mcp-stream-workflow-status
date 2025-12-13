/**
 * Example 04: Responsive Layout with Theme Breakpoints
 *
 * Demonstrates using theme breakpoints for responsive design.
 */

import React from 'react'
import styled from 'styled-components'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};

  /* Tablet: 2 columns */
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.md};
  }

  /* Mobile: 1 column */
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
  }
`

const GridItem = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};

  /* Responsive padding */
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`

const Title = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};

  /* Responsive font size */
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

const Description = styled.p`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};

  /* Responsive font size */
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`

export function ResponsiveExample() {
  return (
    <ResponsiveGrid>
      {[1, 2, 3, 4, 5, 6].map(num => (
        <GridItem key={num}>
          <Title>Item {num}</Title>
          <Description>
            This grid adapts to screen size using theme breakpoints.
            Desktop: 3 columns | Tablet: 2 columns | Mobile: 1 column
          </Description>
        </GridItem>
      ))}
    </ResponsiveGrid>
  )
}

/**
 * Theme Breakpoints:
 * - xs: 0px
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * Result:
 * - Consistent responsive behavior across themes
 * - Breakpoints match theme system
 * - Spacing scales appropriately
 */
