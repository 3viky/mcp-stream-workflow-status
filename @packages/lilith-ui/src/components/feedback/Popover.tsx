/**
 * Popover Component
 *
 * Popover overlay component with flexible positioning and rich content support.
 * Similar to Dropdown but supports more complex content and positioning options.
 * Theme-agnostic with semantic token usage.
 */

import styled, { css } from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export interface PopoverProps {
  /** Trigger element that opens the popover when clicked */
  trigger: ReactNode
  /** Popover content (can be any React elements) */
  children: ReactNode
  /** Whether the popover is currently open */
  isOpen: boolean
  /** Callback to toggle popover visibility */
  onToggle: () => void
  /** Popover position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Popover alignment relative to trigger */
  align?: 'start' | 'center' | 'end'
}

const PopoverContainer = styled.div`
  position: relative;
  display: inline-block;
`

const PopoverContent = styled.div<{
  $isOpen: boolean
  $position: 'top' | 'bottom' | 'left' | 'right'
  $align: 'start' | 'center' | 'end'
}>`
  position: absolute;
  z-index: ${props => (props.theme as ThemeInterface).zIndex?.popover || 1100};
  background: ${props => (props.theme as ThemeInterface).colors.surface};
  border: 1px solid ${props => (props.theme as ThemeInterface).colors.border};
  border-radius: ${props => (props.theme as ThemeInterface).borderRadius.lg};
  box-shadow: ${props => (props.theme as ThemeInterface).shadows.xl};
  padding: ${props => (props.theme as ThemeInterface).spacing.md};
  min-width: 200px;
  max-width: 400px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition: all ${props => (props.theme as ThemeInterface).transitions.fast};

  /* Position-based offset */
  ${props => {
    const theme = props.theme as ThemeInterface
    const offset = theme.spacing.sm

    switch (props.$position) {
      case 'top':
        return css`
          bottom: calc(100% + ${offset});
          ${props.$align === 'start' && 'left: 0;'}
          ${props.$align === 'center' && 'left: 50%; transform: translateX(-50%);'}
          ${props.$align === 'end' && 'right: 0;'}
          transform: ${props.$align === 'center'
            ? props.$isOpen
              ? 'translateX(-50%) translateY(0)'
              : 'translateX(-50%) translateY(8px)'
            : props.$isOpen
              ? 'translateY(0)'
              : 'translateY(8px)'};
        `
      case 'bottom':
        return css`
          top: calc(100% + ${offset});
          ${props.$align === 'start' && 'left: 0;'}
          ${props.$align === 'center' && 'left: 50%; transform: translateX(-50%);'}
          ${props.$align === 'end' && 'right: 0;'}
          transform: ${props.$align === 'center'
            ? props.$isOpen
              ? 'translateX(-50%) translateY(0)'
              : 'translateX(-50%) translateY(-8px)'
            : props.$isOpen
              ? 'translateY(0)'
              : 'translateY(-8px)'};
        `
      case 'left':
        return css`
          right: calc(100% + ${offset});
          ${props.$align === 'start' && 'top: 0;'}
          ${props.$align === 'center' && 'top: 50%; transform: translateY(-50%);'}
          ${props.$align === 'end' && 'bottom: 0;'}
          transform: ${props.$align === 'center'
            ? props.$isOpen
              ? 'translateY(-50%) translateX(0)'
              : 'translateY(-50%) translateX(8px)'
            : props.$isOpen
              ? 'translateX(0)'
              : 'translateX(8px)'};
        `
      case 'right':
        return css`
          left: calc(100% + ${offset});
          ${props.$align === 'start' && 'top: 0;'}
          ${props.$align === 'center' && 'top: 50%; transform: translateY(-50%);'}
          ${props.$align === 'end' && 'bottom: 0;'}
          transform: ${props.$align === 'center'
            ? props.$isOpen
              ? 'translateY(-50%) translateX(0)'
              : 'translateY(-50%) translateX(-8px)'
            : props.$isOpen
              ? 'translateX(0)'
              : 'translateX(-8px)'};
        `
    }
  }}

  /* Cyberpunk neon effect */
  ${props => {
    const theme = props.theme as ThemeInterface
    return (
      theme.extensions?.cyberpunk &&
      css`
        border-color: ${theme.colors.primary};
        box-shadow: ${theme.extensions.cyberpunk.neonGlow.magenta};
        backdrop-filter: blur(4px);
      `
    )
  }}
`

