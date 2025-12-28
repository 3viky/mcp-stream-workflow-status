/**
 * AnnouncementBar Component
 *
 * Dismissible announcement bar for important updates, schedules, or notifications.
 * Supports localStorage persistence and frequency capping.
 */

import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface AnnouncementBarProps {
  /** Announcement message */
  message: string;
  /** Call-to-action text */
  ctaText?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** CTA link (alternative to onClick) */
  ctaHref?: string;
  /** Background color variant */
  variant?: 'default' | 'primary' | 'secondary' | 'info' | 'warning';
  /** Storage key for dismissal persistence */
  storageKey?: string;
  /** Dismissal duration in days (0 = session only) */
  dismissDuration?: number;
  /** Always show (ignore dismissal) */
  alwaysShow?: boolean;
  /** Custom className */
  className?: string;
}

const BarContainer = styled.div<{ $variant: AnnouncementBarProps['variant'] }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${luxeTheme.zIndices.sticky};
  background-color: ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return luxeTheme.colors.primary
      case 'secondary':
        return luxeTheme.colors.secondary
      case 'info':
        return luxeTheme.colors.info
      case 'warning':
        return luxeTheme.colors.warning
      case 'default':
      default:
        return luxeTheme.colors.charcoal
    }
  }};
  color: ${({ $variant }) =>
    $variant === 'secondary' ? luxeTheme.colors.text : luxeTheme.colors.white};
  box-shadow: ${luxeTheme.shadows.sm};
  animation: slideDown ${luxeTheme.transitions.slow};

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const BarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${luxeTheme.spacing[4]};
  padding: ${luxeTheme.spacing[3]} ${luxeTheme.spacing[6]};
  max-width: ${luxeTheme.containers['2xl']};
  margin: 0 auto;

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    flex-direction: column;
    gap: ${luxeTheme.spacing[2]};
    padding: ${luxeTheme.spacing[3]} ${luxeTheme.spacing[4]};
    text-align: center;
  }
`

const Message = styled.p`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  font-weight: ${luxeTheme.typography.weights.medium};
  margin: 0;
  flex: 1;
  line-height: ${luxeTheme.typography.lineHeights.base};
`

const CTAButton = styled.a<{ $hasHref: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${luxeTheme.spacing[2]};
  padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[4]};
  background-color: ${luxeTheme.colors.white};
  color: ${luxeTheme.colors.primary};
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  font-weight: ${luxeTheme.typography.weights.semibold};
  text-decoration: none;
  border-radius: ${luxeTheme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all ${luxeTheme.transitions.base};
  white-space: nowrap;

  &:hover {
    background-color: ${luxeTheme.colors.backgroundElevated};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.white};
    outline-offset: 2px;
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  color: currentColor;
  cursor: pointer;
  border-radius: ${luxeTheme.borderRadius.base};
  transition: all ${luxeTheme.transitions.fast};
  margin-left: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.white};
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

export function AnnouncementBar({
  message,
  ctaText,
  onCtaClick,
  ctaHref,
  variant = 'default',
  storageKey = 'luxe-announcement-dismissed',
  dismissDuration = 7,
  alwaysShow = false,
  className,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(alwaysShow)

  useEffect(() => {
    if (alwaysShow) {
      setIsVisible(true)
      return
    }

    // Check if announcement was previously dismissed
    const dismissedData = localStorage.getItem(storageKey)

    if (dismissedData) {
      try {
        const { timestamp } = JSON.parse(dismissedData)
        const now = Date.now()

        // Check if dismissal has expired
        if (dismissDuration === 0) {
          // Session only - always show on page load
          setIsVisible(true)
        } else {
          const expiryTime = timestamp + dismissDuration * 24 * 60 * 60 * 1000
          setIsVisible(now > expiryTime)
        }
      } catch {
        // Invalid data, show announcement
        setIsVisible(true)
      }
    } else {
      // Never dismissed, show announcement
      setIsVisible(true)
    }
  }, [alwaysShow, storageKey, dismissDuration])

  const handleDismiss = () => {
    setIsVisible(false)

    if (!alwaysShow) {
      // Store dismissal timestamp
      localStorage.setItem(
        storageKey,
        JSON.stringify({ timestamp: Date.now() })
      )
    }
  }

  const handleCTAClick = (e: React.MouseEvent) => {
    if (onCtaClick && !ctaHref) {
      e.preventDefault()
      onCtaClick()
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <BarContainer $variant={variant} className={className} role="banner">
      <BarContent>
        <Message>{message}</Message>

        {(ctaText || ctaHref) && (
          <CTAButton
            as={ctaHref ? 'a' : 'button'}
            href={ctaHref}
            onClick={handleCTAClick}
            $hasHref={!!ctaHref}
            target={ctaHref ? '_blank' : undefined}
            rel={ctaHref ? 'noopener noreferrer' : undefined}
          >
            {ctaText}
            {ctaHref && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </CTAButton>
        )}

        <CloseButton
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          title="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </CloseButton>
      </BarContent>
    </BarContainer>
  )
}
