/**
 * LuxeCard Component
 *
 * Content card with optional image overlay.
 * Supports hover effects and interactive states.
 */

import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

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
  background-color: ${luxeTheme.colors.background};
  border: 1px solid ${luxeTheme.colors.border};
  border-radius: ${luxeTheme.borderRadius.lg};
  overflow: hidden;
  transition: all ${luxeTheme.transitions.base};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  ${({ $hoverable }) =>
    $hoverable &&
    `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${luxeTheme.shadows.lg};
      border-color: ${luxeTheme.colors.borderDark};
    }
  `}

  &:active {
    ${({ $clickable }) =>
      $clickable &&
      `
      transform: translateY(-2px);
      box-shadow: ${luxeTheme.shadows.md};
    `}
  }
`

const CardImage = styled.div<{ $overlay: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${luxeTheme.transitions.slow};
  }

  ${({ $overlay }) =>
    $overlay &&
    `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: ${luxeTheme.colors.overlayLight};
      transition: background ${luxeTheme.transitions.base};
    }
  `}

  ${StyledCard}:hover & img {
    transform: scale(1.05);
  }

  ${StyledCard}:hover &::after {
    ${({ $overlay }) =>
      $overlay &&
      `
      background: ${luxeTheme.colors.overlay};
    `}
  }
`

const CardContent = styled.div<{ $padding: CardProps['padding'] }>`
  padding: ${({ $padding }) => {
    switch ($padding) {
      case 'none':
        return '0'
      case 'sm':
        return luxeTheme.spacing[4]
      case 'md':
        return luxeTheme.spacing[6]
      case 'lg':
        return luxeTheme.spacing[8]
      default:
        return luxeTheme.spacing[6]
    }
  }};
`

export function LuxeCard({
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
                e.preventDefault()
                onClick()
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
  )
}
