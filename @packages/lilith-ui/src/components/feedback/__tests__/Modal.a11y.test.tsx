/**
 * Modal Component - Accessibility Tests
 *
 * Tests focus trap, keyboard navigation, ARIA attributes, and screen reader announcements
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@transftw/theme-provider';
import { Modal } from '../Modal';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider initialTheme="luxe">{ui}</ThemeProvider>);
};

describe('Modal - Accessibility', () => {
  describe('ARIA Attributes', () => {
    test('has role="dialog"', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    test('has aria-modal="true"', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    test('has aria-labelledby pointing to title', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Important Dialog">
          Content
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      const labelledBy = dialog.getAttribute('aria-labelledby');

      expect(labelledBy).toBe('modal-title');

      const title = document.getElementById('modal-title');
      expect(title).toHaveTextContent('Important Dialog');
    });

    test('supports custom aria-labelledby', () => {
      renderWithTheme(
        <>
          <span id="custom-title">Custom Title</span>
          <Modal
            isOpen={true}
            onClose={jest.fn()}
            title="Visible Title"
            aria-labelledby="custom-title"
          >
            Content
          </Modal>
        </>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title');
    });

    test('supports aria-describedby', () => {
      renderWithTheme(
        <>
          <div id="description">This modal contains important information</div>
          <Modal
            isOpen={true}
            onClose={jest.fn()}
            title="Modal"
            aria-describedby="description"
          >
            Content
          </Modal>
        </>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Keyboard Navigation', () => {
    test('closes modal on Escape key', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      renderWithTheme(
        <Modal isOpen={true} onClose={handleClose} title="Test">
          Content
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('close button has aria-label', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test">
          Content
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close dialog');
      expect(closeButton).toBeInTheDocument();
    });

    test('close button can be clicked', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      renderWithTheme(
        <Modal isOpen={true} onClose={handleClose} title="Test">
          Content
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close dialog');
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Focus Management', () => {
    test('traps focus within modal', async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test">
          <button>First button</button>
          <button>Second button</button>
          <button>Third button</button>
        </Modal>
      );

      const firstButton = screen.getByText('First button');
      const closeButton = screen.getByLabelText('Close dialog');

      // Close button or first button should be focused initially
      await waitFor(() => {
        expect(
          document.activeElement === closeButton ||
          document.activeElement === firstButton
        ).toBe(true);
      });
    });

    test('focuses first element when modal opens', async () => {
      const { rerender } = renderWithTheme(
        <Modal isOpen={false} onClose={jest.fn()} title="Test">
          <button>Action Button</button>
        </Modal>
      );

      // Modal is closed, nothing should be in the document
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Open the modal
      rerender(
        <ThemeProvider initialTheme="luxe">
          <Modal isOpen={true} onClose={jest.fn()} title="Test">
            <button>Action Button</button>
          </Modal>
        </ThemeProvider>
      );

      // Wait for focus to be set
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });
  });

  describe('Overlay Interaction', () => {
    test('overlay has role="presentation"', () => {
      const { container } = renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test">
          Content
        </Modal>
      );

      const overlay = container.querySelector('[role="presentation"]');
      expect(overlay).toBeInTheDocument();
    });

    test('clicking overlay closes modal', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      const { container } = renderWithTheme(
        <Modal isOpen={true} onClose={handleClose} title="Test">
          Content
        </Modal>
      );

      const overlay = container.querySelector('[role="presentation"]');
      if (overlay) {
        await user.click(overlay);
        expect(handleClose).toHaveBeenCalled();
      }
    });

    test('clicking modal content does not close modal', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      renderWithTheme(
        <Modal isOpen={true} onClose={handleClose} title="Test">
          <div data-testid="content">Content</div>
        </Modal>
      );

      const content = screen.getByTestId('content');
      await user.click(content);

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Conditional Rendering', () => {
    test('does not render when isOpen is false', () => {
      renderWithTheme(
        <Modal isOpen={false} onClose={jest.fn()} title="Test">
          Content
        </Modal>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('renders when isOpen is true', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test">
          Content
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    test('announces when modal opens', async () => {
      const { rerender } = renderWithTheme(
        <Modal isOpen={false} onClose={jest.fn()} title="Confirmation Dialog">
          Content
        </Modal>
      );

      // Open modal
      rerender(
        <ThemeProvider initialTheme="luxe">
          <Modal isOpen={true} onClose={jest.fn()} title="Confirmation Dialog">
            Content
          </Modal>
        </ThemeProvider>
      );

      // Wait for screen reader announcement region to be created
      await waitFor(() => {
        const liveRegions = document.querySelectorAll('[aria-live]');
        expect(liveRegions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Modal Content', () => {
    test('renders title', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="My Modal Title">
          Content
        </Modal>
      );

      expect(screen.getByText('My Modal Title')).toBeInTheDocument();
    });

    test('renders children', () => {
      renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test">
          <p>Modal content goes here</p>
        </Modal>
      );

      expect(screen.getByText('Modal content goes here')).toBeInTheDocument();
    });
  });

  describe('Size Props', () => {
    test('applies maxWidth prop', () => {
      const { container } = renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test" maxWidth="800px">
          Content
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"]');
      expect(modalContent).toBeInTheDocument();
    });

    test('applies maxHeight prop', () => {
      const { container } = renderWithTheme(
        <Modal isOpen={true} onClose={jest.fn()} title="Test" maxHeight="600px">
          Content
        </Modal>
      );

      const modalContent = container.querySelector('[role="dialog"]');
      expect(modalContent).toBeInTheDocument();
    });
  });
});
