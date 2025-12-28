import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { LuxeBadge } from './Badge'

describe('LuxeBadge', () => {
  it('should render with text content', () => {
    render(<LuxeBadge>New</LuxeBadge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('should render all variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error'] as const
    variants.forEach(variant => {
      const { rerender } = render(<LuxeBadge variant={variant}>Badge</LuxeBadge>)
      expect(screen.getByText('Badge')).toBeInTheDocument()
      rerender(<div />)
    })
  })

  it('should render all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach(size => {
      const { rerender } = render(<LuxeBadge size={size}>Badge</LuxeBadge>)
      expect(screen.getByText('Badge')).toBeInTheDocument()
      rerender(<div />)
    })
  })

  it('should use default props', () => {
    render(<LuxeBadge>Default</LuxeBadge>)
    expect(screen.getByText('Default')).toBeInTheDocument()
  })

  it('should support custom className', () => {
    render(<LuxeBadge className="custom">Badge</LuxeBadge>)
    expect(screen.getByText('Badge')).toHaveClass('custom')
  })

  it('should render complex children', () => {
    const { container } = render(
      <LuxeBadge>
        <span>Count:</span> 5
      </LuxeBadge>
    )
    expect(screen.getByText('Count:')).toBeInTheDocument()
    // Check that the badge renders with the full content
    const badge = container.firstChild
    expect(badge).toHaveTextContent('Count: 5')
  })
})
