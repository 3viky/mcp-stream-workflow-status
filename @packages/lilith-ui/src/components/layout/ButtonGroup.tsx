/**
 * ButtonGroup Component
 *
 * Container component for grouping related buttons together.
 * Provides consistent spacing and layout for button collections.
 * Theme-agnostic with semantic token usage.
 */

import styled from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import type { ReactNode } from 'react'

export interface ButtonGroupProps {
  /** Button elements to group together */
  children: ReactNode
  /** Additional CSS class name */
  className?: string
}

const StyledButtonGroup = styled.div`
  display: inline-flex;
  gap: ${props => (props.theme as ThemeInterface).spacing.sm};

  /* First and last button border radius for connected appearance */
  > button:first-child {
    border-top-left-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
    border-bottom-left-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
  }

  > button:last-child {
    border-top-right-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
    border-bottom-right-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
  }

  /* Single button in group keeps all rounded corners */
  > button:only-child {
    border-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
  }
`

/**
 * Container component for grouping related buttons together.
 * Provides consistent spacing and layout for button collections.
 *
 * @example
 * // Basic button group
 * <ButtonGroup>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </ButtonGroup>
 *
 * @example
 * // Button group with multiple actions
 * <ButtonGroup>
 *   <Button variant="secondary">Back</Button>
 *   <Button variant="secondary">Save Draft</Button>
 *   <Button variant="primary">Publish</Button>
 * </ButtonGroup>
 *
 * @example
 * // Button group with custom styling
 * <ButtonGroup className="form-actions">
 *   <Button variant="danger">Delete</Button>
 *   <Button variant="warning">Archive</Button>
 *   <Button variant="success">Approve</Button>
 * </ButtonGroup>
 */
export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return <StyledButtonGroup className={className}>{children}</StyledButtonGroup>
}
