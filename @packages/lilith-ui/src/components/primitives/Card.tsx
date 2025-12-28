/**
 * Card Component
 *
 * Content card with optional image overlay.
 * Supports hover effects and interactive states.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 */

import styled, { css } from 'styled-components';

export interface CardProps {
  /** Card image source */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Show overlay on image */
  overlay?: boolean;
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Enable hover effects */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
  /** Card content */
  children: React.ReactNode;
}

const StyledCard = styled.div<{
  $padding: CardProps['padding'];
  $hoverable: boolean;
  $clickable: boolean;
}>`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  ${({ $hoverable, theme }) =>
    $hoverable &&
    css`
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.lg};
        border-color: ${theme.colors.primary};

        ${theme.extensions?.cyberpunk && css`
          box-shadow: ${theme.extensions.cyberpunk.neonGlow.large};
        `}
      }
    `}

  &:active {
    ${({ $clickable, theme }) =>
      $clickable &&
      css`
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
      `}
  }
`;

const CardImage = styled.div<{ $overlay: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${props => props.theme.transitions.slow};
  }

  ${({ $overlay, theme }) =>
    $overlay &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: ${theme.colors.background.primary}33; /* 20% opacity */
        transition: background ${theme.transitions.normal};
      }
    `}

  ${StyledCard}:hover & img {
    transform: scale(1.05);
  }

  ${StyledCard}:hover &::after {
    ${({ $overlay, theme }) =>
      $overlay &&
      css`
        background: ${theme.colors.background.primary}66; /* 40% opacity */
      `}
  }
`;

const CardContent = styled.div<{ $padding: CardProps['padding'] }>`
  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'none':
        return '0';
      case 'sm':
        return theme.spacing.md;
      case 'md':
        return theme.spacing.lg;
      case 'lg':
        return theme.spacing.xl;
      default:
        return theme.spacing.lg;
    }
  }};
`;

export function Card({
  imageSrc,
  imageAlt = '',
  overlay = false,
  padding = 'md',
  hoverable = true,
  onClick,
  className,
  children,
}: CardProps) {
  return (
    <StyledCard
      $padding={padding}
      $hoverable={hoverable}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {imageSrc && (
        <CardImage $overlay={overlay}>
          <img src={imageSrc} alt={imageAlt} loading="lazy" />
        </CardImage>
      )}
      <CardContent $padding={padding}>{children}</CardContent>
    </StyledCard>
  );
}
