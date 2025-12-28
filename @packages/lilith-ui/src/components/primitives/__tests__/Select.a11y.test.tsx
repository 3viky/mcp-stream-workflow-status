/**
 * Select Component - Accessibility Tests
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@transftw/theme-provider';
import { Select } from '../Select';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialTheme="luxe">{ui}</ThemeProvider>);
};

const testOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select - Accessibility', () => {
  describe('Label Association', () => {
    test('associates label with select via htmlFor', () => {
      renderWithTheme(
        <Select label="Choose Option" options={testOptions} />
      );

      const select = screen.getByLabelText('Choose Option');
      expect(select).toBeInTheDocument();
    });

    test('uses labelId for aria-labelledby when provided', () => {
      renderWithTheme(
        <>
          <span id="custom-label">Custom Label</span>
          <Select labelId="custom-label" options={testOptions} />
        </>
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-labelledby', 'custom-label');
    });
  });

  describe('Required State', () => {
    test('adds aria-required when required', () => {
      renderWithTheme(
        <Select label="Country" options={testOptions} required />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-required', 'true');
    });

    test('displays required indicator', () => {
      const { container } = renderWithTheme(
        <Select label="State" options={testOptions} required />
      );

      const indicator = container.querySelector('span[aria-label="required"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    test('adds aria-invalid when error present', () => {
      renderWithTheme(
        <Select label="Country" options={testOptions} error="Please select a country" />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    test('error has role="alert"', () => {
      renderWithTheme(
        <Select label="Country" options={testOptions} error="Required field" />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Required field');
    });

    test('adds aria-describedby for error', () => {
      renderWithTheme(
        <Select label="Country" options={testOptions} error="Invalid selection" />
      );

      const select = screen.getByRole('combobox');
      const describedBy = select.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });
  });

  describe('Description Support', () => {
    test('renders description with aria-describedby', () => {
      renderWithTheme(
        <Select
          label="Country"
          description="Select your country of residence"
          options={testOptions}
        />
      );

      const select = screen.getByRole('combobox');
      const describedBy = select.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const description = document.getElementById(describedBy!);
      expect(description).toHaveTextContent('Select your country of residence');
    });
  });

  describe('Options Rendering', () => {
    test('renders options from array', () => {
      renderWithTheme(
        <Select label="Choice" options={testOptions} />
      );

      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
    });

    test('renders placeholder as disabled option', () => {
      renderWithTheme(
        <Select label="Choice" placeholder="Select an option" options={testOptions} />
      );

      const placeholder = screen.getByRole('option', { name: 'Select an option' }) as HTMLOptionElement;
      expect(placeholder).toBeInTheDocument();
      expect(placeholder.disabled).toBe(true);
    });
  });

  describe('Complete Form Field', () => {
    test('renders fully accessible select field', () => {
      renderWithTheme(
        <Select
          label="Country"
          description="Choose your country"
          options={testOptions}
          required
          error="Please select a country"
        />
      );

      const select = screen.getByRole('combobox');

      // Has label
      expect(screen.getByLabelText(/Country/)).toBe(select);

      // Has required
      expect(select).toHaveAttribute('aria-required', 'true');

      // Has invalid state
      expect(select).toHaveAttribute('aria-invalid', 'true');

      // Has error alert
      expect(screen.getByRole('alert')).toHaveTextContent('Please select a country');
    });
  });
});
