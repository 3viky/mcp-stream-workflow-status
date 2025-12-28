import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { LuxeButton } from './Button'

describe('LuxeButton', () => {
  describe('Rendering', () => {
    it('should render with text', () => {
      render(<LuxeButton>Click me</LuxeButton>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('should render all variants correctly', () => {
      const { rerender } = render(<LuxeButton variant="primary">Primary</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<LuxeButton variant="secondary">Secondary</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<LuxeButton variant="outline">Outline</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<LuxeButton variant="ghost">Ghost</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should render all sizes correctly', () => {
      const { rerender } = render(<LuxeButton size="sm">Small</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<LuxeButton size="md">Medium</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<LuxeButton size="lg">Large</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      render(<LuxeButton>Default</LuxeButton>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('should render with custom className', () => {
      render(<LuxeButton className="custom-class">Custom</LuxeButton>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('should render full width button', () => {
      render(<LuxeButton fullWidth>Full Width</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeButton onClick={handleClick}>Click me</LuxeButton>)

      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <LuxeButton onClick={handleClick} disabled>
          Disabled
        </LuxeButton>
      )

      await user.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should support keyboard navigation (Enter)', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeButton onClick={handleClick}>Press Enter</LuxeButton>)

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should support keyboard navigation (Space)', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeButton onClick={handleClick}>Press Space</LuxeButton>)

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<LuxeButton onClick={handleClick}>Multi-click</LuxeButton>)

      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('States', () => {
    it('should render disabled state', () => {
      render(<LuxeButton disabled>Disabled</LuxeButton>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should not be disabled by default', () => {
      render(<LuxeButton>Enabled</LuxeButton>)
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('should apply disabled attribute correctly', () => {
      const { rerender } = render(<LuxeButton>Toggle</LuxeButton>)
      expect(screen.getByRole('button')).not.toBeDisabled()

      rerender(<LuxeButton disabled>Toggle</LuxeButton>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<LuxeButton>Accessible</LuxeButton>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<LuxeButton aria-label="Close dialog">X</LuxeButton>)
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
    })

    it('should support aria-disabled', () => {
      render(<LuxeButton disabled aria-disabled="true">Disabled</LuxeButton>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
    })

    it('should be keyboard focusable when enabled', () => {
      render(<LuxeButton>Focusable</LuxeButton>)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should support type attribute', () => {
      render(<LuxeButton type="submit">Submit</LuxeButton>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })

  describe('HTML Attributes', () => {
    it('should spread additional props to button element', () => {
      render(
        <LuxeButton data-testid="custom-button" id="btn-id">
          Props
        </LuxeButton>
      )
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('id', 'btn-id')
    })

    it('should support title attribute', () => {
      render(<LuxeButton title="Button tooltip">Hover me</LuxeButton>)
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Button tooltip')
    })

    it('should support tabIndex', () => {
      render(<LuxeButton tabIndex={0}>Tab target</LuxeButton>)
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Children and Content', () => {
    it('should render text children', () => {
      render(<LuxeButton>Text content</LuxeButton>)
      expect(screen.getByRole('button')).toHaveTextContent('Text content')
    })

    it('should render element children', () => {
      render(
        <LuxeButton>
          <span>Icon</span> Text
        </LuxeButton>
      )
      expect(screen.getByRole('button')).toHaveTextContent('Icon Text')
    })

    it('should render complex children structures', () => {
      render(
        <LuxeButton>
          <div>
            <span>Complex</span>
            <strong>Content</strong>
          </div>
        </LuxeButton>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
