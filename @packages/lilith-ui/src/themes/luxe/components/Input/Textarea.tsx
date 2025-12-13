/**
 * LuxeTextarea Component
 *
 * Multi-line text input with label and error states.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea label */
  label?: string;
  /** Error message */
  error?: string;
  /** Full width textarea */
  fullWidth?: boolean;
  /** Number of visible rows */
  rows?: number;
  /** Custom className */
  className?: string;
}

const TextareaWrapper = styled.div<{ $fullWidth: boolean }>`
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

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
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
  resize: vertical;
  min-height: 120px;

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
    resize: none;
  }
`

const ErrorMessage = styled.span`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  color: ${luxeTheme.colors.error};
  margin-top: ${luxeTheme.spacing[2]};
`

export function LuxeTextarea({
  label,
  error,
  fullWidth = false,
  rows = 5,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <TextareaWrapper $fullWidth={fullWidth} className={className}>
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <StyledTextarea
        $hasError={!!error}
        id={textareaId}
        rows={rows}
        {...props}
      />
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </TextareaWrapper>
  )
}
