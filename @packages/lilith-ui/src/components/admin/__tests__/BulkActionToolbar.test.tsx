import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { BulkActionToolbar, BulkAction } from '../BulkActionToolbar'

const mockActions: BulkAction[] = [
  { id: 'delete', label: 'Delete', variant: 'danger' },
  { id: 'archive', label: 'Archive', variant: 'secondary' }
]

describe('BulkActionToolbar', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <BulkActionToolbar
          selectedCount={5}
          actions={mockActions}
          onAction={jest.fn()}
          onClearSelection={jest.fn()}
        />
      </ThemeProvider>
    )
  })

  it('displays selection count', () => {
    render(
      <ThemeProvider theme="luxe">
        <BulkActionToolbar
          selectedCount={5}
          actions={mockActions}
          onAction={jest.fn()}
          onClearSelection={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/items selected/)).toBeInTheDocument()
  })

  it('does not render when selection count is 0', () => {
    const { container } = render(
      <ThemeProvider theme="luxe">
        <BulkActionToolbar
          selectedCount={0}
          actions={mockActions}
          onAction={jest.fn()}
          onClearSelection={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(container.firstChild).toBeNull()
  })
})
