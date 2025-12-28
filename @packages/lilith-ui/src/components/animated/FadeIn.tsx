/**
 * FadeIn Component
 *
 * Animates child elements with fade-in effect when scrolled into view.
 * Uses Intersection Observer for performance.
 * Theme-adaptive via semantic tokens - uses theme transition timings.
 */

import { useRef } from 'react'
import styled from 'styled-components'
import { useScrollTrigger } from '../../hooks/useScrollTrigger'

export interface FadeInProps {
  /** Animation direction */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Animation delay in ms */
  delay?: number
  /** Animation duration (uses theme transition timings) */
  duration?: 'fast' | 'normal' | 'slow'
  /** Trigger only once */
  triggerOnce?: boolean
  /** Custom className */
  className?: string
  /** Child elements */
  children: React.ReactNode
}

const AnimatedContainer = styled.div<{
  $isVisible: boolean
  $direction: FadeInProps['direction']
  $delay: number
  $duration: FadeInProps['duration']
}>`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible, $direction }) => {
    if ($isVisible) return 'translate(0, 0)'

    switch ($direction) {
      case 'up':
        return 'translateY(30px)'
      case 'down':
        return 'translateY(-30px)'
      case 'left':
        return 'translateX(30px)'
      case 'right':
        return 'translateX(-30px)'
      default:
        return 'none'
    }
  }};
  transition: opacity
      ${({ $duration, theme }) => {
        switch ($duration) {
          case 'fast':
            return theme.transitions.fast
          case 'normal':
            return theme.transitions.normal
          case 'slow':
            return theme.transitions.slow
          default:
            return theme.transitions.normal
        }
      }},
    transform
      ${({ $duration, theme }) => {
        switch ($duration) {
          case 'fast':
            return theme.transitions.fast
          case 'normal':
            return theme.transitions.normal
          case 'slow':
            return theme.transitions.slow
          default:
            return theme.transitions.normal
        }
      }};
  transition-delay: ${({ $delay }) => $delay}ms;
`

export function FadeIn({
  direction = 'up',
  delay = 0,
  duration = 'normal',
  triggerOnce = true,
  className,
  children,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useScrollTrigger(ref, { triggerOnce, threshold: 0.1 })

  return (
    <AnimatedContainer
      ref={ref}
      $isVisible={isVisible}
      $direction={direction}
      $delay={delay}
      $duration={duration}
      className={className}
    >
      {children}
    </AnimatedContainer>
  )
}
