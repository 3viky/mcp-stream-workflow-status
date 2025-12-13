/**
 * Textarea Component - Accessibility Tests
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@transftw/theme-provider';
import { Textarea } from '../Textarea';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialTheme="luxe">{ui}</ThemeProvider>);
};

describe('Textarea - Accessibility', () => {
  describe('Label Association', () => {
    test('associates label with textarea via htmlFor', () => {
      renderWithTheme(
        <Textarea label="Comments" />
      );

      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toBeInTheDocument();
    });

    test('uses labelId for aria-labelledby when provided', () => {
      renderWithTheme(
        <>
          <span id="custom-label">Custom Label</span>
          <Textarea labelId="custom-label" />
        </>
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-labelledby', 'custom-label');
    });
  });

  describe('Required State', () => {
    test('adds aria-required when required', () => {
      renderWithTheme(
        <Textarea label="Message" required />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });

    test('displays required indicator', () => {
      const { container } = renderWithTheme(
        <Textarea label="Bio" required />
      );

      const indicator = container.querySelector('span[aria-label="required"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('*');
    });
  });

  describe('Error States', () => {
    test('adds aria-invalid when error present', () => {
      renderWithTheme(
        <Textarea label="Message" error="Message is too short" />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    test('error has role="alert"', () => {
      renderWithTheme(
        <Textarea label="Message" error="Required field" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Required field');
    });

    test('adds aria-describedby for error', () => {
      renderWithTheme(
        <Textarea label="Message" error="Too long" />
      );

      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const error = document.getElementById(describedBy!);
      expect(error).toHaveTextContent('Too long');
    });
  });

  describe('Description Support', () => {
    test('renders description with aria-describedby', () => {
      renderWithTheme(
        <Textarea
          label="Bio"
          description="Tell us about yourself (max 500 characters)"
        />
      );

      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const description = document.getElementById(describedBy!);
      expect(description).toHaveTextContent('Tell us about yourself (max 500 characters)');
    });

    test('combines description and error in aria-describedby', () => {
      renderWithTheme(
        <Textarea
          label="Bio"
          description="Max 500 characters"
          error="Too many characters"
        />
      );

      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      // Should have both IDs
      const ids = describedBy!.split(' ');
      expect(ids.length).toBe(2);
    });
  });

  describe('Rows Attribute', () => {
    test('applies default rows of 5', () => {
      renderWithTheme(
        <Textarea label="Message" />
      );

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.rows).toBe(5);
    });

    test('applies custom rows', () => {
      renderWithTheme(
        <Textarea label="Message" rows={10} />
      );

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.rows).toBe(10);
    });
  });

  describe('Complete Form Field', () => {
    test('renders fully accessible textarea field', () => {
      renderWithTheme(
        <Textarea
          label="Message"
          description="Enter your message (max 1000 characters)"
          required
          error="Message is required"
          rows={8}
        />
      );

      const textarea = screen.getByRole('textbox');

      // Has label
      expect(screen.getByLabelText(/Message/)).toBe(textarea);

      // Has required
      expect(textarea).toHaveAttribute('aria-required', 'true');

      // Has invalid state
      expect(textarea).toHaveAttribute('aria-invalid', 'true');

      // Has rows
      expect((textarea as HTMLTextAreaElement).rows).toBe(8);

      // Has error alert
      expect(screen.getByRole('alert')).toHaveTextContent('Message is required');
    });
  });

  describe('Forward Ref', () => {
    test('forwards ref to textarea element', () => {
      const ref = jest.fn();

      renderWithTheme(
        <Textarea ref={ref} label="Message" />
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });
  });
});
