import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { AnnouncementBar } from './AnnouncementBar'

describe('AnnouncementBar', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Rendering', () => {
    it('should render with message', () => {
      render(<AnnouncementBar message="Test announcement" />)
      expect(screen.getByText('Test announcement')).toBeInTheDocument()
    })

    it('should render with banner role', () => {
      render(<AnnouncementBar message="Test" />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should render all variants correctly', () => {
      const { rerender } = render(<AnnouncementBar message="Default" variant="default" />)
      expect(screen.getByText('Default')).toBeInTheDocument()

      rerender(<AnnouncementBar message="Primary" variant="primary" />)
      expect(screen.getByText('Primary')).toBeInTheDocument()

      rerender(<AnnouncementBar message="Secondary" variant="secondary" />)
      expect(screen.getByText('Secondary')).toBeInTheDocument()

      rerender(<AnnouncementBar message="Info" variant="info" />)
      expect(screen.getByText('Info')).toBeInTheDocument()

      rerender(<AnnouncementBar message="Warning" variant="warning" />)
      expect(screen.getByText('Warning')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<AnnouncementBar message="Custom" className="custom-class" />)
      expect(screen.getByRole('banner')).toHaveClass('custom-class')
    })

    it('should render close button', () => {
      render(<AnnouncementBar message="Test" />)
      expect(screen.getByLabelText('Dismiss announcement')).toBeInTheDocument()
    })
  })

  describe('CTA Button', () => {
    it('should not render CTA without ctaText', () => {
      render(<AnnouncementBar message="No CTA" />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^(?!.*Dismiss).*$/ })).not.toBeInTheDocument()
    })

    it('should render CTA button with text', () => {
      render(<AnnouncementBar message="Test" ctaText="Learn More" />)
      expect(screen.getByText('Learn More')).toBeInTheDocument()
    })

    it('should render CTA as link with href', () => {
      render(
        <AnnouncementBar
          message="Test"
          ctaText="Visit"
          ctaHref="https://example.com"
        />
      )
      const link = screen.getByRole('link', { name: /Visit/ })
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should render CTA as button with onClick', async () => {
      const handleCtaClick = vi.fn()
      const user = userEvent.setup()

      render(
        <AnnouncementBar
          message="Test"
          ctaText="Action"
          onCtaClick={handleCtaClick}
        />
      )

      await user.click(screen.getByText('Action'))
      expect(handleCtaClick).toHaveBeenCalledTimes(1)
    })

    it('should prefer href over onClick', () => {
      const handleCtaClick = vi.fn()

      render(
        <AnnouncementBar
          message="Test"
          ctaText="Link"
          ctaHref="https://example.com"
          onCtaClick={handleCtaClick}
        />
      )

      const element = screen.getByText('Link')
      expect(element.tagName).toBe('A')
    })

    it('should show external link icon with href', () => {
      render(
        <AnnouncementBar
          message="Test"
          ctaText="External"
          ctaHref="https://example.com"
        />
      )
      const link = screen.getByRole('link', { name: /External/ })
      expect(link.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Dismissal Behavior', () => {
    it('should dismiss when close button is clicked', async () => {
      const user = userEvent.setup()

      render(<AnnouncementBar message="Dismissible" />)
      expect(screen.getByText('Dismissible')).toBeInTheDocument()

      await user.click(screen.getByLabelText('Dismiss announcement'))
      expect(screen.queryByText('Dismissible')).not.toBeInTheDocument()
    })

    it('should store dismissal in localStorage', async () => {
      const user = userEvent.setup()

      render(<AnnouncementBar message="Test" storageKey="test-key" />)
      await user.click(screen.getByLabelText('Dismiss announcement'))

      const stored = localStorage.getItem('test-key')
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toHaveProperty('timestamp')
    })

    it('should not show if previously dismissed and within duration', () => {
      const now = Date.now()
      localStorage.setItem(
        'test-dismissal',
        JSON.stringify({ timestamp: now })
      )

      render(
        <AnnouncementBar
          message="Dismissed"
          storageKey="test-dismissal"
          dismissDuration={7}
        />
      )

      expect(screen.queryByText('Dismissed')).not.toBeInTheDocument()
    })

    it('should show if dismissal has expired', () => {
      const sevenDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000
      localStorage.setItem(
        'test-expired',
        JSON.stringify({ timestamp: sevenDaysAgo })
      )

      render(
        <AnnouncementBar
          message="Expired"
          storageKey="test-expired"
          dismissDuration={7}
        />
      )

      expect(screen.getByText('Expired')).toBeInTheDocument()
    })

    it('should show on every page load with dismissDuration=0', () => {
      localStorage.setItem(
        'session-only',
        JSON.stringify({ timestamp: Date.now() })
      )

      render(
        <AnnouncementBar
          message="Session only"
          storageKey="session-only"
          dismissDuration={0}
        />
      )

      expect(screen.getByText('Session only')).toBeInTheDocument()
    })

    it('should handle invalid localStorage data', () => {
      localStorage.setItem('invalid-data', 'not-json')

      render(
        <AnnouncementBar message="Invalid data" storageKey="invalid-data" />
      )

      expect(screen.getByText('Invalid data')).toBeInTheDocument()
    })
  })

  describe('Always Show Behavior', () => {
    it('should always show when alwaysShow is true', () => {
      localStorage.setItem(
        'always-show-key',
        JSON.stringify({ timestamp: Date.now() })
      )

      render(
        <AnnouncementBar
          message="Always visible"
          storageKey="always-show-key"
          alwaysShow={true}
        />
      )

      expect(screen.getByText('Always visible')).toBeInTheDocument()
    })

    it('should not store dismissal when alwaysShow is true', async () => {
      const user = userEvent.setup()

      render(
        <AnnouncementBar
          message="Always show"
          storageKey="test-always"
          alwaysShow={true}
        />
      )

      await user.click(screen.getByLabelText('Dismiss announcement'))

      const stored = localStorage.getItem('test-always')
      expect(stored).toBeNull()
    })

    it('should hide after dismissal even with alwaysShow', async () => {
      const user = userEvent.setup()

      render(
        <AnnouncementBar message="Test" alwaysShow={true} />
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
      await user.click(screen.getByLabelText('Dismiss announcement'))
      expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have banner role', () => {
      render(<AnnouncementBar message="Test" />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should have accessible close button', () => {
      render(<AnnouncementBar message="Test" />)
      expect(screen.getByLabelText('Dismiss announcement')).toBeInTheDocument()
      expect(screen.getByTitle('Dismiss')).toBeInTheDocument()
    })

    it('should support keyboard navigation on close button', () => {
      render(<AnnouncementBar message="Test" />)
      const closeButton = screen.getByLabelText('Dismiss announcement')
      closeButton.focus()
      expect(closeButton).toHaveFocus()
    })

    it('should support keyboard navigation on CTA', () => {
      render(
        <AnnouncementBar
          message="Test"
          ctaText="Action"
          onCtaClick={() => {}}
        />
      )
      const cta = screen.getByText('Action')
      cta.focus()
      expect(cta).toHaveFocus()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', async () => {
      const handleCtaClick = vi.fn()
      const user = userEvent.setup()

      render(
        <AnnouncementBar
          message="Complex announcement"
          ctaText="Take Action"
          onCtaClick={handleCtaClick}
          variant="primary"
          storageKey="complex-test"
          dismissDuration={14}
          className="custom-class"
        />
      )

      expect(screen.getByText('Complex announcement')).toBeInTheDocument()
      expect(screen.getByText('Take Action')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toHaveClass('custom-class')

      await user.click(screen.getByText('Take Action'))
      expect(handleCtaClick).toHaveBeenCalledTimes(1)

      await user.click(screen.getByLabelText('Dismiss announcement'))
      expect(screen.queryByText('Complex announcement')).not.toBeInTheDocument()
    })

    it('should handle variant with CTA and link', () => {
      render(
        <AnnouncementBar
          message="Warning with link"
          variant="warning"
          ctaText="Learn More"
          ctaHref="https://example.com"
        />
      )

      expect(screen.getByText('Warning with link')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty CTA text with href', () => {
      render(
        <AnnouncementBar
          message="Test"
          ctaText=""
          ctaHref="https://example.com"
        />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      // Component renders CTA when href is provided, even if text is empty
      // This allows for icon-only CTAs
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://example.com')
    })

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(500)
      render(<AnnouncementBar message={longMessage} />)
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('should handle special characters in storageKey', async () => {
      const user = userEvent.setup()

      render(
        <AnnouncementBar
          message="Test"
          storageKey="special-key!@#$%"
        />
      )

      await user.click(screen.getByLabelText('Dismiss announcement'))
      expect(localStorage.getItem('special-key!@#$%')).toBeTruthy()
    })

    it('should handle dismissDuration of 0', () => {
      render(
        <AnnouncementBar
          message="Session only"
          dismissDuration={0}
        />
      )
      expect(screen.getByText('Session only')).toBeInTheDocument()
    })

    it('should handle very large dismissDuration', () => {
      render(
        <AnnouncementBar
          message="Long duration"
          dismissDuration={365}
        />
      )
      expect(screen.getByText('Long duration')).toBeInTheDocument()
    })
  })
})
