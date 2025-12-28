/**
 * Avatar Component
 *
 * User avatar component with neon glow effects and optional status indicator.
 * Features image display, initials fallback, size variants, and status badge.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 */

import styled, { css } from 'styled-components';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback initials (1-2 characters) */
  initials?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Status indicator badge */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const AvatarCircle = styled.div<{ $size: AvatarProps['size'] }>`
  ${({ $size, theme }) => {
    const sizes = {
      sm: '32px',
      md: '40px',
      lg: '56px',
      xl: '72px'
    };

    const fontSizes = {
      sm: theme.typography.fontSize.xs,
      md: theme.typography.fontSize.sm,
      lg: theme.typography.fontSize.base,
      xl: theme.typography.fontSize.lg
    };

    return css`
      width: ${sizes[$size || 'md']};
      height: ${sizes[$size || 'md']};
      font-size: ${fontSizes[$size || 'md']};
    `;
  }}

  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.secondary || props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.secondary || props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  overflow: hidden;
  user-select: none;

  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: 0 0 10px ${props.theme.colors.secondary || props.theme.colors.primary}50;
  `}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusBadge = styled.div<{
  $status: AvatarProps['status'];
  $size: AvatarProps['size'];
}>`
  position: absolute;
  bottom: 0;
  right: 0;
  ${({ $size }) => {
    const badgeSizes = {
      sm: '8px',
      md: '10px',
      lg: '12px',
      xl: '14px'
    };
    return css`
      width: ${badgeSizes[$size || 'md']};
      height: ${badgeSizes[$size || 'md']};
    `;
  }}
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.background};

  ${({ $status, theme }) => {
    let color = theme.colors.text.secondary;

    switch ($status) {
      case 'online':
        color = theme.colors.success;
        break;
      case 'away':
        color = theme.colors.warning;
        break;
      case 'busy':
        color = theme.colors.error;
        break;
      case 'offline':
      default:
        color = theme.colors.text.secondary;
        break;
    }

    return css`
      background-color: ${color};

      ${theme.extensions?.cyberpunk && $status === 'online' && css`
        box-shadow: 0 0 5px ${color};
      `}
    `;
  }}
`;

/**
 * Avatar component for user profiles with theme-adaptive styling.
 * Supports image display, initials fallback, and status indicators.
 *
 * @example
 * // Avatar with image
 * <Avatar src="/user.jpg" alt="User Name" />
 *
 * @example
 * // Avatar with initials fallback
 * <Avatar initials="JD" alt="John Doe" />
 *
 * @example
 * // Large avatar with online status
 * <Avatar src="/avatar.jpg" alt="User" size="lg" status="online" />
 *
 * @example
 * // Small avatar with initials and away status
 * <Avatar initials="AB" size="sm" status="away" />
 */
export function Avatar({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  status,
  className,
  style
}: AvatarProps) {
  return (
    <Container className={className} style={style} title={alt}>
      <AvatarCircle $size={size}>
        {src ? (
          <AvatarImage
            src={src}
            alt={alt}
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          initials && <span>{initials.substring(0, 2).toUpperCase()}</span>
        )}
      </AvatarCircle>
      {status && <StatusBadge $status={status} $size={size} aria-label={`Status: ${status}`} />}
    </Container>
  );
}
