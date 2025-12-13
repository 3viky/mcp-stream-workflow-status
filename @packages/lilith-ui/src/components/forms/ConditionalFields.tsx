/**
 * ConditionalFields Component
 *
 * Show/hide form fields based on conditions with smooth transitions.
 * Preserves form state when toggling visibility.
 */

import React, { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'

export interface ConditionalFieldsProps {
  /** Condition to determine if children should be shown */
  condition: boolean
  /** Content to render when condition is true */
  children: React.ReactNode
  /** Optional content to render when condition is false */
  fallback?: React.ReactNode
  /** Duration of transition animation in ms */
  transitionDuration?: number
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`

const Container = styled.div<{
  $isVisible: boolean
  $isExiting: boolean
  $duration: number
}>`
  overflow: hidden;
  transition: all ${props => props.$duration}ms ease-in-out;

  ${props => props.$isVisible && !props.$isExiting && css`
    animation: ${fadeIn} ${props.$duration}ms ease-in-out;
    max-height: 10000px;
    opacity: 1;
  `}

  ${props => props.$isExiting && css`
    animation: ${fadeOut} ${props.$duration}ms ease-in-out;
    max-height: 0;
    opacity: 0;
  `}

  ${props => !props.$isVisible && !props.$isExiting && css`
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  `}
`

/**
 * ConditionalFields conditionally renders form fields with smooth transitions.
 * Maintains form state when toggling visibility and supports fallback content.
 *
 * @example
 * // Basic conditional field
 * <ConditionalFields condition={showAddress}>
 *   <Input label="Street Address" />
 *   <Input label="City" />
 * </ConditionalFields>
 *
 * @example
 * // With fallback content
 * <ConditionalFields
 *   condition={paymentMethod === 'card'}
 *   fallback={<p>Cash payment selected</p>}
 * >
 *   <Input label="Card Number" />
 *   <Input label="CVV" />
 * </ConditionalFields>
 *
 * @example
 * // Custom transition duration
 * <ConditionalFields
 *   condition={isExpanded}
 *   transitionDuration={500}
 * >
 *   <Input label="Additional Details" />
 * </ConditionalFields>
 */
export const ConditionalFields: React.FC<ConditionalFieldsProps> = ({
  condition,
  children,
  fallback,
  transitionDuration = 300
}) => {
  const [isVisible, setIsVisible] = useState(condition)
  const [isExiting, setIsExiting] = useState(false)
  const [shouldRenderChildren, setShouldRenderChildren] = useState(condition)
  const [shouldRenderFallback, setShouldRenderFallback] = useState(!condition && !!fallback)

  useEffect(() => {
    if (condition) {
      // Show children
      setIsExiting(false)
      setIsVisible(true)
      setShouldRenderChildren(true)
      setShouldRenderFallback(false)
    } else {
      // Hide children
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        setShouldRenderChildren(false)
        if (fallback) {
          setShouldRenderFallback(true)
        }
        setIsExiting(false)
      }, transitionDuration)
    }
  }, [condition, transitionDuration, fallback])

  return (
    <>
      {shouldRenderChildren && (
        <Container
          $isVisible={isVisible}
          $isExiting={isExiting}
          $duration={transitionDuration}
          role="region"
          aria-hidden={!isVisible}
        >
          {children}
        </Container>
      )}

      {shouldRenderFallback && fallback && (
        <Container
          $isVisible={!isVisible}
          $isExiting={false}
          $duration={transitionDuration}
          role="region"
        >
          {fallback}
        </Container>
      )}
    </>
  )
}
