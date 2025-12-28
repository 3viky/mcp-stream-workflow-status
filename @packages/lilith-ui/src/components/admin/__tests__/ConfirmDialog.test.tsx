import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { ConfirmDialog } from '../ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <ConfirmDialog
          isOpen={true}
          title="Confirm Action"
          message="Are you sure?"
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
        />
      </ThemeProvider>
    )
  })

  it('displays title and message', () => {
    render(
      <ThemeProvider theme="luxe">
        <ConfirmDialog
          isOpen={true}
          title="Delete Item"
          message="This action cannot be undone"
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument()
  })
})
