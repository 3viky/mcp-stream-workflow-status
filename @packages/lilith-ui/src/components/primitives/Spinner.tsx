/**
 * Spinner Component
 *
 * Loading spinner with neon glow and rotation animation.
 * Features dynamic colors based on variant and multiple size options.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 */

import styled, { keyframes, css } from 'styled-components';

export interface SpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant with different neon colors */
  variant?: 'primary' | 'secondary' | 'success';
  /** Optional text label to display below spinner */
  label?: string;
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StyledSpinner = styled.div<{
  $size: SpinnerProps['size'];
  $variant: SpinnerProps['variant'];
}>`
  ${({ $size }) => {
    const sizes = {
      sm: '16px',
      md: '32px',
      lg: '48px'
    };
    return css`
      width: ${sizes[$size || 'md']};
      height: ${sizes[$size || 'md']};
    `;
  }}

  ${({ $variant, theme }) => {
    let color = theme.colors.primary;

    switch ($variant) {
      case 'secondary':
        color = theme.colors.secondary;
        break;
      case 'success':
        color = theme.colors.success;
        break;
      case 'primary':
      default:
        color = theme.colors.primary;
        break;
    }

    return css`
      border: 3px solid ${color}30;
      border-top: 3px solid ${color};
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;

      ${theme.extensions?.cyberpunk && css`
        box-shadow: 0 0 10px ${color}66;
      `}
    `;
  }}
`;

const Label = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.body};
  margin-top: ${props => props.theme.spacing.xs};
`;

/**
 * Loading spinner with support for luxe and cyberpunk variants.
 * Features variant-specific colors and optional label.
 *
 * @example
 * // Basic spinner
 * <Spinner />
 *
 * @example
 * // Large spinner with label
 * <Spinner size="lg" label="Loading..." />
 *
 * @example
 * // Success spinner (green)
 * <Spinner variant="success" label="Processing..." />
 *
 * @example
 * // Secondary spinner (cyan/magenta)
 * <Spinner variant="secondary" size="sm" />
 */
export function Spinner({
  size = 'md',
  variant = 'primary',
  label,
  className,
  style
}: SpinnerProps) {
  return (
    <Container className={className} style={style} role="status" aria-label={label || 'Loading'}>
      <StyledSpinner $size={size} $variant={variant} />
      {label && <Label>{label}</Label>}
    </Container>
  );
}
