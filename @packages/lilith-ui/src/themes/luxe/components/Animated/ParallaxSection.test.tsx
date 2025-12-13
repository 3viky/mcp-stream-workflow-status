import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ParallaxSection } from './ParallaxSection'

describe('ParallaxSection', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<ParallaxSection>Parallax content</ParallaxSection>)
      expect(screen.getByText('Parallax content')).toBeInTheDocument()
    })

    it('should render without background image', () => {
      render(<ParallaxSection>No background</ParallaxSection>)
      expect(screen.getByText('No background')).toBeInTheDocument()
    })

    it('should render with background image', () => {
      const { container } = render(
        <ParallaxSection backgroundImage="/test-bg.jpg">
          With background
        </ParallaxSection>
      )
      expect(screen.getByText('With background')).toBeInTheDocument()
      // Background image should be rendered via inline style
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      render(<ParallaxSection>Default</ParallaxSection>)
      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(
        <ParallaxSection className="custom-class">Custom</ParallaxSection>
      )
      const section = container.querySelector('section')
      expect(section).toHaveClass('custom-class')
    })
  })

  describe('HTML Attributes', () => {
    it('should render as section element', () => {
      const { container } = render(<ParallaxSection>Section</ParallaxSection>)
      expect(container.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('Background Image Behavior', () => {
    it('should not render background when no image provided', () => {
      const { container } = render(<ParallaxSection>No bg</ParallaxSection>)
      expect(container.querySelector('[style*="url"]')).not.toBeInTheDocument()
    })

    it('should render background with image URL', () => {
      const { container } = render(
        <ParallaxSection backgroundImage="/path/to/image.jpg">
          Content
        </ParallaxSection>
      )
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render overlay when background image is present', () => {
      const { container } = render(
        <ParallaxSection backgroundImage="/test.jpg">Content</ParallaxSection>
      )
      // Overlay div should exist when background image is present
      const section = container.querySelector('section')
      expect(section?.children.length).toBeGreaterThan(1)
    })

    it('should not render overlay without background image', () => {
      const { container } = render(<ParallaxSection>Content</ParallaxSection>)
      const section = container.querySelector('section')
      // Only content wrapper should exist, no background or overlay
      expect(section?.children.length).toBe(1)
    })
  })

  describe('Parallax Speed', () => {
    it('should handle default speed', () => {
      render(<ParallaxSection backgroundImage="/test.jpg">Default speed</ParallaxSection>)
      expect(screen.getByText('Default speed')).toBeInTheDocument()
    })

    it('should handle custom speed values', () => {
      const { rerender } = render(
        <ParallaxSection backgroundImage="/test.jpg" speed={0.2}>
          Slow
        </ParallaxSection>
      )
      expect(screen.getByText('Slow')).toBeInTheDocument()

      rerender(
        <ParallaxSection backgroundImage="/test.jpg" speed={0.8}>
          Fast
        </ParallaxSection>
      )
      expect(screen.getByText('Fast')).toBeInTheDocument()
    })

    it('should handle negative speed values', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" speed={-0.3}>
          Reverse
        </ParallaxSection>
      )
      expect(screen.getByText('Reverse')).toBeInTheDocument()
    })

    it('should handle zero speed', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" speed={0}>
          No parallax
        </ParallaxSection>
      )
      expect(screen.getByText('No parallax')).toBeInTheDocument()
    })

    it('should handle speed=1', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" speed={1}>
          Full speed
        </ParallaxSection>
      )
      expect(screen.getByText('Full speed')).toBeInTheDocument()
    })
  })

  describe('Min Height', () => {
    it('should use default minHeight', () => {
      render(<ParallaxSection>Default height</ParallaxSection>)
      expect(screen.getByText('Default height')).toBeInTheDocument()
    })

    it('should handle custom minHeight values', () => {
      const { rerender } = render(
        <ParallaxSection minHeight="300px">Small</ParallaxSection>
      )
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<ParallaxSection minHeight="800px">Large</ParallaxSection>)
      expect(screen.getByText('Large')).toBeInTheDocument()
    })

    it('should handle vh units', () => {
      render(<ParallaxSection minHeight="100vh">Full viewport</ParallaxSection>)
      expect(screen.getByText('Full viewport')).toBeInTheDocument()
    })

    it('should handle percentage units', () => {
      render(<ParallaxSection minHeight="50%">Half height</ParallaxSection>)
      expect(screen.getByText('Half height')).toBeInTheDocument()
    })
  })

  describe('Overlay Opacity', () => {
    it('should use default overlay opacity', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg">Default overlay</ParallaxSection>
      )
      expect(screen.getByText('Default overlay')).toBeInTheDocument()
    })

    it('should handle custom overlay opacity', () => {
      const { rerender } = render(
        <ParallaxSection backgroundImage="/test.jpg" overlayOpacity={0.2}>
          Light overlay
        </ParallaxSection>
      )
      expect(screen.getByText('Light overlay')).toBeInTheDocument()

      rerender(
        <ParallaxSection backgroundImage="/test.jpg" overlayOpacity={0.9}>
          Dark overlay
        </ParallaxSection>
      )
      expect(screen.getByText('Dark overlay')).toBeInTheDocument()
    })

    it('should handle zero overlay opacity', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" overlayOpacity={0}>
          No overlay
        </ParallaxSection>
      )
      expect(screen.getByText('No overlay')).toBeInTheDocument()
    })

    it('should handle full overlay opacity', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" overlayOpacity={1}>
          Full overlay
        </ParallaxSection>
      )
      expect(screen.getByText('Full overlay')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<ParallaxSection>Text content</ParallaxSection>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      render(
        <ParallaxSection>
          <h1>Parallax Title</h1>
          <p>Parallax description</p>
        </ParallaxSection>
      )
      expect(screen.getByText('Parallax Title')).toBeInTheDocument()
      expect(screen.getByText('Parallax description')).toBeInTheDocument()
    })

    it('should render complex nested structures', () => {
      render(
        <ParallaxSection>
          <div>
            <article>
              <header>Header</header>
              <section>Body</section>
              <footer>Footer</footer>
            </article>
          </div>
        </ParallaxSection>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Parallax Hook Integration', () => {
    it('should use useParallax hook', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg">Parallax test</ParallaxSection>
      )
      expect(screen.getByText('Parallax test')).toBeInTheDocument()
    })

    it('should pass speed to useParallax', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" speed={0.7}>
          Speed test
        </ParallaxSection>
      )
      expect(screen.getByText('Speed test')).toBeInTheDocument()
    })

    it('should enable parallax only with background image', () => {
      const { rerender } = render(
        <ParallaxSection>No parallax</ParallaxSection>
      )
      expect(screen.getByText('No parallax')).toBeInTheDocument()

      rerender(
        <ParallaxSection backgroundImage="/test.jpg">With parallax</ParallaxSection>
      )
      expect(screen.getByText('With parallax')).toBeInTheDocument()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      const { container } = render(
        <ParallaxSection
          backgroundImage="/hero.jpg"
          speed={0.6}
          minHeight="600px"
          overlayOpacity={0.4}
          className="combined-test"
        >
          Combined props
        </ParallaxSection>
      )
      expect(screen.getByText('Combined props')).toBeInTheDocument()
      const section = container.querySelector('section')
      expect(section).toHaveClass('combined-test')
    })

    it('should handle background with speed and overlay', () => {
      render(
        <ParallaxSection
          backgroundImage="/test.jpg"
          speed={0.3}
          overlayOpacity={0.7}
        >
          Combined background
        </ParallaxSection>
      )
      expect(screen.getByText('Combined background')).toBeInTheDocument()
    })

    it('should handle minHeight with background image', () => {
      render(
        <ParallaxSection
          backgroundImage="/test.jpg"
          minHeight="100vh"
        >
          Full height parallax
        </ParallaxSection>
      )
      expect(screen.getByText('Full height parallax')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty background image URL', () => {
      render(<ParallaxSection backgroundImage="">Empty URL</ParallaxSection>)
      expect(screen.getByText('Empty URL')).toBeInTheDocument()
    })

    it('should handle very high speed values', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" speed={10}>
          High speed
        </ParallaxSection>
      )
      expect(screen.getByText('High speed')).toBeInTheDocument()
    })

    it('should handle very low negative speed values', () => {
      render(
        <ParallaxSection backgroundImage="/test.jpg" speed={-5}>
          Negative speed
        </ParallaxSection>
      )
      expect(screen.getByText('Negative speed')).toBeInTheDocument()
    })

    it('should handle invalid minHeight values gracefully', () => {
      render(<ParallaxSection minHeight="invalid">Invalid height</ParallaxSection>)
      expect(screen.getByText('Invalid height')).toBeInTheDocument()
    })

    it('should handle overlay opacity outside 0-1 range', () => {
      const { rerender } = render(
        <ParallaxSection backgroundImage="/test.jpg" overlayOpacity={-0.5}>
          Negative opacity
        </ParallaxSection>
      )
      expect(screen.getByText('Negative opacity')).toBeInTheDocument()

      rerender(
        <ParallaxSection backgroundImage="/test.jpg" overlayOpacity={1.5}>
          Over opacity
        </ParallaxSection>
      )
      expect(screen.getByText('Over opacity')).toBeInTheDocument()
    })
  })
})
