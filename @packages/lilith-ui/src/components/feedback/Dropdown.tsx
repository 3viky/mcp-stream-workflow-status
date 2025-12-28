/**
 * Dropdown Component
 *
 * Controlled dropdown component with click-outside detection.
 * Requires external state management for isOpen.
 * Theme-agnostic with semantic token usage.
 */

import styled, { css } from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export interface DropdownProps {
  /** Trigger element that opens the dropdown when clicked */
  trigger: ReactNode
  /** Dropdown menu content */
  children: ReactNode
  /** Whether the dropdown is currently open */
  isOpen: boolean
  /** Callback to toggle dropdown visibility */
  onToggle: () => void
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${props => (props.theme as ThemeInterface).spacing.xs});
  left: 0;
  z-index: ${props => (props.theme as ThemeInterface).zIndex?.dropdown || 1000};
  background: ${props => (props.theme as ThemeInterface).colors.surface};
  border: 1px solid ${props => (props.theme as ThemeInterface).colors.border};
  border-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
  box-shadow: ${props => (props.theme as ThemeInterface).shadows.lg};
  min-width: 200px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all ${props => (props.theme as ThemeInterface).transitions.fast};

  /* Cyberpunk neon effect */
  ${props => {
    const theme = props.theme as ThemeInterface
    return (
      theme.extensions?.cyberpunk &&
      css`
        border-color: ${theme.colors.primary};
        box-shadow: ${theme.extensions.cyberpunk.neonGlow.cyan};
      `
    )
  }}
`

const DropdownItem = styled.button`
  width: 100%;
  padding: ${props => (props.theme as ThemeInterface).spacing.sm}
    ${props => (props.theme as ThemeInterface).spacing.md};
  text-align: left;
  border: none;
  background: transparent;
  color: ${props => (props.theme as ThemeInterface).colors.text.primary};
  cursor: pointer;
  transition: background ${props => (props.theme as ThemeInterface).transitions.fast};
  font-family: ${props => (props.theme as ThemeInterface).typography.fontFamily.body};
  font-size: ${props => (props.theme as ThemeInterface).typography.fontSize.base};

  &:first-child {
    border-top-left-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
    border-top-right-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
  }

  &:last-child {
    border-bottom-left-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
    border-bottom-right-radius: ${props => (props.theme as ThemeInterface).borderRadius.md};
  }

  &:hover {
    background: ${props => {
      const theme = props.theme as ThemeInterface
      return theme.colors.hover?.surface || theme.colors.secondary
    }};
  }

  &:focus {
    outline: 2px solid ${props => (props.theme as ThemeInterface).colors.primary};
    outline-offset: -2px;
  }

  &:active {
    background: ${props => {
      const theme = props.theme as ThemeInterface
      return theme.colors.hover.surface
    }};
  }
`

/**
 * Controlled dropdown component with click-outside detection.
 * Requires external state management for isOpen.
 *
 * @example
 * // Basic dropdown with button trigger
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   return (
 *     <Dropdown
 *       trigger={<Button>Menu</Button>}
 *       isOpen={isOpen}
 *       onToggle={() => setIsOpen(!isOpen)}
 *     >
 *       <div className="dropdown-item">Profile</div>
 *       <div className="dropdown-item">Settings</div>
 *       <div className="dropdown-item">Logout</div>
 *     </Dropdown>
 *   )
 * }
 *
 * @example
 * // Dropdown with custom trigger and styled menu
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   return (
 *     <Dropdown
 *       trigger={
 *         <Badge variant="primary" onClick={() => setIsOpen(!isOpen)}>
 *           Options
 *         </Badge>
 *       }
 *       isOpen={isOpen}
 *       onToggle={() => setIsOpen(!isOpen)}
 *     >
 *       <Card padding="sm">
 *         <Button fullWidth variant="secondary">Edit</Button>
 *         <Button fullWidth variant="danger">Delete</Button>
 *       </Card>
 *     </Dropdown>
 *   )
 * }
 */
export function Dropdown({ trigger, children, isOpen, onToggle }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onToggle])

  return (
    <DropdownContainer ref={dropdownRef}>
      <div onClick={onToggle}>{trigger}</div>
      <DropdownMenu $isOpen={isOpen}>{children}</DropdownMenu>
    </DropdownContainer>
  )
}

// Export DropdownItem for convenience
export { DropdownItem }
