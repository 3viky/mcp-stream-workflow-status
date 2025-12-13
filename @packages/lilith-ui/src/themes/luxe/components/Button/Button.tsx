/**
 * LuxeButton Component
 *
 * Elegant button with multiple variants and sizes.
 * Includes smooth hover and focus states.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Button content */
  children: React.ReactNode;
}

const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${luxeTheme.typography.fonts.body};
  font-weight: ${luxeTheme.typography.weights.medium};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all ${luxeTheme.transitions.base};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[4]};
          font-size: ${luxeTheme.typography.sizes.sm};
          border-radius: ${luxeTheme.borderRadius.md};
        `
      case 'md':
        return `
          padding: ${luxeTheme.spacing[3]} ${luxeTheme.spacing[6]};
          font-size: ${luxeTheme.typography.sizes.base};
          border-radius: ${luxeTheme.borderRadius.lg};
        `
      case 'lg':
        return `
          padding: ${luxeTheme.spacing[4]} ${luxeTheme.spacing[8]};
          font-size: ${luxeTheme.typography.sizes.md};
          border-radius: ${luxeTheme.borderRadius.xl};
        `
      default:
        return `
          padding: ${luxeTheme.spacing[3]} ${luxeTheme.spacing[6]};
          font-size: ${luxeTheme.typography.sizes.base};
          border-radius: ${luxeTheme.borderRadius.lg};
        `
    }
  }}

  /* Style variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${luxeTheme.colors.primary};
          color: ${luxeTheme.colors.textInverse};
          border-color: ${luxeTheme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${luxeTheme.colors.charcoal};
            transform: translateY(-2px);
            box-shadow: ${luxeTheme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${luxeTheme.shadows.sm};
          }
        `

      case 'secondary':
        return `
          background-color: ${luxeTheme.colors.secondary};
          color: ${luxeTheme.colors.text};
          border-color: ${luxeTheme.colors.secondary};

          &:hover:not(:disabled) {
            background-color: ${luxeTheme.colors.gold};
            transform: translateY(-2px);
            box-shadow: ${luxeTheme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${luxeTheme.shadows.sm};
          }
        `

      case 'outline':
        return `
          background-color: transparent;
          color: ${luxeTheme.colors.primary};
          border-color: ${luxeTheme.colors.border};

          &:hover:not(:disabled) {
            background-color: ${luxeTheme.colors.hover};
            border-color: ${luxeTheme.colors.primary};
          }

          &:active:not(:disabled) {
            background-color: ${luxeTheme.colors.active};
          }
        `

      case 'ghost':
        return `
          background-color: transparent;
          color: ${luxeTheme.colors.primary};
          border-color: transparent;

          &:hover:not(:disabled) {
            background-color: ${luxeTheme.colors.hover};
          }

          &:active:not(:disabled) {
            background-color: ${luxeTheme.colors.active};
          }
        `

      default:
        return ''
    }
  }}

  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: 2px;
  }
`

export function LuxeButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  )
}
