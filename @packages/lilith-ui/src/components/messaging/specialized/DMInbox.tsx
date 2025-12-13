import { useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { MessageThread } from '../composites/MessageThread'
import { MailboxTabs, MailboxTab } from '../composites/MailboxTabs'
import { ThreadList } from '../composites/ThreadList'

// Types
export interface DMInboxProps {
  userId: string
  mode: 'creator' | 'fan'
}

interface Conversation {
  id: string
  name: string
  roomType: string
  participants: string[]
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount: number
  priority?: 'NORMAL' | 'VIP' | 'WHALE' | 'URGENT'
}

type Mailbox = 'primary' | 'vip' | 'support' | 'archived'

// Styled Components
const InboxContainer = styled.div`
  display: grid;
  grid-template-columns: 80px 320px 1fr;
  gap: 0;
  height: 700px;
  max-width: 1400px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`

const MailboxSidebar = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 0;

  @media (max-width: 1200px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 1rem;
  }
`

const ThreadListContainer = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 1200px) {
    border-right: none;
    max-height: 400px;
  }
`

const MessageArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 3rem 2rem;
`

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 300px;
`

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
`

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.error};
`

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
`

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.active.primary};
  }
`

// Component
export function DMInbox({ userId, mode }: DMInboxProps) {
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox>('primary')
  const [selectedThread, setSelectedThread] = useState<string | null>(null)

  // Fetch conversations for selected mailbox
  const { data: conversationsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['conversations', userId, selectedMailbox],
    queryFn: async () => {
      const params = new URLSearchParams({
        userId,
        mailbox: selectedMailbox,
        roomType: 'DIRECTMESSAGE',
      })

      const response = await fetch(`/api/chat/conversations?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      return response.json()
    },
  })

  const conversations: Conversation[] = conversationsData?.data || []

  // Calculate unread counts for mailbox tabs
  const unreadCounts = {
    primary: conversations.filter((c) => c.unreadCount > 0 && !c.priority).length,
    vip: conversations.filter(
      (c) => c.unreadCount > 0 && (c.priority === 'VIP' || c.priority === 'WHALE')
    ).length,
    support: conversations.filter(
      (c) => c.unreadCount > 0 && c.priority === 'URGENT'
    ).length,
    archived: 0,
  }

  const selectedConversation = conversations.find((c) => c.id === selectedThread)

  return (
    <InboxContainer>
      <MailboxSidebar>
        <MailboxTabs
          activeTab={selectedMailbox}
          onTabChange={(tab: MailboxTab) => {
            setSelectedMailbox(tab as Mailbox)
            setSelectedThread(null) // Clear selection when switching mailboxes
          }}
          unreadCounts={unreadCounts}
        />
      </MailboxSidebar>

      <ThreadListContainer>
        {isLoading ? (
          <LoadingState>Loading conversations...</LoadingState>
        ) : isError ? (
          <ErrorState>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorMessage>
              {error instanceof Error ? error.message : 'Failed to load conversations'}
            </ErrorMessage>
            <RetryButton onClick={() => refetch()}>Retry</RetryButton>
          </ErrorState>
        ) : conversations.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyTitle>No messages</EmptyTitle>
            <EmptyDescription>
              {selectedMailbox === 'archived'
                ? 'No archived conversations'
                : 'Your inbox is empty'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <ThreadList
            threads={conversations.map((c) => ({
              id: c.id,
              participantIds: c.participants,
              participantNames: [c.name],
              lastMessage: c.lastMessage ? {
                content: c.lastMessage.content,
                senderId: c.lastMessage.senderId,
                createdAt: c.lastMessage.createdAt,
              } : null,
              unreadCount: c.unreadCount,
              updatedAt: c.lastMessage?.createdAt || new Date().toISOString(),
            }))}
            currentUserId={userId}
            selectedThreadId={selectedThread || undefined}
            onSelectThread={setSelectedThread}
          />
        )}
      </ThreadListContainer>

      <MessageArea>
        {selectedThread && selectedConversation ? (
          <MessageThread
            threadId={selectedThread}
            currentUserId={userId}
            messages={[]}
            config={{
              showPriorityBadges: mode === 'creator',
              showTimestamps: true,
              enableInput: true,
              autoScroll: true,
            }}
          />
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>Select a conversation</EmptyTitle>
            <EmptyDescription>
              Choose a conversation from the list to view messages
            </EmptyDescription>
          </EmptyState>
        )}
      </MessageArea>
    </InboxContainer>
  )
}
