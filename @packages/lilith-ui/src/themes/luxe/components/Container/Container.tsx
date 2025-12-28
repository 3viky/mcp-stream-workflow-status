/**
 * LuxeContainer Component
 *
 * Max-width wrapper with responsive padding for content containment.
 * Provides consistent horizontal spacing across different screen sizes.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface ContainerProps {
  /** Maximum width of container */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Center the container */
  centered?: boolean;
  /** Custom className */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

const StyledContainer = styled.div<{
  $size: ContainerProps['size'];
  $padding: ContainerProps['padding'];
  $centered: boolean;
}>`
  width: 100%;
  max-width: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return luxeTheme.containers.sm
      case 'md':
        return luxeTheme.containers.md
      case 'lg':
        return luxeTheme.containers.lg
      case 'xl':
        return luxeTheme.containers.xl
      case '2xl':
        return luxeTheme.containers['2xl']
      case 'full':
      default:
        return luxeTheme.containers.full
    }
  }};

  margin: ${({ $centered }) => ($centered ? '0 auto' : '0')};

  padding: ${({ $padding }) => {
    switch ($padding) {
      case 'none':
        return '0'
      case 'sm':
        return `0 ${luxeTheme.spacing[4]}`
      case 'md':
        return `0 ${luxeTheme.spacing[6]}`
      case 'lg':
        return `0 ${luxeTheme.spacing[8]}`
      default:
        return `0 ${luxeTheme.spacing[6]}`
    }
  }};

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    padding: ${({ $padding }) => {
      if ($padding === 'none') return '0'
      return `0 ${luxeTheme.spacing[4]}`
    }};
  }
`

export function LuxeContainer({
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
