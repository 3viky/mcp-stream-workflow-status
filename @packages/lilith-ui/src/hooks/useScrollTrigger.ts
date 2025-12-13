/**
 * useScrollTrigger Hook
 *
 * Triggers a callback when element enters viewport.
 * Useful for fade-in animations and lazy loading.
 * Theme-agnostic - no theme dependencies.
 */

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export interface UseScrollTriggerOptions {
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Threshold for triggering (0-1) */
  threshold?: number
  /** Trigger only once */
  triggerOnce?: boolean
}

export function useScrollTrigger(
  ref: RefObject<Element>,
  options: UseScrollTriggerOptions = {}
): boolean {
  const {
    rootMargin = '0px',
    threshold = 0.1,
    triggerOnce = true,
  } = options

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, rootMargin, threshold, triggerOnce])

  return isVisible
}
