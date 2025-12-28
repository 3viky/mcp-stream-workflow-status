/**
 * LuxeText Component
 *
 * Body text component with fluid responsive sizing.
 * Uses Inter font for clean readability.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface TextProps {
  /** HTML element to render */
  as?: 'p' | 'span' | 'div' | 'label';
  /** Text size */
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';
  /** Font weight */
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Text color */
  color?: keyof typeof luxeTheme.colors;
  /** Line height */
  lineHeight?: 'tight' | 'base' | 'relaxed' | 'loose';
  /** Margin bottom */
  marginBottom?: keyof typeof luxeTheme.spacing;
  /** Custom className */
  className?: string;
  /** Text content */
  children: React.ReactNode;
}

const StyledText = styled.p<{
  $size: TextProps['size'];
  $weight: TextProps['weight'];
  $align: TextProps['align'];
  $color?: keyof typeof luxeTheme.colors;
  $lineHeight: TextProps['lineHeight'];
  $marginBottom?: keyof typeof luxeTheme.spacing;
}>`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return luxeTheme.typography.sizes.xs
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
      default:
        return luxeTheme.typography.sizes.base
    }
  }};

  font-weight: ${({ $weight }) => {
    switch ($weight) {
      case 'light':
        return luxeTheme.typography.weights.light
      case 'regular':
        return luxeTheme.typography.weights.regular
      case 'medium':
        return luxeTheme.typography.weights.medium
      case 'semibold':
        return luxeTheme.typography.weights.semibold
      case 'bold':
        return luxeTheme.typography.weights.bold
      default:
        return luxeTheme.typography.weights.regular
    }
  }};

  line-height: ${({ $lineHeight }) => {
    switch ($lineHeight) {
      case 'tight':
        return luxeTheme.typography.lineHeights.tight
      case 'base':
        return luxeTheme.typography.lineHeights.base
      case 'relaxed':
        return luxeTheme.typography.lineHeights.relaxed
      case 'loose':
        return luxeTheme.typography.lineHeights.loose
      default:
        return luxeTheme.typography.lineHeights.relaxed
    }
  }};

  text-align: ${({ $align }) => $align || 'left'};
  color: ${({ $color }) =>
    $color ? luxeTheme.colors[$color] : luxeTheme.colors.text};
  margin-bottom: ${({ $marginBottom }) =>
    $marginBottom ? luxeTheme.spacing[$marginBottom] : luxeTheme.spacing[4]};
  margin-top: 0;
`

export function LuxeText({
  as = 'p',
  size = 'base',
  weight = 'regular',
  align = 'left',
  color,
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
