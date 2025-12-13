import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useParallax } from './useParallax'

describe('useParallax', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should return 0 offset initially', () => {
      const { result } = renderHook(() => useParallax())
      expect(result.current).toBe(0)
    })

    it('should return offset based on scroll position', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      // Simulate scroll
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(50) // 100 * 0.5
      })
    })

    it('should update offset on scroll', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      // First scroll
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(50)
      })

      // Second scroll
      Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(100) // 200 * 0.5
      })
    })
  })

  describe('Speed Multiplier', () => {
    it('should handle default speed of 0.5', async () => {
      const { result } = renderHook(() => useParallax())

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(50)
      })
    })

    it('should handle custom speed values', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.3 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(30) // 100 * 0.3
      })
    })

    it('should handle speed of 1', async () => {
      const { result } = renderHook(() => useParallax({ speed: 1 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(100) // 100 * 1
      })
    })

    it('should handle speed of 0', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(0) // 100 * 0
      })
    })

    it('should handle negative speed values', async () => {
      const { result } = renderHook(() => useParallax({ speed: -0.5 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(-50) // 100 * -0.5
      })
    })

    it('should handle very small speed values', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.1 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(10) // 100 * 0.1
      })
    })

    it('should handle speed values greater than 1', async () => {
      const { result } = renderHook(() => useParallax({ speed: 2 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(200) // 100 * 2
      })
    })
  })

  describe('Enabled/Disabled State', () => {
    it('should be enabled by default', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(50)
      })
    })

    it('should return 0 when disabled', () => {
      const { result } = renderHook(() => useParallax({ enabled: false }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      expect(result.current).toBe(0)
    })

    it('should not add scroll listener when disabled', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useParallax({ enabled: false }))

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        expect.any(Object)
      )

      addEventListenerSpy.mockRestore()
    })

    it('should toggle between enabled and disabled', async () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useParallax({ speed: 0.5, enabled }),
        { initialProps: { enabled: true } }
      )

      // Enabled - should update
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(50)
      })

      // Disable
      rerender({ enabled: false })
      expect(result.current).toBe(0)
    })
  })

  describe('Event Listener Cleanup', () => {
    it('should remove scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useParallax())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      )

      removeEventListenerSpy.mockRestore()
    })

    it('should use passive event listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useParallax())

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      )

      addEventListenerSpy.mockRestore()
    })
  })

  describe('Performance', () => {
    it('should handle rapid scroll events', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      // Simulate rapid scrolling
      for (let i = 0; i < 100; i += 10) {
        Object.defineProperty(window, 'pageYOffset', { value: i, writable: true })
        window.dispatchEvent(new Event('scroll'))
      }

      await waitFor(() => {
        expect(result.current).toBe(45) // 90 * 0.5 (last scroll position)
      })
    })

    it('should handle large scroll values', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      Object.defineProperty(window, 'pageYOffset', { value: 10000, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(5000)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle decimal scroll values', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      Object.defineProperty(window, 'pageYOffset', { value: 123.45, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBeCloseTo(61.725, 2)
      })
    })

    it('should handle speed value with many decimal places', async () => {
      const { result } = renderHook(() => useParallax({ speed: 0.123456 }))

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBeCloseTo(12.3456, 2)
      })
    })

    it('should handle zero scroll position', () => {
      const { result } = renderHook(() => useParallax({ speed: 0.5 }))

      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
      window.dispatchEvent(new Event('scroll'))

      expect(result.current).toBe(0)
    })

    it('should update when speed changes', async () => {
      const { result, rerender } = renderHook(
        ({ speed }) => useParallax({ speed }),
        { initialProps: { speed: 0.5 } }
      )

      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(50)
      })

      // Change speed
      rerender({ speed: 1 })
      window.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        expect(result.current).toBe(100)
      })
    })
  })

  describe('TypeScript Types', () => {
    it('should accept valid options', () => {
      renderHook(() => useParallax({ speed: 0.5, enabled: true }))
      renderHook(() => useParallax({ speed: 0.5 }))
      renderHook(() => useParallax({ enabled: true }))
      renderHook(() => useParallax())
    })

    it('should return number', () => {
      const { result } = renderHook(() => useParallax())
      expect(typeof result.current).toBe('number')
    })
  })
})
