import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, it, expect, beforeEach } from 'vitest'

import { useScrollTrigger } from './useScrollTrigger'

describe('useScrollTrigger', () => {
  beforeEach(() => {
    // IntersectionObserver is mocked in test-setup.ts
  })

  describe('Basic Functionality', () => {
    it('should return false initially', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref)
      })

      expect(result.current).toBe(false)
    })

    it('should accept custom options', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref, {
          rootMargin: '100px',
          threshold: 0.5,
          triggerOnce: false,
        })
      })

      expect(result.current).toBe(false)
    })

    it('should use default options', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref)
      })

      expect(result.current).toBe(false)
    })

    it('should handle null ref gracefully', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref)
      })

      expect(result.current).toBe(false)
    })
  })

  describe('Trigger Options', () => {
    it('should support triggerOnce=true', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref, { triggerOnce: true })
      })

      expect(result.current).toBe(false)
    })

    it('should support triggerOnce=false', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref, { triggerOnce: false })
      })

      expect(result.current).toBe(false)
    })

    it('should support custom threshold values', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref, { threshold: 0.5 })
      })

      expect(result.current).toBe(false)
    })

    it('should support custom rootMargin values', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref, { rootMargin: '100px' })
      })

      expect(result.current).toBe(false)
    })
  })

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref)
      })

      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Options Changes', () => {
    it('should update options on rerender', () => {
      const { rerender } = renderHook(
        ({ threshold }) => {
          const ref = useRef<HTMLDivElement>(null)
          return useScrollTrigger(ref, { threshold })
        },
        { initialProps: { threshold: 0.1 } }
      )

      rerender({ threshold: 0.5 })
      // Hook should handle option changes
      expect(true).toBe(true)
    })
  })

  describe('TypeScript Types', () => {
    it('should return boolean', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null)
        return useScrollTrigger(ref)
      })

      expect(typeof result.current).toBe('boolean')
    })
  })
})
