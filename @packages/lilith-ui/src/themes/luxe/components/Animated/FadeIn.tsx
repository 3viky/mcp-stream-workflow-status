/**
 * FadeIn Component
 *
 * Animates child elements with fade-in effect when scrolled into view.
 * Uses Intersection Observer for performance.
 */

import { useRef } from 'react'
import styled from 'styled-components'

import { useScrollTrigger } from '../../hooks/useScrollTrigger.js'
import { luxeTheme } from '../../styles/tokens.js'

export interface FadeInProps {
  /** Animation direction */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Animation delay in ms */
  delay?: number;
  /** Animation duration */
  duration?: 'fast' | 'base' | 'slow' | 'slower';
  /** Trigger only once */
  triggerOnce?: boolean;
  /** Custom className */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

const AnimatedContainer = styled.div<{
  $isVisible: boolean;
  $direction: FadeInProps['direction'];
  $delay: number;
  $duration: FadeInProps['duration'];
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
      ${({ $duration }) => {
        switch ($duration) {
          case 'fast':
            return luxeTheme.transitions.fast
          case 'base':
            return luxeTheme.transitions.base
          case 'slow':
            return luxeTheme.transitions.slow
          case 'slower':
            return luxeTheme.transitions.slower
          default:
            return luxeTheme.transitions.base
        }
      }},
    transform
      ${({ $duration }) => {
        switch ($duration) {
          case 'fast':
            return luxeTheme.transitions.fast
          case 'base':
            return luxeTheme.transitions.base
          case 'slow':
            return luxeTheme.transitions.slow
          case 'slower':
            return luxeTheme.transitions.slower
          default:
            return luxeTheme.transitions.base
        }
      }};
  transition-delay: ${({ $delay }) => $delay}ms;
`

export function FadeIn({
  direction = 'up',
  delay = 0,
  duration = 'base',
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
