/**
 * Text Component
 *
 * Body text component with responsive sizing and theme-aware typography.
 * - Luxe theme: Inter sans-serif with fluid responsive sizing
 * - Cyberpunk theme: Arial with fixed sizing
 * Theme adapter automatically provides correct font family and sizing.
 */

import styled from 'styled-components'

export interface TextProps {
  /** HTML element to render */
  as?: 'p' | 'span' | 'div' | 'label'
  /** Text size */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify'
  /** Text color variant */
  color?: 'primary' | 'secondary' | 'muted'
  /** Line height */
  lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose'
  /** Margin bottom (spacing size) */
  marginBottom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  /** Custom className */
  className?: string
  /** Text content */
  children: React.ReactNode
}

const StyledText = styled.p<{
  $size: TextProps['size']
  $weight: TextProps['weight']
  $align: TextProps['align']
  $color?: TextProps['color']
  $lineHeight: TextProps['lineHeight']
  $marginBottom?: TextProps['marginBottom']
}>`
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ $size, theme }) => {
    switch ($size) {
      case 'xs':
        return theme.typography.fontSize.xs
      case 'sm':
        return theme.typography.fontSize.sm
      case 'base':
        return theme.typography.fontSize.base
      case 'lg':
        return theme.typography.fontSize.lg
      case 'xl':
        return theme.typography.fontSize.xl
      default:
        return theme.typography.fontSize.base
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
        return theme.typography.fontWeight.normal
    }
  }};

  line-height: ${({ $lineHeight, theme }) => {
    switch ($lineHeight) {
      case 'tight':
        return theme.typography.lineHeight.tight
      case 'normal':
        return theme.typography.lineHeight.normal
      case 'relaxed':
        return theme.typography.lineHeight.relaxed
      case 'loose':
        return theme.typography.lineHeight.loose
      default:
        return theme.typography.lineHeight.relaxed
    }
  }};

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

export function Text({
  as = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  color = 'primary',
  lineHeight = 'relaxed',
  marginBottom,
  className,
  children,
}: TextProps) {
  return (
    <StyledText
      as={as}
      $size={size}
      $weight={weight}
      $align={align}
      $color={color}
      $lineHeight={lineHeight}
      $marginBottom={marginBottom}
      className={className}
    >
      {children}
    </StyledText>
  )
}
