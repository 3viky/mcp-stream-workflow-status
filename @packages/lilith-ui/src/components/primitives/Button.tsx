/**
 * Button Component
 *
 * Theme-agnostic button with multiple variants and sizes.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 * Supports all luxe and cyberpunk variants.
 */

import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant - supports both luxe and cyberpunk variants */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'success' | 'warning' | 'position' | 'icon';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional icon element to display */
  icon?: ReactNode;
  /** Position of the icon relative to text */
  iconPosition?: 'left' | 'right';
  /** Whether the button is in active state */
  active?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
}

const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $fullWidth: boolean;
  $active: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all ${props => props.theme.transitions.normal};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          border-radius: ${theme.borderRadius.md};
          min-height: 32px;
        `;
      case 'md':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          border-radius: ${theme.borderRadius.lg};
          min-height: 40px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.lg} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          border-radius: ${theme.borderRadius.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          border-radius: ${theme.borderRadius.lg};
          min-height: 40px;
        `;
    }
  }}

  /* Style variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.background};
          border-color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.hover.primary};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};

            ${theme.extensions?.cyberpunk && css`
              box-shadow: ${theme.extensions.cyberpunk.neonGlow.magenta};
            `}
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.active.primary};
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.secondary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.hover.secondary};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};

            ${theme.extensions?.cyberpunk && css`
              box-shadow: ${theme.extensions.cyberpunk.neonGlow.cyan};
            `}
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.active.secondary};
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'accent':
        return css`
          background-color: ${theme.colors.accent};
          color: ${theme.colors.background};
          border-color: ${theme.colors.accent};

          &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};

            ${theme.extensions?.cyberpunk && css`
              box-shadow: ${theme.extensions.cyberpunk.neonGlow.green};
            `}
          }

          &:active:not(:disabled) {
            opacity: 0.8;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: transparent;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.hover.primary};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.active.primary};
          }
        `;

      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.error};

          ${theme.extensions?.cyberpunk && css`
            box-shadow: 0 0 10px ${theme.colors.error}66;
          `}

          &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};

            ${theme.extensions?.cyberpunk && css`
              box-shadow: 0 0 15px ${theme.colors.error};
            `}
          }

          &:active:not(:disabled) {
            opacity: 0.8;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.background.primary};
          border-color: ${theme.colors.success};

          ${theme.extensions?.cyberpunk && css`
            box-shadow: 0 0 10px ${theme.colors.success}66;
          `}

          &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};

            ${theme.extensions?.cyberpunk && css`
              box-shadow: 0 0 15px ${theme.colors.success};
            `}
          }

          &:active:not(:disabled) {
            opacity: 0.8;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'warning':
        return css`
          background-color: ${theme.colors.warning};
          color: ${theme.colors.background.primary};
          border-color: ${theme.colors.warning};

          ${theme.extensions?.cyberpunk && css`
            box-shadow: 0 0 10px ${theme.colors.warning}66;
          `}

          &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};

            ${theme.extensions?.cyberpunk && css`
              box-shadow: 0 0 15px ${theme.colors.warning};
            `}
          }

          &:active:not(:disabled) {
            opacity: 0.8;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'position':
        return css`
          background-color: ${theme.colors.text.primary}0d; /* 5% opacity */
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.text.primary}33; /* 20% opacity */

          &:hover:not(:disabled) {
            background-color: ${theme.colors.text.primary}1a; /* 10% opacity */
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.text.primary}26; /* 15% opacity */
          }
        `;

      case 'icon':
        return css`
          background-color: transparent;
          color: ${theme.colors.text.primary};
          border-color: transparent;
          padding: ${theme.spacing.sm};
          min-width: auto;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.text.primary}1a; /* 10% opacity */
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.text.primary}26; /* 15% opacity */
          }
        `;

      default:
        return '';
    }
  }}

  /* Active state enhancement */
  ${({ $active, $variant, theme }) => $active && $variant && css`
    ${$variant === 'primary' && css`
      box-shadow: 0 0 15px ${theme.colors.primary};
    `}
    ${$variant === 'secondary' && css`
      box-shadow: 0 0 10px ${theme.colors.secondary};
    `}
    ${$variant === 'danger' && css`
      box-shadow: 0 0 15px ${theme.colors.error};
    `}
    ${$variant === 'success' && css`
      box-shadow: 0 0 15px ${theme.colors.success};
    `}
    ${$variant === 'warning' && css`
      box-shadow: 0 0 15px ${theme.colors.warning};
    `}
  `}

  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: ${props => props.theme.colors.disabled.background};
    color: ${props => props.theme.colors.disabled.text};
    border-color: ${props => props.theme.colors.disabled.background};
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;

/**
 * Button component with support for luxe and cyberpunk variants.
 * Automatically adapts to active theme via semantic tokens.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click Me</Button>
 *
 * @example
 * // Danger button with icon
 * <Button variant="danger" icon={<AlertIcon />}>Delete</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  active = false,
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $active={active}
      disabled={disabled}
      className={className}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <IconWrapper>{icon}</IconWrapper>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <IconWrapper>{icon}</IconWrapper>
      )}
    </StyledButton>
  );
});

Button.displayName = 'Button';
