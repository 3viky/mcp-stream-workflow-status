/**
 * LuxeSection Component
 *
 * Page sections with configurable backgrounds and padding.
 * Provides consistent vertical spacing for page layouts.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface SectionProps {
  /** Background variant */
  variant?: 'default' | 'alt' | 'elevated';
  /** Vertical padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** HTML id for navigation anchors */
  id?: string;
  /** Custom className */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

const StyledSection = styled.section<{
  $variant: SectionProps['variant'];
  $padding: SectionProps['padding'];
}>`
  background-color: ${({ $variant }) => {
    switch ($variant) {
      case 'alt':
        return luxeTheme.colors.backgroundAlt
      case 'elevated':
        return luxeTheme.colors.backgroundElevated
      case 'default':
      default:
        return luxeTheme.colors.background
    }
  }};

  padding: ${({ $padding }) => {
    switch ($padding) {
      case 'none':
        return '0'
      case 'sm':
        return `${luxeTheme.spacing[12]} 0`
      case 'md':
        return `${luxeTheme.spacing[16]} 0`
      case 'lg':
        return `${luxeTheme.spacing[24]} 0`
      case 'xl':
        return `${luxeTheme.spacing[32]} 0`
      default:
        return `${luxeTheme.spacing[16]} 0`
    }
  }};

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    padding: ${({ $padding }) => {
      switch ($padding) {
        case 'none':
          return '0'
        case 'sm':
          return `${luxeTheme.spacing[8]} 0`
        case 'md':
          return `${luxeTheme.spacing[12]} 0`
        case 'lg':
          return `${luxeTheme.spacing[16]} 0`
        case 'xl':
          return `${luxeTheme.spacing[20]} 0`
        default:
          return `${luxeTheme.spacing[12]} 0`
      }
    }};
  }
`

export function LuxeSection({
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
