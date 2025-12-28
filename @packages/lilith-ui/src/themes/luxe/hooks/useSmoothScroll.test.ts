import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useSmoothScroll } from './useSmoothScroll'

describe('useSmoothScroll', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn()

    // Mock document.querySelector
    document.querySelector = vi.fn()

    // Reset window scroll position
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
  })

  describe('Basic Functionality', () => {
    it('should return scrollTo function', () => {
      const { result } = renderHook(() => useSmoothScroll())
      expect(result.current).toHaveProperty('scrollTo')
      expect(typeof result.current.scrollTo).toBe('function')
    })

    it('should scroll to element by selector string', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#test-section')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      })
    })

    it('should scroll to element directly', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo(mockElement)

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      })
    })

    it('should not scroll if element not found', () => {
      document.querySelector = vi.fn(() => null)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#non-existent')

      expect(window.scrollTo).not.toHaveBeenCalled()
    })
  })

  describe('Offset Handling', () => {
    it('should use default offset of 0', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      })
    })

    it('should apply custom offset', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll({ offset: 80 }))
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 420, // 500 - 80
        behavior: 'smooth',
      })
    })

    it('should handle negative offset', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll({ offset: -50 }))
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 550, // 500 - (-50)
        behavior: 'smooth',
      })
    })

    it('should handle large offset values', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll({ offset: 1000 }))
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: -500, // 500 - 1000
        behavior: 'smooth',
      })
    })
  })

  describe('Scroll Behavior', () => {
    it('should use smooth behavior by default', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      })
    })

    it('should support auto behavior', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll({ behavior: 'auto' }))
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'auto',
      })
    })

    it('should support instant behavior', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() =>
        useSmoothScroll({ behavior: 'instant' })
      )
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'instant',
      })
    })
  })

  describe('Position Calculation', () => {
    it('should calculate position relative to page offset', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      // Set current scroll position
      Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true })

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 700, // 500 + 200
        behavior: 'smooth',
      })
    })

    it('should handle element at top of page', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    })

    it('should handle negative top values', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: -100,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)
      Object.defineProperty(window, 'pageYOffset', { value: 500, writable: true })

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 400, // -100 + 500
        behavior: 'smooth',
      })
    })
  })

  describe('Multiple Calls', () => {
    it('should handle multiple scrollTo calls', () => {
      const mockElement1 = document.createElement('div')
      mockElement1.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      const mockElement2 = document.createElement('div')
      mockElement2.getBoundingClientRect = vi.fn(() => ({
        top: 200,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn()
        .mockReturnValueOnce(mockElement1)
        .mockReturnValueOnce(mockElement2)

      const { result } = renderHook(() => useSmoothScroll())

      result.current.scrollTo('#section1')
      result.current.scrollTo('#section2')

      expect(window.scrollTo).toHaveBeenCalledTimes(2)
      expect(window.scrollTo).toHaveBeenNthCalledWith(1, {
        top: 100,
        behavior: 'smooth',
      })
      expect(window.scrollTo).toHaveBeenNthCalledWith(2, {
        top: 200,
        behavior: 'smooth',
      })
    })
  })

  describe('Options Memoization', () => {
    it('should memoize scrollTo function with offset', () => {
      const { result, rerender } = renderHook(
        ({ offset }) => useSmoothScroll({ offset }),
        { initialProps: { offset: 80 } }
      )

      const scrollTo1 = result.current.scrollTo

      rerender({ offset: 80 })

      const scrollTo2 = result.current.scrollTo

      expect(scrollTo1).toBe(scrollTo2)
    })

    it('should update scrollTo when offset changes', () => {
      const { result, rerender } = renderHook(
        ({ offset }) => useSmoothScroll({ offset }),
        { initialProps: { offset: 80 } }
      )

      const scrollTo1 = result.current.scrollTo

      rerender({ offset: 100 })

      const scrollTo2 = result.current.scrollTo

      expect(scrollTo1).not.toBe(scrollTo2)
    })

    it('should update scrollTo when behavior changes', () => {
      const { result, rerender } = renderHook(
        ({ behavior }) => useSmoothScroll({ behavior }),
        { initialProps: { behavior: 'smooth' as ScrollBehavior } }
      )

      const scrollTo1 = result.current.scrollTo

      rerender({ behavior: 'auto' as ScrollBehavior })

      const scrollTo2 = result.current.scrollTo

      expect(scrollTo1).not.toBe(scrollTo2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string selector', () => {
      document.querySelector = vi.fn(() => null)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('')

      expect(window.scrollTo).not.toHaveBeenCalled()
    })

    it('should handle complex selectors', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll())
      result.current.scrollTo('div.class#id[data-attr="value"]')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 100,
        behavior: 'smooth',
      })
    })

    it('should handle offset of 0', () => {
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      document.querySelector = vi.fn(() => mockElement)

      const { result } = renderHook(() => useSmoothScroll({ offset: 0 }))
      result.current.scrollTo('#test')

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 100,
        behavior: 'smooth',
      })
    })
  })
})
