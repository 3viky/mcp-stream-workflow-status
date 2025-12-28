/**
 * Input Component
 *
 * Theme-agnostic form input with label and error states.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 * Supports variant-specific focus colors for enhanced visual feedback.
 */

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Visual style variant with different focus colors */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Full width input */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
}

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledInput = styled.input<{
  $hasError: boolean;
  $variant: InputProps['variant'];
}>`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.base};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md};
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  transition: all ${props => props.theme.transitions.normal};
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }

  /* Hover state with variant-specific colors */
  &:hover:not(:disabled) {
    ${({ $hasError, $variant, theme }) => {
      if ($hasError) {
        return css`border-color: ${theme.colors.error};`;
      }

      switch ($variant) {
        case 'secondary':
          return css`border-color: ${theme.colors.secondary};`;
        case 'danger':
          return css`border-color: ${theme.colors.error};`;
        case 'primary':
        default:
          return css`border-color: ${theme.colors.primary};`;
      }
    }}
  }

  /* Focus state with variant-specific glow */
  &:focus {
    ${({ $hasError, $variant, theme }) => {
      if ($hasError) {
        return css`
          border-color: ${theme.colors.error};
          box-shadow: 0 0 0 3px ${theme.colors.error}20;
        `;
      }

      let focusColor = theme.colors.primary;
      let glowEffect = theme.extensions?.cyberpunk?.neonGlow?.magenta;

      switch ($variant) {
        case 'secondary':
          focusColor = theme.colors.secondary;
          glowEffect = theme.extensions?.cyberpunk?.neonGlow?.cyan;
          break;
        case 'danger':
          focusColor = theme.colors.error;
          glowEffect = `0 0 10px ${theme.colors.error}66`;
          break;
        case 'primary':
        default:
          focusColor = theme.colors.primary;
          glowEffect = theme.extensions?.cyberpunk?.neonGlow?.magenta;
          break;
      }

      return css`
        border-color: ${focusColor};
        box-shadow: 0 0 0 3px ${focusColor}20;

        ${theme.extensions?.cyberpunk && css`
          box-shadow: ${glowEffect};
        `}
      `;
    }}
  }

  &:disabled {
    background-color: ${props => props.theme.colors.disabled.background};
    color: ${props => props.theme.colors.disabled.text};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.span`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.sm};
`;

/**
 * Input field with support for luxe and cyberpunk variants.
 * Features variant-specific focus colors and optional label/error display.
 *
 * @example
 * // Basic input with label
 * <Input label="Username" placeholder="Enter username" />
 *
 * @example
 * // Secondary variant input
 * <Input variant="secondary" placeholder="Cyan glow on focus" />
 *
 * @example
 * // Input with error
 * <Input label="Email" error="Invalid email address" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  variant = 'primary',
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <InputWrapper $fullWidth={fullWidth} className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput
        ref={ref}
        $hasError={!!error}
        $variant={variant}
        id={inputId}
        {...props}
      />
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </InputWrapper>
  );
});

Input.displayName = 'Input';
