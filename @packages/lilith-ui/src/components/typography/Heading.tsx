/**
 * Heading Component
 *
 * Semantic heading component with responsive sizing and theme-aware typography.
 * - Luxe theme: Playfair Display serif with fluid responsive sizing
 * - Cyberpunk theme: Courier New monospace with fixed sizing
 * Theme adapter automatically provides correct font family and sizing.
 */

import styled from 'styled-components'

export interface HeadingProps {
  /** Heading level (h1-h6) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Visual size (can differ from semantic level) */
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Text color variant */
  color?: 'primary' | 'secondary' | 'muted'
  /** Margin bottom (spacing size) */
  marginBottom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  /** Custom className */
  className?: string
  /** Heading text */
  children: React.ReactNode
}

const StyledHeading = styled.h2<{
  $size: HeadingProps['size']
  $weight: HeadingProps['weight']
  $align: HeadingProps['align']
  $color?: HeadingProps['color']
  $marginBottom?: HeadingProps['marginBottom']
}>`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return theme.typography.fontSize.sm
      case 'base':
        return theme.typography.fontSize.base
      case 'lg':
        return theme.typography.fontSize.lg
      case 'xl':
        return theme.typography.fontSize.xl
      case '2xl':
        return theme.typography.fontSize['2xl']
      case '3xl':
        return theme.typography.fontSize['3xl']
      default:
        return theme.typography.fontSize.xl
    }
  }};

  font-weight: ${({ $weight, theme }) => {
    switch ($weight) {
      case 'light':
        return theme.typography.fontWeight.light
      case 'normal':
        return theme.typography.fontWeight.normal
      case 'medium':
        return theme.typography.fontWeight.medium
      case 'semibold':
        return theme.typography.fontWeight.semibold
      case 'bold':
        return theme.typography.fontWeight.bold
      default:
        return theme.typography.fontWeight.semibold
    }
  }};

  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: ${({ $align }) => $align || 'left'};

  color: ${({ $color, theme }) => {
    switch ($color) {
      case 'secondary':
        return theme.colors.text.secondary
      case 'muted':
        return theme.colors.text.muted
      case 'primary':
      default:
        return theme.colors.text.primary
    }
  }};

  margin-bottom: ${({ $marginBottom, theme }) => {
    if (!$marginBottom) return theme.spacing.sm
    return theme.spacing[$marginBottom]
  }};

  margin-top: 0;
`

export function Heading({
  as = 'h2',
  size = 'xl',
  weight = 'semibold',
  align = 'left',
  color = 'primary',
  marginBottom,
  className,
  children,
}: HeadingProps) {
  return (
    <StyledHeading
      as={as}
      $size={size}
      $weight={weight}
      $align={align}
      $color={color}
      $marginBottom={marginBottom}
      className={className}
    >
      {children}
    </StyledHeading>
  )
}
