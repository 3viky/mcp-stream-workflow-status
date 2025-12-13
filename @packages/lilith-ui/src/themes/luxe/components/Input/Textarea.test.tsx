import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import { LuxeTextarea } from './Textarea'

describe('LuxeTextarea', () => {
  describe('Rendering', () => {
    it('should render textarea field', () => {
      render(<LuxeTextarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<LuxeTextarea label="Description" />)
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('should render without label', () => {
      render(<LuxeTextarea placeholder="Enter description" />)
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
    })

    it('should render error message', () => {
      render(<LuxeTextarea label="Bio" error="Bio is required" />)
      expect(screen.getByRole('alert')).toHaveTextContent('Bio is required')
    })

    it('should not render error message when no error', () => {
      render(<LuxeTextarea label="Bio" />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should generate id from label', () => {
      render(<LuxeTextarea label="User Bio" />)
      const textarea = screen.getByLabelText('User Bio')
      expect(textarea).toHaveAttribute('id', 'user-bio')
    })

    it('should use custom id when provided', () => {
      render(<LuxeTextarea label="Bio" id="custom-textarea-id" />)
      const textarea = screen.getByLabelText('Bio')
      expect(textarea).toHaveAttribute('id', 'custom-textarea-id')
    })

    it('should render with default 5 rows', () => {
      render(<LuxeTextarea label="Bio" />)
      expect(screen.getByLabelText('Bio')).toHaveAttribute('rows', '5')
    })

    it('should render with custom rows', () => {
      render(<LuxeTextarea label="Bio" rows={10} />)
      expect(screen.getByLabelText('Bio')).toHaveAttribute('rows', '10')
    })
  })

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup()
      render(<LuxeTextarea label="Description" />)

      const textarea = screen.getByLabelText('Description')
      await user.type(textarea, 'This is a test description')

      expect(textarea).toHaveValue('This is a test description')
    })

    it('should handle multiline text input', async () => {
      const user = userEvent.setup()
      render(<LuxeTextarea label="Bio" />)

      const textarea = screen.getByLabelText('Bio')
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')

      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3')
    })

    it('should handle onChange event', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<LuxeTextarea label="Bio" onChange={handleChange} />)

      const textarea = screen.getByLabelText('Bio')
      await user.type(textarea, 'T')

      expect(handleChange).toHaveBeenCalled()
    })

    it('should handle onFocus event', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()

      render(<LuxeTextarea label="Bio" onFocus={handleFocus} />)

      const textarea = screen.getByLabelText('Bio')
      await user.click(textarea)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should handle onBlur event', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()

      render(<LuxeTextarea label="Bio" onBlur={handleBlur} />)

      const textarea = screen.getByLabelText('Bio')
      await user.click(textarea)
      await user.tab()

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup()
      render(<LuxeTextarea label="Bio" disabled />)

      const textarea = screen.getByLabelText('Bio')
      await user.type(textarea, 'Text')

      expect(textarea).toHaveValue('')
    })
  })

  describe('States', () => {
    it('should render disabled state', () => {
      render(<LuxeTextarea label="Bio" disabled />)
      expect(screen.getByLabelText('Bio')).toBeDisabled()
    })

    it('should render enabled state by default', () => {
      render(<LuxeTextarea label="Bio" />)
      expect(screen.getByLabelText('Bio')).not.toBeDisabled()
    })

    it('should render with error styling', () => {
      render(<LuxeTextarea label="Bio" error="Required" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<LuxeTextarea placeholder="Tell us about yourself" />)
      expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have textbox role', () => {
      render(<LuxeTextarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should associate label with textarea', () => {
      render(<LuxeTextarea label="Biography" />)
      const textarea = screen.getByLabelText('Biography')
      expect(textarea).toBeInTheDocument()
    })

    it('should render error with alert role', () => {
      render(<LuxeTextarea error="Error message" />)
      expect(screen.getByRole('alert')).toHaveTextContent('Error message')
    })

    it('should support aria-label', () => {
      render(<LuxeTextarea aria-label="User description field" />)
      expect(screen.getByLabelText('User description field')).toBeInTheDocument()
    })

    it('should support aria-required', () => {
      render(<LuxeTextarea label="Bio" aria-required="true" required />)
      expect(screen.getByLabelText('Bio')).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('HTML Attributes', () => {
    it('should support required attribute', () => {
      render(<LuxeTextarea label="Bio" required />)
      expect(screen.getByLabelText('Bio')).toBeRequired()
    })

    it('should support maxLength attribute', () => {
      render(<LuxeTextarea label="Bio" maxLength={500} />)
      expect(screen.getByLabelText('Bio')).toHaveAttribute('maxLength', '500')
    })

    it('should support autoComplete attribute', () => {
      render(<LuxeTextarea label="Address" autoComplete="street-address" />)
      expect(screen.getByLabelText('Address')).toHaveAttribute('autoComplete', 'street-address')
    })

    it('should support custom className', () => {
      const { container } = render(<LuxeTextarea label="Bio" className="custom-class" />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('Full Width', () => {
    it('should render full width textarea', () => {
      render(<LuxeTextarea label="Bio" fullWidth />)
      expect(screen.getByLabelText('Bio')).toBeInTheDocument()
    })

    it('should not be full width by default', () => {
      render(<LuxeTextarea label="Bio" />)
      expect(screen.getByLabelText('Bio')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long text input', () => {
      const longText = 'A'.repeat(1000)
      render(<LuxeTextarea label="Bio" value={longText} onChange={() => {}} />)

      expect(screen.getByLabelText('Bio')).toHaveValue(longText)
    })

    it('should handle special characters', () => {
      const specialText = '<>&"\'@#$%^*()[]{}|\\~`'
      render(<LuxeTextarea label="Bio" value={specialText} onChange={() => {}} />)

      expect(screen.getByLabelText('Bio')).toHaveValue(specialText)
    })

    it('should handle empty value', () => {
      render(<LuxeTextarea label="Bio" value="" onChange={() => {}} />)
      expect(screen.getByLabelText('Bio')).toHaveValue('')
    })

    it('should handle controlled component', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('')
        return (
          <LuxeTextarea
            label="Bio"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      const textarea = screen.getByLabelText('Bio')
      await user.clear(textarea)
      await user.paste('Controlled')

      expect(textarea).toHaveValue('Controlled')
    })

    it('should accept initial value prop', () => {
      render(<LuxeTextarea label="Bio" defaultValue="Initial bio content" />)
      expect(screen.getByLabelText('Bio')).toHaveValue('Initial bio content')
    })
  })
})
