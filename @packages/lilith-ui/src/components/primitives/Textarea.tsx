/**
 * Textarea Component
 *
 * Multi-line text input with label and error states.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 */

import styled, { css } from 'styled-components';

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

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
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
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }

  &:hover:not(:disabled) {
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
  }

  &:focus {
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError
          ? `${props.theme.colors.error}20`
          : `${props.theme.colors.primary}20`};

    ${props => props.theme.extensions?.cyberpunk && !props.$hasError && css`
      box-shadow: ${props.theme.extensions.cyberpunk.neonGlow.magenta};
    `}
  }

  &:disabled {
    background-color: ${props => props.theme.colors.disabled.background};
    color: ${props => props.theme.colors.disabled.text};
    cursor: not-allowed;
    opacity: 0.6;
    resize: none;
  }
`;

const ErrorMessage = styled.span`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.sm};
`;

export function Textarea({
  label,
  error,
  fullWidth = false,
  rows = 5,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

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
  );
}
