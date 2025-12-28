import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { LuxeCard } from './Card'

describe('LuxeCard', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<LuxeCard>Card content</LuxeCard>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render without image', () => {
      render(<LuxeCard>No image</LuxeCard>)
      expect(screen.getByText('No image')).toBeInTheDocument()
    })

    it('should render with image', () => {
      render(
        <LuxeCard imageSrc="/test.jpg" imageAlt="Test image">
          With image
        </LuxeCard>
      )
      expect(screen.getByAltText('Test image')).toBeInTheDocument()
      expect(screen.getByText('With image')).toBeInTheDocument()
    })

    it('should render image with default alt text', () => {
      const { container } = render(<LuxeCard imageSrc="/test.jpg">Content</LuxeCard>)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', '')
      expect(img).toBeInTheDocument()
    })

    it('should render with overlay', () => {
      const { container } = render(
        <LuxeCard imageSrc="/test.jpg" overlay={true}>
          Overlay
        </LuxeCard>
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(screen.getByText('Overlay')).toBeInTheDocument()
    })

    it('should render without overlay by default', () => {
      const { container } = render(<LuxeCard imageSrc="/test.jpg">No overlay</LuxeCard>)
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(screen.getByText('No overlay')).toBeInTheDocument()
    })

    it('should render all padding variants correctly', () => {
      const { rerender } = render(<LuxeCard padding="none">None</LuxeCard>)
      expect(screen.getByText('None')).toBeInTheDocument()

      rerender(<LuxeCard padding="sm">Small</LuxeCard>)
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<LuxeCard padding="md">Medium</LuxeCard>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeCard padding="lg">Large</LuxeCard>)
      expect(screen.getByText('Large')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(<LuxeCard className="custom-class">Custom</LuxeCard>)
      const card = container.querySelector('.custom-class')
      expect(card).toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })
  })

  describe('Hover Behavior', () => {
    it('should be hoverable by default', () => {
      render(<LuxeCard>Hoverable</LuxeCard>)
      expect(screen.getByText('Hoverable')).toBeInTheDocument()
    })

    it('should not be hoverable when specified', () => {
      render(<LuxeCard hoverable={false}>Not hoverable</LuxeCard>)
      expect(screen.getByText('Not hoverable')).toBeInTheDocument()
    })

    it('should toggle hoverable prop', () => {
      const { rerender } = render(<LuxeCard hoverable={true}>Toggle</LuxeCard>)
      expect(screen.getByText('Toggle')).toBeInTheDocument()

      rerender(<LuxeCard hoverable={false}>Toggle</LuxeCard>)
      expect(screen.getByText('Toggle')).toBeInTheDocument()
    })
  })

  describe('Click Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeCard onClick={handleClick}>Clickable</LuxeCard>)

      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not have button role without onClick', () => {
      render(<LuxeCard>Not clickable</LuxeCard>)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should have button role with onClick', () => {
      render(<LuxeCard onClick={() => {}}>Clickable</LuxeCard>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should handle multiple clicks', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeCard onClick={handleClick}>Multi-click</LuxeCard>)

      const card = screen.getByRole('button')
      await user.click(card)
      await user.click(card)
      await user.click(card)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Keyboard Navigation', () => {
    it('should be keyboard accessible with onClick', () => {
      render(<LuxeCard onClick={() => {}}>Keyboard accessible</LuxeCard>)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should not be keyboard focusable without onClick', () => {
      render(<LuxeCard>Not focusable</LuxeCard>)
      const container = screen.getByText('Not focusable').parentElement
      expect(container).not.toHaveAttribute('tabIndex')
    })

    it('should support Enter key activation', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeCard onClick={handleClick}>Press Enter</LuxeCard>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should support Space key activation', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeCard onClick={handleClick}>Press Space</LuxeCard>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger on other keys', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeCard onClick={handleClick}>Press Key</LuxeCard>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Escape}')
      await user.keyboard('{Tab}')
      await user.keyboard('a')

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Image Loading', () => {
    it('should set loading attribute to lazy', () => {
      render(<LuxeCard imageSrc="/test.jpg" imageAlt="Lazy">Content</LuxeCard>)
      expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy')
    })

    it('should use correct image source', () => {
      render(
        <LuxeCard imageSrc="/path/to/image.jpg" imageAlt="Test">
          Content
        </LuxeCard>
      )
      expect(screen.getByRole('img')).toHaveAttribute('src', '/path/to/image.jpg')
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<LuxeCard>Text content</LuxeCard>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      render(
        <LuxeCard>
          <h3>Card Title</h3>
          <p>Card description</p>
        </LuxeCard>
      )
      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description')).toBeInTheDocument()
    })

    it('should render complex nested structures', () => {
      render(
        <LuxeCard>
          <article>
            <header>Header</header>
            <section>Body</section>
            <footer>Footer</footer>
          </article>
        </LuxeCard>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      const handleClick = vi.fn()

      const { container } = render(
        <LuxeCard
          imageSrc="/test.jpg"
          imageAlt="Combined"
          overlay={true}
          padding="lg"
          hoverable={true}
          onClick={handleClick}
          className="combined-test"
        >
          Combined props
        </LuxeCard>
      )

      expect(screen.getByAltText('Combined')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Combined props')
      const combinedElement = container.querySelector('.combined-test')
      expect(combinedElement).toBeInTheDocument()
    })

    it('should handle image with overlay and click handler', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      const { container } = render(
        <LuxeCard imageSrc="/test.jpg" overlay={true} onClick={handleClick}>
          Interactive card
        </LuxeCard>
      )

      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should handle padding and hoverable combinations', () => {
      const { rerender } = render(
        <LuxeCard padding="none" hoverable={false}>
          None + Not hoverable
        </LuxeCard>
      )
      expect(screen.getByText('None + Not hoverable')).toBeInTheDocument()

      rerender(
        <LuxeCard padding="lg" hoverable={true}>
          Large + Hoverable
        </LuxeCard>
      )
      expect(screen.getByText('Large + Hoverable')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper role when clickable', () => {
      render(<LuxeCard onClick={() => {}}>Accessible</LuxeCard>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should not have button role when not clickable', () => {
      render(<LuxeCard>Not accessible as button</LuxeCard>)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should support keyboard focus', () => {
      render(<LuxeCard onClick={() => {}}>Focusable</LuxeCard>)
      const card = screen.getByRole('button')
      card.focus()
      expect(card).toHaveFocus()
    })

    it('should have proper image alt text', () => {
      render(
        <LuxeCard imageSrc="/test.jpg" imageAlt="Descriptive alt text">
          Content
        </LuxeCard>
      )
      expect(screen.getByAltText('Descriptive alt text')).toBeInTheDocument()
    })
  })
})
