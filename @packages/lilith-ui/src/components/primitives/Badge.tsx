/**
 * Badge Component
 *
 * Small label component for tags, statuses, and categories.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 * Supports outlined and glowing variants for enhanced visual effects.
 */

import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface BadgeProps {
  /** Badge variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional icon element */
  icon?: ReactNode;
  /** Custom color (overrides variant color) */
  color?: string;
  /** Enable neon glow effect (automatic in cyberpunk theme) */
  glowing?: boolean;
  /** Use outlined style instead of filled */
  outlined?: boolean;
  /** Click handler for interactive badges */
  onClick?: () => void;
  /** Tooltip text */
  title?: string;
  /** Custom className */
  className?: string;
  /** Badge content */
  children: React.ReactNode;
}

const StyledBadge = styled.span<{
  $variant: BadgeProps['variant'];
  $size: BadgeProps['size'];
  $outlined: boolean;
  $glowing: boolean;
  $customColor?: string;
  $clickable: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.$size === 'sm' ? props.theme.spacing.xs : props.$size === 'lg' ? props.theme.spacing.sm : props.theme.spacing.xs};
  font-family: ${props => props.theme.typography.fontFamily.mono || props.theme.typography.fontFamily.body};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-transform: uppercase;
  border-radius: ${props => props.theme.borderRadius.sm};
  white-space: nowrap;
  letter-spacing: 0.05em; /* Acceptable: No theme equivalent */
  transition: all ${props => props.theme.transitions.fast};
  backdrop-filter: blur(4px); /* Acceptable: No theme equivalent */
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  user-select: ${props => props.$clickable ? 'none' : 'auto'};

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: calc(${theme.spacing.xs} / 2) ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
          height: 18px; /* Acceptable: Component-specific constraint */
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.xs} calc(${theme.spacing.sm} + ${theme.spacing.xs} / 2);
          font-size: ${theme.typography.fontSize.sm};
          height: 24px; /* Acceptable: Component-specific constraint */
        `;
      case 'md':
      default:
        return css`
          padding: calc(${theme.spacing.xs} * 0.75) ${theme.spacing.sm};
          font-size: calc(${theme.typography.fontSize.xs} * 0.92);
          height: 20px; /* Acceptable: Component-specific constraint */
        `;
    }
  }}

  /* Color variants */
  ${({ $variant, $outlined, $customColor, $glowing, theme }) => {
    // Use custom color if provided, otherwise use variant color
    const getColor = () => {
      if ($customColor) return $customColor;

      switch ($variant) {
        case 'primary':
          return theme.colors.primary;
        case 'secondary':
          return theme.colors.secondary;
        case 'success':
          return theme.colors.success;
        case 'warning':
          return theme.colors.warning;
        case 'error':
          return theme.colors.error;
        case 'info':
          return theme.colors.info || theme.colors.secondary;
        case 'default':
        default:
          return theme.colors.text.secondary;
      }
    };

    const color = getColor();

    if ($outlined) {
      return css`
        background: ${theme.colors.background.primary}99; /* 60% opacity */
        border: 1px solid ${color};
        color: ${color};

        ${$glowing && css`
          box-shadow: 0 0 8px ${color}66;
          text-shadow: 0 0 4px ${color}88;
        `}

        ${theme.extensions?.cyberpunk && $glowing && css`
          box-shadow: 0 0 8px ${color}66, inset 0 1px 0 ${theme.colors.text.primary}33; /* 20% opacity */
        `}
      `;
    } else {
      return css`
        background: linear-gradient(45deg, ${color}dd, ${color}99);
        color: ${theme.colors.text.primary};
        text-shadow: 0 1px 2px ${theme.colors.background.primary}cc; /* 80% opacity */

        ${$glowing && css`
          box-shadow: 0 0 8px ${color}66;
          text-shadow: 0 0 4px ${color}88;
        `}

        ${theme.extensions?.cyberpunk && css`
          box-shadow: ${$glowing ? `0 0 8px ${color}66, inset 0 1px 0 ${theme.colors.text.primary}33` : `inset 0 1px 0 ${theme.colors.text.primary}33`}; /* 20% opacity */
        `}
      `;
    }
  }}

  /* Hover effect for clickable badges */
  ${({ $clickable }) => $clickable && css`
    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(0);
    }
  `}
`;

const IconWrapper = styled.span<{ $size: BadgeProps['size'] }>`
  display: inline-flex;
  align-items: center;
  font-size: ${props => props.$size === 'sm' ? '11px' : props.$size === 'lg' ? '14px' : '12px'};
`;

/**
 * Badge component with support for luxe and cyberpunk variants.
 * Automatically adapts to active theme via semantic tokens.
 *
 * @example
 * // Basic success badge
 * <Badge variant="success">Online</Badge>
 *
 * @example
 * // Outlined badge with glow
 * <Badge variant="primary" outlined glowing>Featured</Badge>
 *
 * @example
 * // Badge with icon
 * <Badge variant="warning" icon={<AlertIcon />}>Alert</Badge>
 */
export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  color,
  glowing = false,
  outlined = false,
  onClick,
  title,
  className,
  children,
}: BadgeProps) {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      $outlined={outlined}
      $glowing={glowing}
      $customColor={color}
      $clickable={!!onClick}
      onClick={onClick}
      title={title}
      className={className}
    >
      {icon && <IconWrapper $size={size}>{icon}</IconWrapper>}
      {children}
    </StyledBadge>
  );
}
