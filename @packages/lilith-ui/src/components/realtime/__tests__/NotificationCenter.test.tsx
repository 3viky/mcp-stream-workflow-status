import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { NotificationCenter } from '../NotificationCenter'

describe('NotificationCenter', () => {
  const mockNotifications = [
    {
      id: '1',
      title: 'New Message',
      message: 'You have a new message',
      timestamp: new Date(),
      read: false,
      type: 'info' as const
    }
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <NotificationCenter
          notifications={mockNotifications}
          onMarkAsRead={jest.fn()}
          onMarkAllAsRead={jest.fn()}
          onDelete={jest.fn()}
          onClear={jest.fn()}
        />
      </ThemeProvider>
    )
  })

  it('displays notifications', () => {
    render(
      <ThemeProvider theme="luxe">
        <NotificationCenter
          notifications={mockNotifications}
          onMarkAsRead={jest.fn()}
          onMarkAllAsRead={jest.fn()}
          onDelete={jest.fn()}
          onClear={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('New Message')).toBeInTheDocument()
    expect(screen.getByText('You have a new message')).toBeInTheDocument()
  })

  it('shows unread count badge', () => {
    render(
      <ThemeProvider theme="luxe">
        <NotificationCenter
          notifications={mockNotifications}
          onMarkAsRead={jest.fn()}
          onMarkAllAsRead={jest.fn()}
          onDelete={jest.fn()}
          onClear={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
