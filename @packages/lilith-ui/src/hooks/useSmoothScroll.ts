/**
 * useSmoothScroll Hook
 *
 * Provides smooth scroll to element functionality.
 * Handles offset for fixed headers.
 */

import { useCallback } from 'react';

export interface UseSmoothScrollOptions {
  /** Offset from top (for fixed headers) */
  offset?: number;
  /** Scroll behavior */
  behavior?: ScrollBehavior;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const { offset = 0, behavior = 'smooth' } = options;

  const scrollTo = useCallback(
    (target: string | Element) => {
      const element =
        typeof target === 'string'
          ? document.querySelector(target)
          : target;

      if (!element) return;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior,
      });
    },
    [offset, behavior]
  );

  return { scrollTo };
}
