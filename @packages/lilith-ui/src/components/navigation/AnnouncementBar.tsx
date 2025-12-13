/**
 * AnnouncementBar Component
 *
 * Dismissible announcement bar for important updates, schedules, or notifications.
 * Supports localStorage persistence and frequency capping.
 * Theme-adaptive via semantic tokens.
 */

import { useState, useEffect } from 'react'
import styled from 'styled-components'

export interface AnnouncementBarProps {
  /** Announcement message */
  message: string
  /** Call-to-action text */
  ctaText?: string
  /** CTA click handler */
  onCtaClick?: () => void
  /** CTA link (alternative to onClick) */
  ctaHref?: string
  /** Background color variant */
  variant?: 'default' | 'primary' | 'secondary' | 'info' | 'warning'
  /** Storage key for dismissal persistence */
  storageKey?: string
  /** Dismissal duration in days (0 = session only) */
  dismissDuration?: number
  /** Always show (ignore dismissal) */
  alwaysShow?: boolean
  /** Custom className */
  className?: string
}

const BarContainer = styled.div<{ $variant: AnnouncementBarProps['variant'] }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${props => props.theme.zIndex.sticky};
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return theme.colors.primary
      case 'secondary':
        return theme.colors.secondary
      case 'info':
        return theme.colors.info || theme.colors.primary
      case 'warning':
        return theme.colors.warning || theme.colors.secondary
      case 'default':
      default:
        return theme.colors.surface
    }
  }};
  color: ${({ $variant, theme }) => {
    // Use dark text for light backgrounds (default, secondary)
    // Use white text for colored backgrounds (primary, info, warning)
    switch ($variant) {
      case 'default':
      case 'secondary':
        return theme.colors.text.primary
      case 'primary':
      case 'info':
      case 'warning':
      default:
        return '#ffffff'
    }
  }};
  box-shadow: ${props => props.theme.shadows.sm};
  animation: slideDown ${props => props.theme.transitions.slow};

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
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  max-width: 1536px;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
    text-align: center;
  }
`

const Message = styled.p`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin: 0;
  flex: 1;
  line-height: ${props => props.theme.typography.lineHeight.normal};
`

const CTAButton = styled.a<{ $hasHref: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.theme.colors.hover.surface};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.background};
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
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};
  margin-left: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
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
  storageKey = 'egirl-announcement-dismissed',
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
