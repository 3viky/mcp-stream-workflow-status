/**
 * LuxeInput Component
 *
 * Elegant form input with label and error states.
 * Includes floating label animation.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Full width input */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
}

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  margin-bottom: ${luxeTheme.spacing[4]};
`

const Label = styled.label`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  font-weight: ${luxeTheme.typography.weights.medium};
  color: ${luxeTheme.colors.text};
  margin-bottom: ${luxeTheme.spacing[2]};
  letter-spacing: ${luxeTheme.typography.letterSpacing.wide};
  text-transform: uppercase;
`

const StyledInput = styled.input<{ $hasError: boolean }>`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.base};
  padding: ${luxeTheme.spacing[3]} ${luxeTheme.spacing[4]};
  border: 2px solid
    ${({ $hasError }) =>
      $hasError ? luxeTheme.colors.error : luxeTheme.colors.border};
  border-radius: ${luxeTheme.borderRadius.md};
  background-color: ${luxeTheme.colors.background};
  color: ${luxeTheme.colors.text};
  transition: all ${luxeTheme.transitions.base};
  outline: none;

  &::placeholder {
    color: ${luxeTheme.colors.textTertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) =>
      $hasError ? luxeTheme.colors.error : luxeTheme.colors.borderDark};
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? luxeTheme.colors.error : luxeTheme.colors.focus};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError
          ? `${luxeTheme.colors.error}20`
          : `${luxeTheme.colors.focus}20`};
  }

  &:disabled {
    background-color: ${luxeTheme.colors.backgroundElevated};
    color: ${luxeTheme.colors.textTertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const ErrorMessage = styled.span`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  color: ${luxeTheme.colors.error};
  margin-top: ${luxeTheme.spacing[2]};
`

export function LuxeInput({
  label,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <InputWrapper $fullWidth={fullWidth} className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput $hasError={!!error} id={inputId} {...props} />
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </InputWrapper>
  )
}
