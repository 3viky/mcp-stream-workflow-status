import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { LuxeSection } from './Section'

describe('LuxeSection', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<LuxeSection>Test content</LuxeSection>)
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should render all variant types correctly', () => {
      const { rerender } = render(<LuxeSection variant="default">Default</LuxeSection>)
      expect(screen.getByText('Default')).toBeInTheDocument()

      rerender(<LuxeSection variant="alt">Alt</LuxeSection>)
      expect(screen.getByText('Alt')).toBeInTheDocument()

      rerender(<LuxeSection variant="elevated">Elevated</LuxeSection>)
      expect(screen.getByText('Elevated')).toBeInTheDocument()
    })

    it('should render all padding sizes correctly', () => {
      const { rerender } = render(<LuxeSection padding="none">None</LuxeSection>)
      expect(screen.getByText('None')).toBeInTheDocument()

      rerender(<LuxeSection padding="sm">Small</LuxeSection>)
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<LuxeSection padding="md">Medium</LuxeSection>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeSection padding="lg">Large</LuxeSection>)
      expect(screen.getByText('Large')).toBeInTheDocument()

      rerender(<LuxeSection padding="xl">Extra Large</LuxeSection>)
      expect(screen.getByText('Extra Large')).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      render(<LuxeSection>Default</LuxeSection>)
      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<LuxeSection className="custom-class">Custom</LuxeSection>)
      expect(screen.getByText('Custom')).toHaveClass('custom-class')
    })
  })

  describe('HTML Attributes', () => {
    it('should render as section element', () => {
      const { container } = render(<LuxeSection>Section</LuxeSection>)
      expect(container.querySelector('section')).toBeInTheDocument()
    })

    it('should support id attribute for navigation anchors', () => {
      const { container } = render(<LuxeSection id="test-section">Anchor</LuxeSection>)
      const section = container.querySelector('section')
      expect(section).toHaveAttribute('id', 'test-section')
    })

    it('should render without id when not provided', () => {
      const { container } = render(<LuxeSection>No ID</LuxeSection>)
      const section = container.querySelector('section')
      expect(section).not.toHaveAttribute('id')
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<LuxeSection>Text content</LuxeSection>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      render(
        <LuxeSection>
          <div>Nested content</div>
        </LuxeSection>
      )
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <LuxeSection>
          <h2>Heading</h2>
          <p>Paragraph</p>
        </LuxeSection>
      )
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
    })

    it('should render complex nested structures', () => {
      render(
        <LuxeSection>
          <div>
            <article>
              <h1>Title</h1>
              <p>Content</p>
            </article>
          </div>
        </LuxeSection>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      const { container } = render(
        <LuxeSection
          variant="elevated"
          padding="lg"
          id="combined"
          className="combined-test"
        >
          Combined props
        </LuxeSection>
      )
      const section = container.querySelector('section')
      expect(screen.getByText('Combined props')).toBeInTheDocument()
      expect(section).toHaveAttribute('id', 'combined')
      expect(section).toHaveClass('combined-test')
    })

    it('should handle variant and padding combinations', () => {
      const { rerender } = render(
        <LuxeSection variant="default" padding="none">
          Default + None
        </LuxeSection>
      )
      expect(screen.getByText('Default + None')).toBeInTheDocument()

      rerender(
        <LuxeSection variant="elevated" padding="xl">
          Elevated + XL
        </LuxeSection>
      )
      expect(screen.getByText('Elevated + XL')).toBeInTheDocument()
    })
  })
})
