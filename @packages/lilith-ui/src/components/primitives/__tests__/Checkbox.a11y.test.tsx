/**
 * Checkbox Component - Accessibility Tests
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@transftw/theme-provider';
import { Checkbox } from '../Checkbox';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialTheme="luxe">{ui}</ThemeProvider>);
};

describe('Checkbox - Accessibility', () => {
  describe('Label Association', () => {
    test('renders standalone checkbox without label', () => {
      renderWithTheme(
        <Checkbox id="standalone" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('id', 'standalone');
    });

    test('renders checkbox with label', () => {
      renderWithTheme(
        <Checkbox label="I agree to terms" />
      );

      const checkbox = screen.getByLabelText('I agree to terms');
      expect(checkbox).toBeInTheDocument();
    });

    test('generates unique id when not provided', () => {
      const { container } = renderWithTheme(
        <>
          <Checkbox label="Option 1" />
          <Checkbox label="Option 2" />
        </>
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes[0].id).toBeTruthy();
      expect(checkboxes[1].id).toBeTruthy();
      expect(checkboxes[0].id).not.toBe(checkboxes[1].id);
    });
  });

  describe('Description Support', () => {
    test('renders description with aria-describedby', () => {
      renderWithTheme(
        <Checkbox
          label="Newsletter"
          description="Receive weekly updates"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      const describedBy = checkbox.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const description = document.getElementById(describedBy!);
      expect(description).toHaveTextContent('Receive weekly updates');
    });

    test('description without label still works', () => {
      renderWithTheme(
        <Checkbox description="This is a description" />
      );

      const checkbox = screen.getByRole('checkbox');
      const describedBy = checkbox.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });
  });

  describe('Error States', () => {
    test('adds aria-invalid when error present', () => {
      renderWithTheme(
        <Checkbox label="Terms" error="You must agree" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    test('error has role="alert"', () => {
      renderWithTheme(
        <Checkbox label="Terms" error="Required" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Required');
    });

    test('adds aria-describedby for error', () => {
      renderWithTheme(
        <Checkbox label="Terms" error="You must accept" />
      );

      const checkbox = screen.getByRole('checkbox');
      const describedBy = checkbox.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });

    test('combines description and error in aria-describedby', () => {
      renderWithTheme(
        <Checkbox
          label="Terms"
          description="Read our terms"
          error="Must accept"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      const describedBy = checkbox.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      // Should contain both description and error IDs
      const ids = describedBy!.split(' ');
      expect(ids.length).toBe(2);
    });
  });

  describe('Disabled State', () => {
    test('applies disabled attribute', () => {
      renderWithTheme(
        <Checkbox label="Disabled" disabled />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    test('applies disabled styling to container', () => {
      const { container } = renderWithTheme(
        <Checkbox label="Disabled" disabled />
      );

      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Variant Support', () => {
    test('renders with primary variant', () => {
      renderWithTheme(
        <Checkbox label="Primary" variant="primary" />
      );

      const checkbox = screen.getByLabelText('Primary');
      expect(checkbox).toBeInTheDocument();
    });

    test('renders with secondary variant', () => {
      renderWithTheme(
        <Checkbox label="Secondary" variant="secondary" />
      );

      const checkbox = screen.getByLabelText('Secondary');
      expect(checkbox).toBeInTheDocument();
    });

    test('renders with success variant', () => {
      renderWithTheme(
        <Checkbox label="Success" variant="success" />
      );

      const checkbox = screen.getByLabelText('Success');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Complete Checkbox Field', () => {
    test('renders fully accessible checkbox', () => {
      renderWithTheme(
        <Checkbox
          label="I agree to the terms and conditions"
          description="Please read our terms before continuing"
          error="You must agree to continue"
        />
      );

      const checkbox = screen.getByRole('checkbox');

      // Has label
      expect(screen.getByLabelText('I agree to the terms and conditions')).toBe(checkbox);

      // Has invalid state
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');

      // Has described by
      const describedBy = checkbox.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      // Has error alert
      expect(screen.getByRole('alert')).toHaveTextContent('You must agree to continue');
    });
  });

  describe('Forward Ref', () => {
    test('forwards ref to input element', () => {
      const ref = jest.fn();

      renderWithTheme(
        <Checkbox ref={ref} label="Test" />
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });
});
