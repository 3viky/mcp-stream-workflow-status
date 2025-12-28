import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { SystemHealthIndicator } from '../SystemHealthIndicator'

describe('SystemHealthIndicator', () => {
  const mockServices = [
    { name: 'API', status: 'healthy' as const, responseTime: 50, lastCheck: new Date() },
    { name: 'Database', status: 'degraded' as const, responseTime: 150, lastCheck: new Date() }
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <SystemHealthIndicator services={mockServices} />
      </ThemeProvider>
    )
  })

  it('displays service names and status', () => {
    render(
      <ThemeProvider theme="luxe">
        <SystemHealthIndicator services={mockServices} />
      </ThemeProvider>
    )

    expect(screen.getByText('API')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
  })

  it('shows overall health status', () => {
    render(
      <ThemeProvider theme="luxe">
        <SystemHealthIndicator services={mockServices} />
      </ThemeProvider>
    )

    expect(screen.getByText(/Degraded/i)).toBeInTheDocument()
  })
})
