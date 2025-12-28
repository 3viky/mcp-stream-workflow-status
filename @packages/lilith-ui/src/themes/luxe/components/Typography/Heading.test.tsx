import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { LuxeHeading } from './Heading'

describe('LuxeHeading', () => {
  describe('Rendering', () => {
    it('should render with text', () => {
      render(<LuxeHeading>Test heading</LuxeHeading>)
      expect(screen.getByText('Test heading')).toBeInTheDocument()
    })

    it('should render all heading levels correctly', () => {
      const { rerender } = render(<LuxeHeading as="h1">H1</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('H1')

      rerender(<LuxeHeading as="h2">H2</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2')

      rerender(<LuxeHeading as="h3">H3</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('H3')

      rerender(<LuxeHeading as="h4">H4</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('H4')

      rerender(<LuxeHeading as="h5">H5</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('H5')

      rerender(<LuxeHeading as="h6">H6</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('H6')
    })

    it('should render all size variants correctly', () => {
      const { rerender } = render(<LuxeHeading size="sm">Small</LuxeHeading>)
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<LuxeHeading size="base">Base</LuxeHeading>)
      expect(screen.getByText('Base')).toBeInTheDocument()

      rerender(<LuxeHeading size="md">Medium</LuxeHeading>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeHeading size="lg">Large</LuxeHeading>)
      expect(screen.getByText('Large')).toBeInTheDocument()

      rerender(<LuxeHeading size="xl">XL</LuxeHeading>)
      expect(screen.getByText('XL')).toBeInTheDocument()

      rerender(<LuxeHeading size="2xl">2XL</LuxeHeading>)
      expect(screen.getByText('2XL')).toBeInTheDocument()

      rerender(<LuxeHeading size="3xl">3XL</LuxeHeading>)
      expect(screen.getByText('3XL')).toBeInTheDocument()
    })

    it('should render all weight variants correctly', () => {
      const { rerender } = render(<LuxeHeading weight="regular">Regular</LuxeHeading>)
      expect(screen.getByText('Regular')).toBeInTheDocument()

      rerender(<LuxeHeading weight="medium">Medium</LuxeHeading>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeHeading weight="semibold">Semibold</LuxeHeading>)
      expect(screen.getByText('Semibold')).toBeInTheDocument()

      rerender(<LuxeHeading weight="bold">Bold</LuxeHeading>)
      expect(screen.getByText('Bold')).toBeInTheDocument()
    })

    it('should render all alignment options correctly', () => {
      const { rerender } = render(<LuxeHeading align="left">Left</LuxeHeading>)
      expect(screen.getByText('Left')).toBeInTheDocument()

      rerender(<LuxeHeading align="center">Center</LuxeHeading>)
      expect(screen.getByText('Center')).toBeInTheDocument()

      rerender(<LuxeHeading align="right">Right</LuxeHeading>)
      expect(screen.getByText('Right')).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      render(<LuxeHeading>Default</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Default')
    })

    it('should render with custom className', () => {
      render(<LuxeHeading className="custom-class">Custom</LuxeHeading>)
      expect(screen.getByText('Custom')).toHaveClass('custom-class')
    })
  })

  describe('Color Prop', () => {
    it('should render with default color when not specified', () => {
      render(<LuxeHeading>Default color</LuxeHeading>)
      expect(screen.getByText('Default color')).toBeInTheDocument()
    })

    it('should accept color prop', () => {
      render(<LuxeHeading color="primary">Primary color</LuxeHeading>)
      expect(screen.getByText('Primary color')).toBeInTheDocument()
    })
  })

  describe('Spacing', () => {
    it('should render with default marginBottom when not specified', () => {
      render(<LuxeHeading>Default margin</LuxeHeading>)
      expect(screen.getByText('Default margin')).toBeInTheDocument()
    })

    it('should accept marginBottom prop', () => {
      render(<LuxeHeading marginBottom={8}>Custom margin</LuxeHeading>)
      expect(screen.getByText('Custom margin')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading role', () => {
      render(<LuxeHeading>Accessible heading</LuxeHeading>)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should maintain semantic level with different visual sizes', () => {
      render(<LuxeHeading as="h1" size="sm">Small H1</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Small H1')
    })

    it('should support different semantic and visual hierarchies', () => {
      render(<LuxeHeading as="h3" size="3xl">Large H3</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Large H3')
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<LuxeHeading>Text content</LuxeHeading>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      render(
        <LuxeHeading>
          <span>Nested</span> content
        </LuxeHeading>
      )
      expect(screen.getByText('Nested')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toHaveTextContent('Nested content')
    })

    it('should render complex children structures', () => {
      render(
        <LuxeHeading>
          <strong>Bold</strong> and <em>italic</em>
        </LuxeHeading>
      )
      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('italic')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toHaveTextContent('Bold and italic')
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      render(
        <LuxeHeading
          as="h1"
          size="3xl"
          weight="bold"
          align="center"
          color="primary"
          marginBottom={8}
          className="combined-test"
        >
          Combined props
        </LuxeHeading>
      )
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Combined props')
      expect(screen.getByText('Combined props')).toHaveClass('combined-test')
    })

    it('should handle semantic and visual hierarchy independently', () => {
      const { rerender } = render(<LuxeHeading as="h6" size="3xl">Visually large H6</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument()

      rerender(<LuxeHeading as="h1" size="sm">Visually small H1</LuxeHeading>)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })
})
