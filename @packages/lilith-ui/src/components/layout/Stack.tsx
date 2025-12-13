/**
 * Stack Component
 *
 * Flexbox-based stack layout component for arranging items vertically or horizontally.
 * Provides consistent spacing and alignment with optional wrapping.
 * Theme-agnostic with semantic token usage.
 */

import styled from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import type { CSSProperties, ReactNode } from 'react'

export interface StackProps {
  /** Stack items */
  children: ReactNode
  /** Stack direction: horizontal (row) or vertical (column) */
  direction?: 'horizontal' | 'vertical'
  /** Gap between stack items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Align items on the cross axis */
  align?: CSSProperties['alignItems']
  /** Justify content on the main axis */
  justify?: CSSProperties['justifyContent']
  /** Allow items to wrap */
  wrap?: boolean
  /** Additional CSS class name */
  className?: string
  /** Take full width of container */
  fullWidth?: boolean
  /** Take full height of container */
  fullHeight?: boolean
}

const StyledStack = styled.div<{
  $direction: 'horizontal' | 'vertical'
  $gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  $align: CSSProperties['alignItems']
  $justify: CSSProperties['justifyContent']
  $wrap: boolean
  $fullWidth: boolean
  $fullHeight: boolean
}>`
  display: flex;
  flex-direction: ${props => (props.$direction === 'horizontal' ? 'row' : 'column')};
  gap: ${props => {
    const theme = props.theme as ThemeInterface
    return props.$gap === 'none' ? '0' : theme.spacing[props.$gap]
  }};
  align-items: ${props => props.$align};
  justify-content: ${props => props.$justify};
  flex-wrap: ${props => (props.$wrap ? 'wrap' : 'nowrap')};
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
  height: ${props => (props.$fullHeight ? '100%' : 'auto')};
`

/**
 * Flexbox-based stack layout component for arranging items vertically or horizontally.
 * Provides consistent spacing and alignment with optional wrapping.
 *
 * @example
 * // Basic vertical stack
 * <Stack gap="lg">
 *   <Card>First</Card>
 *   <Card>Second</Card>
 *   <Card>Third</Card>
 * </Stack>
 *
 * @example
 * // Horizontal stack with centered alignment
 * <Stack
 *   direction="horizontal"
 *   align="center"
 *   justify="space-between"
 *   fullWidth
 * >
 *   <h3>Title</h3>
 *   <ButtonGroup>
 *     <Button>Save</Button>
 *     <Button variant="secondary">Cancel</Button>
 *   </ButtonGroup>
 * </Stack>
 *
 * @example
 * // Wrapping horizontal stack
 * <Stack direction="horizontal" wrap gap="sm">
 *   {tags.map(tag => (
 *     <Badge key={tag}>{tag}</Badge>
 *   ))}
 * </Stack>
 */
export function Stack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  className,
  fullWidth = false,
  fullHeight = false
}: StackProps) {
  return (
    <StyledStack
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $fullWidth={fullWidth}
      $fullHeight={fullHeight}
      className={className}
    >
      {children}
    </StyledStack>
  )
}
