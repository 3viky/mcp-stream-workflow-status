import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { AuditLogViewer } from '../AuditLogViewer'

describe('AuditLogViewer', () => {
  const mockEntries = [
    {
      id: '1',
      timestamp: new Date('2024-01-01'),
      actor: 'admin@example.com',
      action: 'create',
      resource: 'post',
      resourceId: '123',
      severity: 'info' as const,
      changes: [
        { field: 'title', before: null, after: 'New Post' }
      ]
    }
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <AuditLogViewer entries={mockEntries} />
      </ThemeProvider>
    )
  })

  it('displays audit log entries', () => {
    render(
      <ThemeProvider theme="luxe">
        <AuditLogViewer entries={mockEntries} />
      </ThemeProvider>
    )

    const createElements = screen.getAllByText('create')
    expect(createElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/admin@example.com/)).toBeInTheDocument()
  })

  it('shows entry count', () => {
    render(
      <ThemeProvider theme="luxe">
        <AuditLogViewer entries={mockEntries} />
      </ThemeProvider>
    )

    expect(screen.getByText(/1 of 1 entries/)).toBeInTheDocument()
  })
})
