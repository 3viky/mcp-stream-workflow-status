/**
 * LuxeHeading Component
 *
 * Elegant heading component with fluid responsive sizing.
 * Uses Playfair Display font for premium aesthetic.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface HeadingProps {
  /** Heading level (h1-h6) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Visual size (can differ from semantic level) */
  size?: 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Font weight */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Text color */
  color?: keyof typeof luxeTheme.colors;
  /** Margin bottom */
  marginBottom?: keyof typeof luxeTheme.spacing;
  /** Custom className */
  className?: string;
  /** Heading text */
  children: React.ReactNode;
}

const StyledHeading = styled.h2<{
  $size: HeadingProps['size'];
  $weight: HeadingProps['weight'];
  $align: HeadingProps['align'];
  $color?: keyof typeof luxeTheme.colors;
  $marginBottom?: keyof typeof luxeTheme.spacing;
}>`
  font-family: ${luxeTheme.typography.fonts.heading};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return luxeTheme.typography.sizes.sm
      case 'base':
        return luxeTheme.typography.sizes.base
      case 'md':
        return luxeTheme.typography.sizes.md
      case 'lg':
        return luxeTheme.typography.sizes.lg
      case 'xl':
        return luxeTheme.typography.sizes.xl
      case '2xl':
        return luxeTheme.typography.sizes['2xl']
      case '3xl':
        return luxeTheme.typography.sizes['3xl']
      default:
        return luxeTheme.typography.sizes.xl
    }
  }};

  font-weight: ${({ $weight }) => {
    switch ($weight) {
      case 'regular':
        return luxeTheme.typography.weights.regular
      case 'medium':
        return luxeTheme.typography.weights.medium
      case 'semibold':
        return luxeTheme.typography.weights.semibold
      case 'bold':
        return luxeTheme.typography.weights.bold
      default:
        return luxeTheme.typography.weights.semibold
    }
  }};

  line-height: ${luxeTheme.typography.lineHeights.tight};
  text-align: ${({ $align }) => $align || 'left'};
  color: ${({ $color }) =>
    $color ? luxeTheme.colors[$color] : luxeTheme.colors.text};
  margin-bottom: ${({ $marginBottom }) =>
    $marginBottom ? luxeTheme.spacing[$marginBottom] : luxeTheme.spacing[4]};
  margin-top: 0;
`

export function LuxeHeading({
  as = 'h2',
  size = 'xl',
  weight = 'semibold',
  align = 'left',
  color,
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