const PopoverArrow = styled.div<{
  $position: 'top' | 'bottom' | 'left' | 'right'
  $align: 'start' | 'center' | 'end'
}>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;

  ${props => {
    const theme = props.theme as ThemeInterface
    const borderColor = theme.extensions?.cyberpunk
      ? theme.colors.primary
      : theme.colors.border

    const arrowSize = '8px'

    switch (props.$position) {
      case 'top':
        return css`
          bottom: -${arrowSize};
          ${props.$align === 'start' && `left: ${theme.spacing.md};`}
          ${props.$align === 'center' && 'left: 50%; transform: translateX(-50%);'}
          ${props.$align === 'end' && `right: ${theme.spacing.md};`}
          border-width: ${arrowSize} ${arrowSize} 0 ${arrowSize};
          border-color: ${borderColor} transparent transparent transparent;
        `
      case 'bottom':
        return css`
          top: -${arrowSize};
          ${props.$align === 'start' && `left: ${theme.spacing.md};`}
          ${props.$align === 'center' && 'left: 50%; transform: translateX(-50%);'}
          ${props.$align === 'end' && `right: ${theme.spacing.md};`}
          border-width: 0 ${arrowSize} ${arrowSize} ${arrowSize};
          border-color: transparent transparent ${borderColor} transparent;
        `
      case 'left':
        return css`
          right: -${arrowSize};
          ${props.$align === 'start' && `top: ${theme.spacing.md};`}
          ${props.$align === 'center' && 'top: 50%; transform: translateY(-50%);'}
          ${props.$align === 'end' && `bottom: ${theme.spacing.md};`}
          border-width: ${arrowSize} 0 ${arrowSize} ${arrowSize};
          border-color: transparent transparent transparent ${borderColor};
        `
      case 'right':
        return css`
          left: -${arrowSize};
          ${props.$align === 'start' && `top: ${theme.spacing.md};`}
          ${props.$align === 'center' && 'top: 50%; transform: translateY(-50%);'}
          ${props.$align === 'end' && `bottom: ${theme.spacing.md};`}
          border-width: ${arrowSize} ${arrowSize} ${arrowSize} 0;
          border-color: transparent ${borderColor} transparent transparent;
        `
    }
  }}
`

/**
 * Popover overlay component with flexible positioning and rich content support.
 * Similar to Dropdown but supports more complex content and positioning options.
 *
 * @example
 * // Basic popover
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   return (
 *     <Popover
 *       trigger={<Button>Show Info</Button>}
 *       isOpen={isOpen}
 *       onToggle={() => setIsOpen(!isOpen)}
 *     >
 *       <h4>More Information</h4>
 *       <p>This is detailed content that can include any React elements.</p>
 *     </Popover>
 *   )
 * }
 *
 * @example
 * // Popover with custom positioning
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   return (
 *     <Popover
 *       trigger={<Badge>Help</Badge>}
 *       isOpen={isOpen}
 *       onToggle={() => setIsOpen(!isOpen)}
 *       position="right"
 *       align="start"
 *     >
 *       <Card>
 *         <h3>Help Section</h3>
 *         <ul>
 *           <li>Step 1: Do this</li>
 *           <li>Step 2: Do that</li>
 *         </ul>
 *       </Card>
 *     </Popover>
 *   )
 * }
 */
export function Popover({
  trigger,
  children,
  isOpen,
  onToggle,
  position = 'bottom',
  align = 'start'
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onToggle])

  return (
    <PopoverContainer ref={popoverRef}>
      <div onClick={onToggle}>{trigger}</div>
      <PopoverContent $isOpen={isOpen} $position={position} $align={align}>
        {children}
        <PopoverArrow $position={position} $align={align} />
      </PopoverContent>
    </PopoverContainer>
  )
}
