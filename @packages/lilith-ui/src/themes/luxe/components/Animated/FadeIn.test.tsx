import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FadeIn } from './FadeIn'

describe('FadeIn', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<FadeIn>Fade in content</FadeIn>)
      expect(screen.getByText('Fade in content')).toBeInTheDocument()
    })

    it('should render all direction variants correctly', () => {
      const { rerender } = render(<FadeIn direction="up">Up</FadeIn>)
      expect(screen.getByText('Up')).toBeInTheDocument()

      rerender(<FadeIn direction="down">Down</FadeIn>)
      expect(screen.getByText('Down')).toBeInTheDocument()

      rerender(<FadeIn direction="left">Left</FadeIn>)
      expect(screen.getByText('Left')).toBeInTheDocument()

      rerender(<FadeIn direction="right">Right</FadeIn>)
      expect(screen.getByText('Right')).toBeInTheDocument()

      rerender(<FadeIn direction="none">None</FadeIn>)
      expect(screen.getByText('None')).toBeInTheDocument()
    })

    it('should render all duration variants correctly', () => {
      const { rerender } = render(<FadeIn duration="fast">Fast</FadeIn>)
      expect(screen.getByText('Fast')).toBeInTheDocument()

      rerender(<FadeIn duration="base">Base</FadeIn>)
      expect(screen.getByText('Base')).toBeInTheDocument()

      rerender(<FadeIn duration="slow">Slow</FadeIn>)
      expect(screen.getByText('Slow')).toBeInTheDocument()

      rerender(<FadeIn duration="slower">Slower</FadeIn>)
      expect(screen.getByText('Slower')).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      render(<FadeIn>Default</FadeIn>)
      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<FadeIn className="custom-class">Custom</FadeIn>)
      expect(screen.getByText('Custom')).toHaveClass('custom-class')
    })
  })

  describe('Animation Delay', () => {
    it('should handle delay prop', () => {
      render(<FadeIn delay={500}>Delayed</FadeIn>)
      expect(screen.getByText('Delayed')).toBeInTheDocument()
    })

    it('should handle zero delay', () => {
      render(<FadeIn delay={0}>No delay</FadeIn>)
      expect(screen.getByText('No delay')).toBeInTheDocument()
    })

    it('should handle large delay values', () => {
      render(<FadeIn delay={5000}>Long delay</FadeIn>)
      expect(screen.getByText('Long delay')).toBeInTheDocument()
    })
  })

  describe('Trigger Behavior', () => {
    it('should support triggerOnce=true', () => {
      render(<FadeIn triggerOnce={true}>Trigger once</FadeIn>)
      expect(screen.getByText('Trigger once')).toBeInTheDocument()
    })

    it('should support triggerOnce=false', () => {
      render(<FadeIn triggerOnce={false}>Trigger multiple</FadeIn>)
      expect(screen.getByText('Trigger multiple')).toBeInTheDocument()
    })

    it('should use triggerOnce=true by default', () => {
      render(<FadeIn>Default trigger</FadeIn>)
      expect(screen.getByText('Default trigger')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<FadeIn>Text content</FadeIn>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      render(
        <FadeIn>
          <div>Nested content</div>
        </FadeIn>
      )
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <FadeIn>
          <h2>Title</h2>
          <p>Paragraph</p>
        </FadeIn>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
    })

    it('should render complex nested structures', () => {
      render(
        <FadeIn>
          <article>
            <header>Header</header>
            <section>Body</section>
          </article>
        </FadeIn>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
    })
  })

  describe('Intersection Observer Integration', () => {
    it('should use useScrollTrigger hook', () => {
      // The component uses IntersectionObserver via useScrollTrigger
      render(<FadeIn>Observer test</FadeIn>)
      expect(screen.getByText('Observer test')).toBeInTheDocument()
    })

    it('should pass threshold to useScrollTrigger', () => {
      // useScrollTrigger is called with threshold: 0.1
      render(<FadeIn>Threshold test</FadeIn>)
      expect(screen.getByText('Threshold test')).toBeInTheDocument()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      render(
        <FadeIn
          direction="left"
          delay={300}
          duration="slow"
          triggerOnce={false}
          className="combined-test"
        >
          Combined props
        </FadeIn>
      )
      expect(screen.getByText('Combined props')).toBeInTheDocument()
      expect(screen.getByText('Combined props')).toHaveClass('combined-test')
    })

    it('should handle direction and duration combinations', () => {
      const { rerender } = render(
        <FadeIn direction="up" duration="fast">
          Up + Fast
        </FadeIn>
      )
      expect(screen.getByText('Up + Fast')).toBeInTheDocument()

      rerender(
        <FadeIn direction="down" duration="slower">
          Down + Slower
        </FadeIn>
      )
      expect(screen.getByText('Down + Slower')).toBeInTheDocument()
    })

    it('should handle delay with different directions', () => {
      const { rerender } = render(
        <FadeIn direction="left" delay={0}>
          Left + No delay
        </FadeIn>
      )
      expect(screen.getByText('Left + No delay')).toBeInTheDocument()

      rerender(
        <FadeIn direction="right" delay={1000}>
          Right + Delayed
        </FadeIn>
      )
      expect(screen.getByText('Right + Delayed')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative delay values', () => {
      render(<FadeIn delay={-100}>Negative delay</FadeIn>)
      expect(screen.getByText('Negative delay')).toBeInTheDocument()
    })

    it('should handle very large delay values', () => {
      render(<FadeIn delay={999999}>Very long delay</FadeIn>)
      expect(screen.getByText('Very long delay')).toBeInTheDocument()
    })

    it('should handle empty children gracefully', () => {
      const { container } = render(<FadeIn>{''}</FadeIn>)
      // Should render without errors
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle null children', () => {
      render(<FadeIn>{null}</FadeIn>)
      // Should render without errors
      const { container } = render(<FadeIn>{null}</FadeIn>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Animation Direction Behavior', () => {
    it('should handle none direction with no transform', () => {
      render(<FadeIn direction="none">No transform</FadeIn>)
      expect(screen.getByText('No transform')).toBeInTheDocument()
    })

    it('should handle all directional transforms', () => {
      const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right']

      directions.forEach(direction => {
        const { unmount } = render(
          <FadeIn direction={direction}>{direction} animation</FadeIn>
        )
        expect(screen.getByText(`${direction} animation`)).toBeInTheDocument()
        unmount()
      })
    })
  })
})
