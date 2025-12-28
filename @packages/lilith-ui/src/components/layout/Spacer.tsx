/**
 * Spacer Component
 *
 * Flexible spacer component for creating fixed or dynamic space in layouts.
 * Use 'auto' size to fill available space in flexbox layouts.
 * Theme-agnostic with semantic token usage.
 */

import styled, { css } from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'

export interface SpacerProps {
  /** Spacer size: named size or 'auto' for flexible spacing */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  /** Spacer direction: 'horizontal' (width) or 'vertical' (height) */
  direction?: 'horizontal' | 'vertical'
}

const StyledSpacer = styled.div<{
  $size: SpacerProps['size']
  $direction: SpacerProps['direction']
}>`
  ${props => {
    if (props.$size === 'auto') {
      return css`
        flex: 1;
      `
    }

    const theme = props.theme as ThemeInterface
    const spacingValue = theme.spacing[props.$size as keyof typeof theme.spacing]

    if (props.$direction === 'horizontal') {
      return css`
        width: ${spacingValue};
        flex-shrink: 0;
      `
    } else {
      return css`
        height: ${spacingValue};
        flex-shrink: 0;
      `
    }
  }}
`

/**
 * Flexible spacer component for creating fixed or dynamic space in layouts.
 * Use 'auto' size to fill available space in flexbox layouts.
 *
 * @example
 * // Auto spacer to push items apart in horizontal stack
 * <Stack direction="horizontal">
 *   <Button>Left</Button>
 *   <Spacer direction="horizontal" />
 *   <Button>Right</Button>
 * </Stack>
 *
 * @example
 * // Fixed vertical spacer
 * <Stack>
 *   <h3>Title</h3>
 *   <Spacer size="lg" />
 *   <p>Content with large spacing above</p>
 * </Stack>
 *
 * @example
 * // Fixed horizontal spacer between buttons
 * <Stack direction="horizontal" gap="none">
 *   <Button>First</Button>
 *   <Spacer direction="horizontal" size="xl" />
 *   <Button>Second</Button>
 * </Stack>
 */
export function Spacer({ size = 'auto', direction = 'vertical' }: SpacerProps) {
  return <StyledSpacer $size={size} $direction={direction} />
}
