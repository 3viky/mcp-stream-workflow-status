/**
 * Checkbox Component
 *
 * Boolean form input with neon glow effects and label support.
 * Features dynamic glow colors based on variant and checked state.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 */

import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text or element to display next to checkbox */
  label?: ReactNode;
  /** Visual style variant with different glow colors */
  variant?: 'primary' | 'secondary' | 'success';
}

const CheckboxContainer = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  user-select: none;
`;

const StyledCheckbox = styled.input<{
  $variant: CheckboxProps['variant'];
  $hasLabel: boolean;
}>`
  width: 18px;
  height: 18px;
  margin-right: ${props => props.$hasLabel ? props.theme.spacing.sm : '0'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  outline: none;
  accent-color: ${props => {
    switch (props.$variant) {
      case 'secondary':
        return props.theme.colors.secondary;
      case 'success':
        return props.theme.colors.success;
      case 'primary':
      default:
        return props.theme.colors.primary;
    }
  }};

  /* Custom focus ring */
  &:focus-visible {
    outline: 2px solid ${props => {
      switch (props.$variant) {
        case 'secondary':
          return props.theme.colors.secondary;
        case 'success':
          return props.theme.colors.success;
        case 'primary':
        default:
          return props.theme.colors.primary;
      }
    }};
    outline-offset: 2px;
  }

  /* Cyberpunk glow effect on checked state */
  ${({ $variant, theme, checked }) => checked && theme.extensions?.cyberpunk && css`
    ${() => {
      let glowColor = theme.colors.primary;
      switch ($variant) {
        case 'secondary':
          glowColor = theme.colors.secondary;
          break;
        case 'success':
          glowColor = theme.colors.success;
          break;
      }
      return css`
        box-shadow: 0 0 8px ${glowColor}88;
      `;
    }}
  `}
`;

const LabelText = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.body};
  user-select: none;
`;

const StandaloneCheckbox = styled(StyledCheckbox)`
  margin-right: 0;
`;

/**
 * Checkbox for boolean form inputs with theme-adaptive styling.
 * Supports label display and variant-specific accent colors.
 *
 * @example
 * // Basic checkbox with label
 * <Checkbox label="Accept terms and conditions" />
 *
 * @example
 * // Controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 *   label="Enable notifications"
 * />
 *
 * @example
 * // Secondary variant checkbox
 * <Checkbox variant="secondary" label="Remember me" />
 *
 * @example
 * // Success variant checkbox
 * <Checkbox variant="success" label="I agree" />
 *
 * @example
 * // Checkbox without label
 * <Checkbox id="standalone" />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, variant = 'primary', className, style, ...props }, ref) => {
    if (label) {
      return (
        <CheckboxContainer $disabled={!!props.disabled} className={className} style={style}>
          <StyledCheckbox
            ref={ref}
            type="checkbox"
            $variant={variant}
            $hasLabel={true}
            {...props}
          />
          <LabelText>{label}</LabelText>
        </CheckboxContainer>
      );
    }

    return (
      <StandaloneCheckbox
        ref={ref}
        type="checkbox"
        $variant={variant}
        $hasLabel={false}
        className={className}
        style={style}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
