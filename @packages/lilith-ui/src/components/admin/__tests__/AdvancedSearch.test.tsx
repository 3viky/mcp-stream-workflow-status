import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { AdvancedSearch } from '../AdvancedSearch'

describe('AdvancedSearch', () => {
  const mockFields = [
    { id: 'name', label: 'Name', type: 'text' as const },
    { id: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]}
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <AdvancedSearch fields={mockFields} onSearch={jest.fn()} />
      </ThemeProvider>
    )
  })

  it('displays quick search input', () => {
    render(
      <ThemeProvider theme="luxe">
        <AdvancedSearch
          fields={mockFields}
          onSearch={jest.fn()}
          placeholder="Search..."
        />
      </ThemeProvider>
    )

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })
})
