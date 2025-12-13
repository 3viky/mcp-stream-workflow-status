import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { ModerationQueue } from '../ModerationQueue'

describe('ModerationQueue', () => {
  const mockItems = [
    {
      id: '1',
      type: 'content' as const,
      title: 'Reported Post',
      description: 'This post violates guidelines',
      reportedAt: new Date(),
      status: 'pending' as const,
      priority: 'high' as const
    }
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <ModerationQueue
          items={mockItems}
          onApprove={jest.fn()}
          onReject={jest.fn()}
        />
      </ThemeProvider>
    )
  })

  it('displays moderation items', () => {
    render(
      <ThemeProvider theme="luxe">
        <ModerationQueue
          items={mockItems}
          onApprove={jest.fn()}
          onReject={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Reported Post')).toBeInTheDocument()
    expect(screen.getByText('This post violates guidelines')).toBeInTheDocument()
  })

  it('shows approve and reject buttons for pending items', () => {
    render(
      <ThemeProvider theme="luxe">
        <ModerationQueue
          items={mockItems}
          onApprove={jest.fn()}
          onReject={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Approve')).toBeInTheDocument()
    expect(screen.getByText('Reject')).toBeInTheDocument()
  })
})
