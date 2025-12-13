/**
 * LuxeBadge Component
 *
 * Small label component for tags, statuses, and categories.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface BadgeProps {
  /** Badge variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Badge content */
  children: React.ReactNode;
}

const StyledBadge = styled.span<{
  $variant: BadgeProps['variant'];
  $size: BadgeProps['size'];
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${luxeTheme.typography.fonts.body};
  font-weight: ${luxeTheme.typography.weights.medium};
  letter-spacing: ${luxeTheme.typography.letterSpacing.wide};
  text-transform: uppercase;
  border-radius: ${luxeTheme.borderRadius.full};
  white-space: nowrap;

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${luxeTheme.spacing[1]} ${luxeTheme.spacing[2]};
          font-size: ${luxeTheme.typography.sizes.xs};
        `
      case 'md':
        return `
          padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[3]};
          font-size: ${luxeTheme.typography.sizes.sm};
        `
      case 'lg':
        return `
          padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[4]};
          font-size: ${luxeTheme.typography.sizes.base};
        `
      default:
        return `
          padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[3]};
          font-size: ${luxeTheme.typography.sizes.sm};
        `
    }
  }}

  /* Color variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${luxeTheme.colors.primary};
          color: ${luxeTheme.colors.textInverse};
        `
      case 'secondary':
        return `
          background-color: ${luxeTheme.colors.secondary};
          color: ${luxeTheme.colors.text};
        `
      case 'success':
        return `
          background-color: ${luxeTheme.colors.success};
          color: ${luxeTheme.colors.white};
        `
      case 'warning':
        return `
          background-color: ${luxeTheme.colors.warning};
          color: ${luxeTheme.colors.white};
        `
      case 'error':
        return `
          background-color: ${luxeTheme.colors.error};
          color: ${luxeTheme.colors.white};
        `
      case 'default':
      default:
        return `
          background-color: ${luxeTheme.colors.backgroundElevated};
          color: ${luxeTheme.colors.text};
          border: 1px solid ${luxeTheme.colors.border};
        `
    }
  }}
`

export function LuxeBadge({
  variant = 'default',
  size = 'md',
  className,
  children,
}: BadgeProps) {
  return (
    <StyledBadge $variant={variant} $size={size} className={className}>
      {children}
    </StyledBadge>
  )
}
