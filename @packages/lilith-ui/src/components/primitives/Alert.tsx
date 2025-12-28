/**
 * Alert Component
 *
 * Notification component for displaying important messages.
 * Features neon-colored borders and glowing effects based on severity.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 */

import type { ReactNode, CSSProperties } from 'react';
import styled, { css } from 'styled-components';

export interface AlertProps {
  /** Visual style variant for different message types */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Alert content */
  children: ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: CSSProperties;
}

const StyledAlert = styled.div<{ $variant: AlertProps['variant'] }>`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid;
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: 1.5;

  /* Variant-specific colors */
  ${({ $variant, theme }) => {
    let color = theme.colors.primary;
    const bgAlpha = '15';

    switch ($variant) {
      case 'success':
        color = theme.colors.success;
        break;
      case 'warning':
        color = theme.colors.warning;
        break;
      case 'error':
        color = theme.colors.error;
        break;
      case 'info':
      default:
        color = theme.colors.secondary || theme.colors.primary;
        break;
    }

    return css`
      border-color: ${color};
      background: ${color}${bgAlpha};
      color: ${color};

      ${theme.extensions?.cyberpunk && css`
        box-shadow: 0 0 10px ${color}33;
      `}
    `;
  }}
`;

/**
 * Alert component for displaying important messages with semantic colors.
 * Adapts to active theme with cyberpunk neon glows.
 *
 * @example
 * // Info alert
 * <Alert variant="info">System initialized successfully</Alert>
 *
 * @example
 * // Success alert
 * <Alert variant="success">Connection established!</Alert>
 *
 * @example
 * // Warning alert
 * <Alert variant="warning">High memory usage detected</Alert>
 *
 * @example
 * // Error alert
 * <Alert variant="error">Authentication failed</Alert>
 */
export function Alert({
  variant = 'info',
  children,
  className,
  style
}: AlertProps) {
  return (
    <StyledAlert
      $variant={variant}
      className={className}
      style={style}
      role="alert"
    >
      {children}
    </StyledAlert>
  );
}
