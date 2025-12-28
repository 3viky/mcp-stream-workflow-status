/**
 * Container Component
 *
 * Max-width wrapper with responsive padding for content containment.
 * Provides consistent horizontal spacing across different screen sizes.
 * Theme-agnostic with semantic token usage.
 */

import styled from 'styled-components'

export interface ContainerProps {
  /** Maximum width of container */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Center the container */
  centered?: boolean
  /** Custom className */
  className?: string
  /** Child elements */
  children: React.ReactNode
}

// Standard container max-widths (consistent across themes)
const containerSizes = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  full: '100%',
} as const

const StyledContainer = styled.div<{
  $size: ContainerProps['size']
  $padding: ContainerProps['padding']
  $centered: boolean
}>`
  width: 100%;
  max-width: ${({ $size }) => containerSizes[$size || '2xl']};
  margin: ${({ $centered }) => ($centered ? '0 auto' : '0')};

  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'none':
        return '0'
      case 'sm':
        return `0 ${theme.spacing.sm}`
      case 'md':
        return `0 ${theme.spacing.md}`
      case 'lg':
        return `0 ${theme.spacing.lg}`
      default:
        return `0 ${theme.spacing.md}`
    }
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ $padding, theme }) => {
      if ($padding === 'none') return '0'
      return `0 ${theme.spacing.sm}`
    }};
  }
`

export function Container({
  size = '2xl',
  padding = 'md',
  centered = true,
  className,
  children,
}: ContainerProps) {
  return (
    <StyledContainer
      $size={size}
      $padding={padding}
      $centered={centered}
      className={className}
    >
      {children}
    </StyledContainer>
  )
}
