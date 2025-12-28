/**
 * Select Component
 *
 * Theme-agnostic select dropdown with focus effects.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 *
 * IMPORTANT: This component preserves ALL business logic from cyberpunk-ui/ui-core.
 * Only styling has been converted to styled-components with semantic tokens.
 */

import { forwardRef } from 'react'
import type { SelectHTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

/**
 * Option type for Select component
 */
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

/**
 * Select component props
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Visual style variant with different focus colors */
  variant?: 'primary' | 'secondary' | 'danger'
  /** Whether the select should take full width of container */
  fullWidth?: boolean
  /** Array of options to render */
  options?: SelectOption[]
  /** Children option elements (alternative to options prop) */
  children?: ReactNode
  /** Placeholder text (shows as first disabled option) */
  placeholder?: string
}

// Styled Components

const StyledSelect = styled.select<{
  $variant: SelectProps['variant']
  $fullWidth: boolean
}>`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.base};
  outline: none;
  transition: all ${props => props.theme.transitions.normal};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};

  /* Cyberpunk darker background */
  ${props => props.theme.extensions?.cyberpunk && css`
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.primary};
  `}

  /* Focus states per variant */
  &:focus {
    ${({ $variant, theme }) => {
      switch ($variant) {
        case 'primary':
          return css`
            border-color: ${theme.colors.primary};
            box-shadow: 0 0 0 3px ${theme.colors.primary}20;

            ${theme.extensions?.cyberpunk && css`
              box-shadow: 0 0 10px ${theme.colors.primary};
            `}
          `
        case 'secondary':
          return css`
            border-color: ${theme.colors.secondary};
            box-shadow: 0 0 0 3px ${theme.colors.secondary}20;

            ${theme.extensions?.cyberpunk && css`
              box-shadow: 0 0 10px ${theme.colors.secondary};
            `}
          `
        case 'danger':
          return css`
            border-color: ${theme.colors.error};
            box-shadow: 0 0 0 3px ${theme.colors.error}20;

            ${theme.extensions?.cyberpunk && css`
              box-shadow: 0 0 10px ${theme.colors.error};
            `}
          `
        default:
          return css`
            border-color: ${theme.colors.primary};
            box-shadow: 0 0 0 3px ${theme.colors.primary}20;
          `
      }
    }}
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.disabled.background};
    color: ${props => props.theme.colors.disabled.text};
  }

  /* Hover state */
  &:hover:not(:disabled) {
    border-color: ${props => {
      switch (props.$variant) {
        case 'secondary': return props.theme.colors.secondary
        case 'danger': return props.theme.colors.error
        default: return props.theme.colors.primary
      }
    }};
  }
`

/**
 * Cyberpunk-themed select dropdown for form inputs with focus effects.
 * Features dynamic border colors and box shadows based on variant.
 * Supports both options array and children <option> elements.
 *
 * @param props - Select component props
 * @param props.variant - Visual style variant: 'primary' (cyan), 'secondary' (magenta), 'danger' (red) (default: 'primary')
 * @param props.fullWidth - Full width mode (default: false)
 * @param props.options - Array of options to render
 * @param props.children - Children option elements (alternative to options prop)
 * @param props.placeholder - Placeholder text (shows as first disabled option)
 * @param ref - Forwarded ref to the select element
 * @returns A styled select element with theme-aware aesthetics
 *
 * @example
 * // Basic select with options array
 * <Select
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *     { value: '3', label: 'Option 3' }
 *   ]}
 * />
 *
 * @example
 * // Select with placeholder
 * <Select
 *   placeholder="Choose an option"
 *   options={[
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' }
 *   ]}
 * />
 *
 * @example
 * // Select with children elements
 * <Select variant="secondary">
 *   <option value="">Select a value</option>
 *   <option value="1">First</option>
 *   <option value="2">Second</option>
 * </Select>
 *
 * @example
 * // Full width select with onChange handler
 * function SizeSelector() {
 *   const [selectedValue, setSelectedValue] = useState('medium');
 *   return (
 *     <Select
 *       fullWidth
 *       value={selectedValue}
 *       onChange={(e) => setSelectedValue(e.target.value)}
 *       options={[
 *         { value: 'small', label: 'Small' },
 *         { value: 'medium', label: 'Medium' },
 *         { value: 'large', label: 'Large' }
 *       ]}
 *     />
 *   );
 * }
 *
 * @example
 * // Select with ref for form handling
 * function FormSelect() {
 *   const selectRef = useRef<HTMLSelectElement>(null);
 *   const myOptions = [
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' }
 *   ];
 *   return <Select ref={selectRef} options={myOptions} />;
 * }
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    variant = 'primary',
    fullWidth = false,
    options,
    children,
    placeholder,
    ...props
  }, ref) => {
    return (
      <StyledSelect
        ref={ref}
        $variant={variant}
        $fullWidth={fullWidth}
        {...props}
      >
        {/* PRESERVED: Placeholder rendering logic */}
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {/* PRESERVED: Options vs children rendering logic */}
        {options
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          : children}
      </StyledSelect>
    )
  }
)

Select.displayName = 'Select'
