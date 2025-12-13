/**
 * Unit tests for MessageBubble component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { MessageBubble } from '../MessageBubble'

const mockTheme = {
  colors: {
    primary: '#3b82f6',
    surface: '#374151',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    accent: '#8b5cf6',
    warning: '#f59e0b',
    error: '#ef4444',
  },
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>
)

describe('MessageBubble', () => {
  const mockMessage = {
    id: 'msg-1',
    content: 'Hello World',
    senderId: 'user-1',
    createdAt: '2025-01-01T12:00:00Z',
  }

  it('should render message content', () => {
    render(
      <Wrapper>
        <MessageBubble message={mockMessage} currentUserId="user-2" />
      </Wrapper>
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should render as sender when currentUserId matches senderId', () => {
    render(
      <Wrapper>
        <MessageBubble message={mockMessage} currentUserId="user-1" />
      </Wrapper>
    )

    // Sender message should still render the content
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should render as receiver when currentUserId does not match senderId', () => {
    render(
      <Wrapper>
        <MessageBubble message={mockMessage} currentUserId="user-2" />
      </Wrapper>
    )

    // Receiver message should still render the content
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should show timestamp when showTimestamp is true', () => {
    render(
      <Wrapper>
        <MessageBubble message={mockMessage} currentUserId="user-2" showTimestamp />
      </Wrapper>
    )

    // Should render timestamp meta section (time format varies by timezone)
    // Match any time pattern like "12:00 PM", "04:00 AM", etc.
    expect(screen.getByText(/\d{1,2}:\d{2}\s*(AM|PM)?/i)).toBeInTheDocument()
  })

  it('should show VIP priority badge', () => {
    const vipMessage = { ...mockMessage, priority: 'VIP' as const }

    render(
      <Wrapper>
        <MessageBubble
          message={vipMessage}
          currentUserId="user-2"
          showPriorityBadge
        />
      </Wrapper>
    )

    expect(screen.getByText('VIP')).toBeInTheDocument()
  })

  it('should show WHALE priority badge', () => {
    const whaleMessage = { ...mockMessage, priority: 'WHALE' as const }

    render(
      <Wrapper>
        <MessageBubble
          message={whaleMessage}
          currentUserId="user-2"
          showPriorityBadge
        />
      </Wrapper>
    )

    expect(screen.getByText('WHALE')).toBeInTheDocument()
  })

  it('should show URGENT priority badge', () => {
    const urgentMessage = { ...mockMessage, priority: 'URGENT' as const }

    render(
      <Wrapper>
        <MessageBubble
          message={urgentMessage}
          currentUserId="user-2"
          showPriorityBadge
        />
      </Wrapper>
    )

    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })

  it('should show edited indicator when message is edited', () => {
    const editedMessage = {
      ...mockMessage,
      editedAt: '2025-01-01T12:30:00Z',
    }

    render(
      <Wrapper>
        <MessageBubble
          message={editedMessage}
          currentUserId="user-2"
          showTimestamp
        />
      </Wrapper>
    )

    expect(screen.getByText('edited')).toBeInTheDocument()
  })

  it('should not show priority badge when showPriorityBadge is false', () => {
    const vipMessage = { ...mockMessage, priority: 'VIP' as const }

    render(
      <Wrapper>
        <MessageBubble
          message={vipMessage}
          currentUserId="user-2"
          showPriorityBadge={false}
        />
      </Wrapper>
    )

    expect(screen.queryByText('VIP')).not.toBeInTheDocument()
  })
})
