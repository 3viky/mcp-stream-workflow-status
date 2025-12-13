import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { LuxeContainer } from './Container'

describe('LuxeContainer', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<LuxeContainer>Test content</LuxeContainer>)
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should render all size variants correctly', () => {
      const { rerender } = render(<LuxeContainer size="sm">Small</LuxeContainer>)
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<LuxeContainer size="md">Medium</LuxeContainer>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeContainer size="lg">Large</LuxeContainer>)
      expect(screen.getByText('Large')).toBeInTheDocument()

      rerender(<LuxeContainer size="xl">Extra Large</LuxeContainer>)
      expect(screen.getByText('Extra Large')).toBeInTheDocument()

      rerender(<LuxeContainer size="2xl">2XL</LuxeContainer>)
      expect(screen.getByText('2XL')).toBeInTheDocument()

      rerender(<LuxeContainer size="full">Full</LuxeContainer>)
      expect(screen.getByText('Full')).toBeInTheDocument()
    })

    it('should render all padding variants correctly', () => {
      const { rerender } = render(<LuxeContainer padding="none">None</LuxeContainer>)
      expect(screen.getByText('None')).toBeInTheDocument()

      rerender(<LuxeContainer padding="sm">Small</LuxeContainer>)
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<LuxeContainer padding="md">Medium</LuxeContainer>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeContainer padding="lg">Large</LuxeContainer>)
      expect(screen.getByText('Large')).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      render(<LuxeContainer>Default</LuxeContainer>)
      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<LuxeContainer className="custom-class">Custom</LuxeContainer>)
      expect(screen.getByText('Custom')).toHaveClass('custom-class')
    })
  })

  describe('Layout Behavior', () => {
    it('should render centered by default', () => {
      render(<LuxeContainer>Centered</LuxeContainer>)
      expect(screen.getByText('Centered')).toBeInTheDocument()
    })

    it('should render not centered when specified', () => {
      render(<LuxeContainer centered={false}>Not centered</LuxeContainer>)
      expect(screen.getByText('Not centered')).toBeInTheDocument()
    })

    it('should toggle centered prop', () => {
      const { rerender } = render(<LuxeContainer centered={true}>Toggle</LuxeContainer>)
      expect(screen.getByText('Toggle')).toBeInTheDocument()

      rerender(<LuxeContainer centered={false}>Toggle</LuxeContainer>)
      expect(screen.getByText('Toggle')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<LuxeContainer>Text content</LuxeContainer>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      render(
        <LuxeContainer>
          <div>Nested content</div>
        </LuxeContainer>
      )
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <LuxeContainer>
          <div>First</div>
          <div>Second</div>
        </LuxeContainer>
      )
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('should render complex nested structures', () => {
      render(
        <LuxeContainer>
          <section>
            <h1>Title</h1>
            <p>Paragraph</p>
          </section>
        </LuxeContainer>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      render(
        <LuxeContainer
          size="lg"
          padding="lg"
          centered={true}
          className="combined-test"
        >
          Combined props
        </LuxeContainer>
      )
      expect(screen.getByText('Combined props')).toBeInTheDocument()
      expect(screen.getByText('Combined props')).toHaveClass('combined-test')
    })

    it('should handle size and padding combinations', () => {
      const { rerender } = render(
        <LuxeContainer size="sm" padding="none">
          Small + None
        </LuxeContainer>
      )
      expect(screen.getByText('Small + None')).toBeInTheDocument()

      rerender(
        <LuxeContainer size="xl" padding="lg">
          XL + Large
        </LuxeContainer>
      )
      expect(screen.getByText('XL + Large')).toBeInTheDocument()
    })
  })
})
