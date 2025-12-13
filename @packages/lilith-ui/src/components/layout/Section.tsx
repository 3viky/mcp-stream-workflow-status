/**
 * Section Component
 *
 * Page sections with configurable backgrounds and padding.
 * Provides consistent vertical spacing for page layouts.
 * Theme-agnostic with semantic token usage.
 */

import styled from 'styled-components'

export interface SectionProps {
  /** Background variant */
  variant?: 'default' | 'alt' | 'elevated'
  /** Vertical padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** HTML id for navigation anchors */
  id?: string
  /** Custom className */
  className?: string
  /** Child elements */
  children: React.ReactNode
}

const StyledSection = styled.section<{
  $variant: SectionProps['variant']
  $padding: SectionProps['padding']
}>`
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'alt':
        return theme.colors.surface
      case 'elevated':
        // For elevated, use a slightly different shade - could be surface with opacity
        // or a dedicated elevated color if theme provides it
        return theme.colors.surface
      case 'default':
      default:
        return theme.colors.background
    }
  }};

  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'none':
        return '0'
      case 'sm':
        return `${theme.spacing.xl} 0`
      case 'md':
        return `${theme.spacing.xxl} 0`
      case 'lg':
        // Using xxl * 2 for large spacing (approximately)
        return `calc(${theme.spacing.xxl} * 1.5) 0`
      case 'xl':
        return `calc(${theme.spacing.xxl} * 2) 0`
      default:
        return `${theme.spacing.xxl} 0`
    }
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ $padding, theme }) => {
      switch ($padding) {
        case 'none':
          return '0'
        case 'sm':
          return `${theme.spacing.md} 0`
        case 'md':
          return `${theme.spacing.lg} 0`
        case 'lg':
          return `${theme.spacing.xl} 0`
        case 'xl':
          return `${theme.spacing.xxl} 0`
        default:
          return `${theme.spacing.lg} 0`
      }
    }};
  }
`

export function Section({
  variant = 'default',
  padding = 'md',
  id,
  className,
  children,
}: SectionProps) {
  return (
    <StyledSection
      $variant={variant}
      $padding={padding}
      id={id}
      className={className}
    >
      {children}
    </StyledSection>
  )
}
