/**
 * Tooltip Component
 *
 * Tooltip component with delayed appearance and directional positioning.
 * Features portal rendering and arrow indicator.
 * Theme-agnostic with semantic token usage.
 */

import styled, { css } from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface TooltipProps {
  /** Element that triggers the tooltip on hover */
  children: ReactNode
  /** Tooltip text content */
  content: string
  /** Delay before showing tooltip in milliseconds (default: 500) */
  delay?: number
  /** Tooltip position relative to trigger element */
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const TooltipWrapper = styled.div`
  display: inline-block;
`

const TooltipContent = styled.div<{
  $isVisible: boolean
  $position: 'top' | 'bottom' | 'left' | 'right'
  $x: number
  $y: number
}>`
  position: fixed;
  z-index: ${props => (props.theme as ThemeInterface).zIndex?.tooltip || 9999};
  background: ${props => (props.theme as ThemeInterface).colors.surface};
  color: ${props => (props.theme as ThemeInterface).colors.text.primary};
  padding: ${props => (props.theme as ThemeInterface).spacing.xs}
    ${props => (props.theme as ThemeInterface).spacing.sm};
  border-radius: ${props => (props.theme as ThemeInterface).borderRadius.sm};
  box-shadow: ${props => (props.theme as ThemeInterface).shadows.md};
  font-size: ${props => (props.theme as ThemeInterface).typography.fontSize.sm};
  font-family: ${props => (props.theme as ThemeInterface).typography.fontFamily.body};
  white-space: nowrap;
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  pointer-events: none;
  transition: opacity ${props => (props.theme as ThemeInterface).transitions.fast};
  border: 1px solid ${props => (props.theme as ThemeInterface).colors.border};

  /* Position-specific styling */
  ${props => {
    switch (props.$position) {
      case 'top':
        return css`
          left: ${props.$x}px;
          bottom: calc(100vh - ${props.$y}px + 8px);
          transform: translateX(-50%);
        `
      case 'bottom':
        return css`
          left: ${props.$x}px;
          top: ${props.$y + 8}px;
          transform: translateX(-50%);
        `
      case 'left':
        return css`
          right: calc(100vw - ${props.$x}px + 8px);
          top: ${props.$y}px;
          transform: translateY(-50%);
        `
      case 'right':
        return css`
          left: ${props.$x + 8}px;
          top: ${props.$y}px;
          transform: translateY(-50%);
        `
    }
  }}

  /* Cyberpunk neon border and glow */
  ${props => {
    const theme = props.theme as ThemeInterface
    return (
      theme.extensions?.cyberpunk &&
      css`
        border-color: ${theme.colors.primary};
        box-shadow: ${theme.extensions.cyberpunk.neonGlow.cyan};
        backdrop-filter: blur(4px);
      `
    )
  }}
`

const TooltipArrow = styled.div<{
  $position: 'top' | 'bottom' | 'left' | 'right'
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

    switch (props.$position) {
      case 'top':
        return css`
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px 6px 0 6px;
          border-color: ${borderColor} transparent transparent transparent;
        `
      case 'bottom':
        return css`
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 6px 6px 6px;
          border-color: transparent transparent ${borderColor} transparent;
        `
      case 'left':
        return css`
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 0 6px 6px;
          border-color: transparent transparent transparent ${borderColor};
        `
      case 'right':
        return css`
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px 6px 6px 0;
          border-color: transparent ${borderColor} transparent transparent;
        `
    }
  }}
`

/**
 * Tooltip component with delayed appearance and directional positioning.
 * Features portal rendering and arrow indicator.
 *
 * @example
 * // Basic tooltip on top
 * <Tooltip content="Click to connect">
 *   <Button>Connect</Button>
 * </Tooltip>
 *
 * @example
 * // Tooltip positioned at bottom with custom delay
 * <Tooltip
 *   content="This action cannot be undone"
 *   position="bottom"
 *   delay={200}
 * >
 *   <Button variant="danger">Delete</Button>
 * </Tooltip>
 *
 * @example
 * // Tooltip on badge
 * <Tooltip content="Active users in the last 5 minutes">
 *   <Badge variant="success">42 Active</Badge>
 * </Tooltip>
 */
export function Tooltip({
  children,
  content,
  delay = 500,
  position = 'top'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        setCoords({
          x: rect.left + rect.width / 2,
          y: position === 'bottom' ? rect.bottom : rect.top
        })
      }
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      <TooltipWrapper
        ref={elementRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </TooltipWrapper>
      {isVisible &&
        createPortal(
          <TooltipContent $isVisible={isVisible} $position={position} $x={coords.x} $y={coords.y}>
            {content}
            <TooltipArrow $position={position} />
          </TooltipContent>,
          document.body
        )}
    </>
  )
}
