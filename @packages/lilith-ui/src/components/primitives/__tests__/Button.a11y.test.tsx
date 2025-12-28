/**
 * Button Component - Accessibility Tests
 *
 * Tests ARIA attributes, keyboard navigation, and loading states
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@transftw/theme-provider';
import { Button } from '../Button';

// Wrap components with ThemeProvider for tests
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialTheme="luxe">{ui}</ThemeProvider>);
};

describe('Button - Accessibility', () => {
  describe('ARIA Attributes', () => {
    test('applies aria-label when provided', () => {
      renderWithTheme(
        <Button aria-label="Custom label">Click me</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    test('applies aria-describedby when provided', () => {
      renderWithTheme(
        <>
          <Button aria-describedby="description">Click me</Button>
          <div id="description">This button does something</div>
        </>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    test('sets aria-busy when loading prop is true', () => {
      renderWithTheme(
        <Button loading>Submitting...</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    test('sets aria-busy when aria-busy prop is true', () => {
      renderWithTheme(
        <Button aria-busy={true}>Processing...</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    test('sets aria-disabled when disabled', () => {
      renderWithTheme(
        <Button disabled>Disabled button</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    test('sets aria-disabled when loading', () => {
      renderWithTheme(
        <Button loading>Loading...</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    test('can be activated with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithTheme(
        <Button onClick={handleClick}>Press Enter</Button>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('can be activated with Space key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithTheme(
        <Button onClick={handleClick}>Press Space</Button>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('is not activated when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithTheme(
        <Button disabled onClick={handleClick}>Disabled</Button>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).not.toHaveBeenCalled();
    });

    test('is not activated when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      renderWithTheme(
        <Button loading onClick={handleClick}>Loading</Button>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon Accessibility', () => {
    test('sets aria-hidden on icon wrapper', () => {
      const { container } = renderWithTheme(
        <Button icon={<span data-testid="icon">🔥</span>}>
          With Icon
        </Button>
      );

      const iconWrapper = container.querySelector('span[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
    });

    test('icon does not interfere with button label', () => {
      renderWithTheme(
        <Button icon={<span>🔥</span>} aria-label="Fire button">
          Action
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Fire button' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('disables button when loading', () => {
      renderWithTheme(
        <Button loading>Submit</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('combines loading with disabled state', () => {
      renderWithTheme(
        <Button loading disabled>Submit</Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });
});
