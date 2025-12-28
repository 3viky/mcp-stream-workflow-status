/**
 * FormField Component
 *
 * Theme-agnostic form field wrapper with label, error display, and helper text.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 *
 * IMPORTANT: This component preserves ALL business logic from cyberpunk-ui/ui-form.
 * Only styling has been converted to styled-components with semantic tokens.
 */

import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

/**
 * FormField component props
 */
export interface FormFieldProps {
  /** Field label text */
  label: string
  /** Form input element (Input, Textarea, Select, Checkbox, etc.) */
  children: ReactNode
  /** Error message to display below the field */
  error?: string
  /** Whether the field is required (shows asterisk) */
  required?: boolean
  /** Helper text to display below the field */
  description?: string
}

// Styled Components

const FormFieldContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Label = styled.label<{ $required?: boolean }>`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};

  /* Cyberpunk green label color */
  ${props => props.theme.extensions?.cyberpunk && css`
    color: ${props.theme.colors.accent};
    font-weight: ${props.theme.typography.fontWeight.bold};
  `}
`

const RequiredAsterisk = styled.span`
  color: ${props => props.theme.colors.error};

  /* Cyberpunk danger glow */
  ${props => props.theme.extensions?.cyberpunk && css`
    text-shadow: 0 0 5px ${props.theme.colors.error};
  `}
`

const HelpText = styled.div`
  margin-top: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.4;
`

const ErrorText = styled.div`
  margin-top: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.error};

  /* Cyberpunk danger glow */
  ${props => props.theme.extensions?.cyberpunk && css`
    text-shadow: 0 0 5px ${props.theme.colors.error};
  `}
`

/**
 * Form field wrapper component with label, error display, and helper text.
 * Provides consistent styling for form inputs with theme-aware labels.
 * Supports all form components: Input, Textarea, Select, Checkbox, and more.
 *
 * @param props - FormField component props
 * @param props.label - Field label text
 * @param props.children - Form input element (Input, Textarea, Select, Checkbox, etc.)
 * @param props.error - Error message to display below the field
 * @param props.required - Whether the field is required (shows asterisk)
 * @param props.description - Helper text to display below the field
 * @returns A form field with label and optional error/description
 *
 * @example
 * // Basic text input
 * <FormField label="Username">
 *   <Input placeholder="Enter username" />
 * </FormField>
 *
 * @example
 * // Multi-line textarea
 * <FormField label="Bio" description="Tell us about yourself">
 *   <Textarea placeholder="Your bio..." minRows={4} fullWidth />
 * </FormField>
 *
 * @example
 * // Dropdown select
 * <FormField label="Country" required>
 *   <Select
 *     fullWidth
 *     options={[
 *       { value: 'us', label: 'United States' },
 *       { value: 'ca', label: 'Canada' },
 *       { value: 'uk', label: 'United Kingdom' }
 *     ]}
 *   />
 * </FormField>
 *
 * @example
 * // Checkbox with label
 * <FormField label="Preferences">
 *   <Checkbox label="Subscribe to newsletter" />
 * </FormField>
 *
 * @example
 * // Required field with description
 * <FormField
 *   label="Email Address"
 *   required
 *   description="We'll never share your email"
 * >
 *   <Input type="email" fullWidth />
 * </FormField>
 *
 * @example
 * // Field with error state
 * <FormField
 *   label="Password"
 *   error="Password must be at least 8 characters"
 *   required
 * >
 *   <Input type="password" variant="danger" />
 * </FormField>
 */
export function FormField({
  label,
  children,
  error,
  required,
  description
}: FormFieldProps) {
  return (
    <FormFieldContainer>
      <Label $required={required}>
        {label}
        {/* PRESERVED: Required asterisk logic */}
        {required && <RequiredAsterisk> *</RequiredAsterisk>}
      </Label>
      {/* PRESERVED: Children rendering */}
      {children}
      {/* PRESERVED: Error takes precedence over description */}
      {error && <ErrorText>{error}</ErrorText>}
      {description && !error && <HelpText>{description}</HelpText>}
    </FormFieldContainer>
  )
}
