/**
 * Input Component - Accessibility Tests
 *
 * Tests form field ARIA attributes, labels, descriptions, and error states
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@transftw/theme-provider';
import { Input } from '../Input';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialTheme="luxe">{ui}</ThemeProvider>);
};

describe('Input - Accessibility', () => {
  describe('ID Generation', () => {
    test('generates unique id when not provided', () => {
      const { container } = renderWithTheme(
        <>
          <Input />
          <Input />
        </>
      );

      const inputs = container.querySelectorAll('input');
      expect(inputs[0].id).toBeTruthy();
      expect(inputs[1].id).toBeTruthy();
      expect(inputs[0].id).not.toBe(inputs[1].id);
    });

    test('uses provided id', () => {
      renderWithTheme(
        <Input id="custom-id" />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Label Association', () => {
    test('associates label with input via htmlFor', () => {
      renderWithTheme(
        <Input label="Username" />
      );

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    test('uses labelId for aria-labelledby when provided', () => {
      renderWithTheme(
        <>
          <span id="custom-label">Custom Label</span>
          <Input labelId="custom-label" />
        </>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-labelledby', 'custom-label');
    });
  });

  describe('Required State', () => {
    test('adds aria-required when required', () => {
      renderWithTheme(
        <Input label="Email" required />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    test('displays required indicator with accessible label', () => {
      const { container } = renderWithTheme(
        <Input label="Password" required />
      );

      const indicator = container.querySelector('span[aria-label="required"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('*');
    });
  });

  describe('Description Support', () => {
    test('adds aria-describedby for description', () => {
      renderWithTheme(
        <Input
          label="Email"
          description="We'll never share your email"
        />
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const description = document.getElementById(describedBy!);
      expect(description).toHaveTextContent("We'll never share your email");
    });

    test('uses custom descriptionId when provided', () => {
      renderWithTheme(
        <>
          <Input descriptionId="custom-desc" />
          <p id="custom-desc">Custom description</p>
        </>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('custom-desc'));
    });
  });

  describe('Error States', () => {
    test('adds aria-invalid when error present', () => {
      renderWithTheme(
        <Input label="Email" error="Invalid email address" />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('adds aria-describedby for error', () => {
      renderWithTheme(
        <Input label="Email" error="Invalid email address" />
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const errorMessage = document.getElementById(describedBy!);
      expect(errorMessage).toHaveTextContent('Invalid email address');
    });

    test('combines description and error in aria-describedby', () => {
      renderWithTheme(
        <Input
          label="Email"
          description="Enter your email"
          error="Invalid format"
        />
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');

      // Should contain both description and error IDs
      expect(describedBy).toBeTruthy();
      const ids = describedBy!.split(' ');
      expect(ids.length).toBe(2);
    });

    test('error has role="alert"', () => {
      renderWithTheme(
        <Input label="Email" error="Invalid email" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Invalid email');
    });

    test('uses custom errorId when provided', () => {
      renderWithTheme(
        <>
          <Input errorId="custom-error" error="Error message" />
          <span id="custom-error">Error message</span>
        </>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('custom-error'));
    });
  });

  describe('Variant Support', () => {
    test('renders with primary variant', () => {
      renderWithTheme(
        <Input label="Primary" variant="primary" />
      );

      const input = screen.getByLabelText('Primary');
      expect(input).toBeInTheDocument();
    });

    test('renders with secondary variant', () => {
      renderWithTheme(
        <Input label="Secondary" variant="secondary" />
      );

      const input = screen.getByLabelText('Secondary');
      expect(input).toBeInTheDocument();
    });

    test('renders with danger variant', () => {
      renderWithTheme(
        <Input label="Danger" variant="danger" />
      );

      const input = screen.getByLabelText('Danger');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Complete Form Field', () => {
    test('renders fully accessible form field', () => {
      renderWithTheme(
        <Input
          id="email-field"
          label="Email Address"
          description="Enter your work email"
          required
          error="Please enter a valid email"
        />
      );

      const input = screen.getByRole('textbox');

      // Has label
      expect(screen.getByLabelText(/Email Address/)).toBe(input);

      // Has required
      expect(input).toHaveAttribute('aria-required', 'true');

      // Has invalid state
      expect(input).toHaveAttribute('aria-invalid', 'true');

      // Has description and error
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      // Has error alert
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email');
    });
  });
});
