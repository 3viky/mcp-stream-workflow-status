/**
 * useParallax Hook
 *
 * Creates parallax scroll effect for elements.
 * Returns transform value based on scroll position.
 */

import { useEffect, useState } from 'react'

export interface UseParallaxOptions {
  /** Speed multiplier (-1 to 1) */
  speed?: number;
  /** Enable parallax */
  enabled?: boolean;
}

export function useParallax(options: UseParallaxOptions = {}): number {
  const { speed = 0.5, enabled = true } = options
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      setOffset(window.pageYOffset * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, enabled])

  return enabled ? offset : 0
}
