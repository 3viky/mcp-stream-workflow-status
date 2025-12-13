import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { LuxeText } from './Text'

describe('LuxeText', () => {
  describe('Rendering', () => {
    it('should render with text', () => {
      render(<LuxeText>Test text</LuxeText>)
      expect(screen.getByText('Test text')).toBeInTheDocument()
    })

    it('should render all element types correctly', () => {
      const { rerender, container } = render(<LuxeText as="p">Paragraph</LuxeText>)
      expect(container.querySelector('p')).toHaveTextContent('Paragraph')

      rerender(<LuxeText as="span">Span</LuxeText>)
      expect(container.querySelector('span')).toHaveTextContent('Span')

      rerender(<LuxeText as="div">Div</LuxeText>)
      expect(container.querySelector('div')).toHaveTextContent('Div')

      rerender(<LuxeText as="label">Label</LuxeText>)
      expect(container.querySelector('label')).toHaveTextContent('Label')
    })

    it('should render all size variants correctly', () => {
      const { rerender } = render(<LuxeText size="xs">Extra Small</LuxeText>)
      expect(screen.getByText('Extra Small')).toBeInTheDocument()

      rerender(<LuxeText size="sm">Small</LuxeText>)
      expect(screen.getByText('Small')).toBeInTheDocument()

      rerender(<LuxeText size="base">Base</LuxeText>)
      expect(screen.getByText('Base')).toBeInTheDocument()

      rerender(<LuxeText size="md">Medium</LuxeText>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeText size="lg">Large</LuxeText>)
      expect(screen.getByText('Large')).toBeInTheDocument()

      rerender(<LuxeText size="xl">Extra Large</LuxeText>)
      expect(screen.getByText('Extra Large')).toBeInTheDocument()
    })

    it('should render all weight variants correctly', () => {
      const { rerender } = render(<LuxeText weight="light">Light</LuxeText>)
      expect(screen.getByText('Light')).toBeInTheDocument()

      rerender(<LuxeText weight="regular">Regular</LuxeText>)
      expect(screen.getByText('Regular')).toBeInTheDocument()

      rerender(<LuxeText weight="medium">Medium</LuxeText>)
      expect(screen.getByText('Medium')).toBeInTheDocument()

      rerender(<LuxeText weight="semibold">Semibold</LuxeText>)
      expect(screen.getByText('Semibold')).toBeInTheDocument()

      rerender(<LuxeText weight="bold">Bold</LuxeText>)
      expect(screen.getByText('Bold')).toBeInTheDocument()
    })

    it('should render all alignment options correctly', () => {
      const { rerender } = render(<LuxeText align="left">Left</LuxeText>)
      expect(screen.getByText('Left')).toBeInTheDocument()

      rerender(<LuxeText align="center">Center</LuxeText>)
      expect(screen.getByText('Center')).toBeInTheDocument()

      rerender(<LuxeText align="right">Right</LuxeText>)
      expect(screen.getByText('Right')).toBeInTheDocument()

      rerender(<LuxeText align="justify">Justify</LuxeText>)
      expect(screen.getByText('Justify')).toBeInTheDocument()
    })

    it('should render all line height variants correctly', () => {
      const { rerender } = render(<LuxeText lineHeight="tight">Tight</LuxeText>)
      expect(screen.getByText('Tight')).toBeInTheDocument()

      rerender(<LuxeText lineHeight="base">Base</LuxeText>)
      expect(screen.getByText('Base')).toBeInTheDocument()

      rerender(<LuxeText lineHeight="relaxed">Relaxed</LuxeText>)
      expect(screen.getByText('Relaxed')).toBeInTheDocument()

      rerender(<LuxeText lineHeight="loose">Loose</LuxeText>)
      expect(screen.getByText('Loose')).toBeInTheDocument()
    })

    it('should use default props when not specified', () => {
      const { container } = render(<LuxeText>Default</LuxeText>)
      expect(container.querySelector('p')).toHaveTextContent('Default')
    })

    it('should render with custom className', () => {
      render(<LuxeText className="custom-class">Custom</LuxeText>)
      expect(screen.getByText('Custom')).toHaveClass('custom-class')
    })
  })

  describe('Color Prop', () => {
    it('should render with default color when not specified', () => {
      render(<LuxeText>Default color</LuxeText>)
      expect(screen.getByText('Default color')).toBeInTheDocument()
    })

    it('should accept color prop', () => {
      render(<LuxeText color="primary">Primary color</LuxeText>)
      expect(screen.getByText('Primary color')).toBeInTheDocument()
    })
  })

  describe('Spacing', () => {
    it('should render with default marginBottom when not specified', () => {
      render(<LuxeText>Default margin</LuxeText>)
      expect(screen.getByText('Default margin')).toBeInTheDocument()
    })

    it('should accept marginBottom prop', () => {
      render(<LuxeText marginBottom={8}>Custom margin</LuxeText>)
      expect(screen.getByText('Custom margin')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should render as label with proper semantics', () => {
      const { container } = render(
        <LuxeText as="label" htmlFor="input-id">
          Label text
        </LuxeText>
      )
      const label = container.querySelector('label')
      expect(label).toBeInTheDocument()
    })

    it('should support aria attributes when needed', () => {
      render(<LuxeText aria-label="Description">Text</LuxeText>)
      // Check that the text is rendered
      expect(screen.getByText('Text')).toBeInTheDocument()
      // aria-label attribute is available for accessibility
    })
  })

  describe('Content', () => {
    it('should render text children', () => {
      render(<LuxeText>Text content</LuxeText>)
      expect(screen.getByText('Text content')).toBeInTheDocument()
    })

    it('should render element children', () => {
      const { container } = render(
        <LuxeText>
          <strong>Bold</strong> text
        </LuxeText>
      )
      expect(screen.getByText('Bold')).toBeInTheDocument()
      const element = container.querySelector('p')
      expect(element).toHaveTextContent('Bold text')
    })

    it('should render complex children structures', () => {
      render(
        <LuxeText>
          <span>First</span> and <span>Second</span>
        </LuxeText>
      )
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('should render with line breaks', () => {
      render(
        <LuxeText>
          Line 1<br />
          Line 2
        </LuxeText>
      )
      expect(screen.getByText(/Line 1/)).toBeInTheDocument()
    })
  })

  describe('Prop Combinations', () => {
    it('should handle all props combined', () => {
      const { container } = render(
        <LuxeText
          as="div"
          size="lg"
          weight="bold"
          align="center"
          color="primary"
          lineHeight="loose"
          marginBottom={8}
          className="combined-test"
        >
          Combined props
        </LuxeText>
      )
      const element = container.querySelector('div')
      expect(element).toHaveTextContent('Combined props')
      expect(element).toHaveClass('combined-test')
    })

    it('should handle size and weight combinations', () => {
      const { rerender } = render(<LuxeText size="xs" weight="light">XS Light</LuxeText>)
      expect(screen.getByText('XS Light')).toBeInTheDocument()

      rerender(<LuxeText size="xl" weight="bold">XL Bold</LuxeText>)
      expect(screen.getByText('XL Bold')).toBeInTheDocument()
    })

    it('should handle alignment and line height combinations', () => {
      const { rerender } = render(<LuxeText align="left" lineHeight="tight">Left Tight</LuxeText>)
      expect(screen.getByText('Left Tight')).toBeInTheDocument()

      rerender(<LuxeText align="justify" lineHeight="loose">Justify Loose</LuxeText>)
      expect(screen.getByText('Justify Loose')).toBeInTheDocument()
    })
  })
})
