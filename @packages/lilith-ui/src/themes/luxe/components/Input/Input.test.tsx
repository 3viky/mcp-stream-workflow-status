import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { LuxeInput } from './Input'

describe('LuxeInput', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<LuxeInput />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<LuxeInput label="Email" />)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('should render without label', () => {
      render(<LuxeInput placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should render error message', () => {
      render(<LuxeInput label="Email" error="Invalid email" />)
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
    })

    it('should not render error message when no error', () => {
      render(<LuxeInput label="Email" />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should generate id from label', () => {
      render(<LuxeInput label="Email Address" />)
      const input = screen.getByLabelText('Email Address')
      expect(input).toHaveAttribute('id', 'email-address')
    })

    it('should use custom id when provided', () => {
      render(<LuxeInput label="Email" id="custom-id" />)
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('id', 'custom-id')
    })
  })

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup()
      render(<LuxeInput label="Name" />)

      const input = screen.getByLabelText('Name')
      await user.type(input, 'John Doe')

      expect(input).toHaveValue('John Doe')
    })

    it('should handle onChange event', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<LuxeInput label="Name" onChange={handleChange} />)

      const input = screen.getByLabelText('Name')
      await user.type(input, 'A')

      expect(handleChange).toHaveBeenCalled()
    })

    it('should handle onFocus event', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()

      render(<LuxeInput label="Name" onFocus={handleFocus} />)

      const input = screen.getByLabelText('Name')
      await user.click(input)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should handle onBlur event', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()

      render(<LuxeInput label="Name" onBlur={handleBlur} />)

      const input = screen.getByLabelText('Name')
      await user.click(input)
      await user.tab()

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup()
      render(<LuxeInput label="Name" disabled />)

      const input = screen.getByLabelText('Name')
      await user.type(input, 'Text')

      expect(input).toHaveValue('')
    })
  })

  describe('States', () => {
    it('should render disabled state', () => {
      render(<LuxeInput label="Name" disabled />)
      expect(screen.getByLabelText('Name')).toBeDisabled()
    })

    it('should render enabled state by default', () => {
      render(<LuxeInput label="Name" />)
      expect(screen.getByLabelText('Name')).not.toBeDisabled()
    })

    it('should render with error styling', () => {
      render(<LuxeInput label="Email" error="Invalid" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<LuxeInput placeholder="Enter your name" />)
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('should support email type', () => {
      render(<LuxeInput type="email" label="Email" />)
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    })

    it('should support password type', () => {
      render(<LuxeInput type="password" label="Password" />)
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    })

    it('should support number type', () => {
      render(<LuxeInput type="number" label="Age" />)
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number')
    })

    it('should support tel type', () => {
      render(<LuxeInput type="tel" label="Phone" />)
      expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel')
    })
  })

  describe('Accessibility', () => {
    it('should have textbox role', () => {
      render(<LuxeInput />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should associate label with input', () => {
      render(<LuxeInput label="Username" />)
      const input = screen.getByLabelText('Username')
      expect(input).toBeInTheDocument()
    })

    it('should render error with alert role', () => {
      render(<LuxeInput error="Error message" />)
      expect(screen.getByRole('alert')).toHaveTextContent('Error message')
    })

    it('should support aria-label', () => {
      render(<LuxeInput aria-label="Search field" />)
      expect(screen.getByRole('textbox', { name: 'Search field' })).toBeInTheDocument()
    })

    it('should support aria-required', () => {
      render(<LuxeInput label="Email" aria-required="true" required />)
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('HTML Attributes', () => {
    it('should support required attribute', () => {
      render(<LuxeInput label="Email" required />)
      expect(screen.getByLabelText('Email')).toBeRequired()
    })

    it('should support maxLength attribute', () => {
      render(<LuxeInput label="Code" maxLength={6} />)
      expect(screen.getByLabelText('Code')).toHaveAttribute('maxLength', '6')
    })

    it('should support pattern attribute', () => {
      render(<LuxeInput label="Code" pattern="[0-9]{6}" />)
      expect(screen.getByLabelText('Code')).toHaveAttribute('pattern', '[0-9]{6}')
    })

    it('should support autoComplete attribute', () => {
      render(<LuxeInput label="Email" autoComplete="email" />)
      expect(screen.getByLabelText('Email')).toHaveAttribute('autoComplete', 'email')
    })
  })

  describe('Full Width', () => {
    it('should render full width input', () => {
      render(<LuxeInput label="Email" fullWidth />)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('should not be full width by default', () => {
      render(<LuxeInput label="Email" />)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })
  })
})
