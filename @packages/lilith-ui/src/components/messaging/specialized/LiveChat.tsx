import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@transftw/messaging-hooks'
import { ChatFeed } from '../composites/ChatFeed'
import { MessageComposer } from '../composites/MessageComposer'

// Types
export interface LiveChatProps {
  roomId: string
  streamerId: string
  isStreamer: boolean
}

interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  content: string
  messageType: 'TEXT' | 'IMAGE' | 'EMOJI' | 'SYSTEM'
  superChatAmount?: number
  superChatCurrency?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// Styled Components
const LiveChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 700px;
  max-width: 450px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const ViewerCountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.hover.surface};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
`

const ViewerIcon = styled.span`
  font-size: 0.875rem;
`

const ModerationButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.warning};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.warning};
    color: white;
  }
`

const ChatFeedContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`

const ComposerContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
`

const ModerationPanel = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 300px;
  max-height: 400px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  z-index: 100;
`

const ModerationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ModerationActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`

const ModerationAction = styled.button<{ variant?: 'danger' }>`
  padding: 0.75rem;
  background-color: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.error : theme.colors.surface};
  color: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.error : theme.colors.text.primary};
  border: 1px solid ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background-color: ${({ theme, variant }) =>
      variant === 'danger' ? theme.colors.error : theme.colors.hover.surface};
    color: ${({ theme, variant }) => (variant === 'danger' ? 'white' : theme.colors.text.primary)};
  }
`

// Component
export function LiveChat({ roomId, streamerId, isStreamer }: LiveChatProps) {
  const [moderationPanel, setModerationPanel] = useState(false)
  // TODO: Add viewer count when WebSocket is implemented
  const [viewerCount] = useState<number>(0)

  const queryClient = useQueryClient()
  const { client, isConnected } = useSocket({ userId: streamerId })

  // Fetch messages
  const { data: messagesData } = useQuery<{ data: ChatMessage[] }>({
    queryKey: ['broadcast-messages', roomId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch messages')
      return response.json()
    },
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  })

  // Listen to broadcast events via WebSocket
  // TODO: Implement when WebSocket broadcast infrastructure is ready
  useEffect(() => {
    if (!client || !isConnected) return

    // Stub: WebSocket real-time events will be implemented in future stream
    // This currently relies on REST polling (queryFn above with 5s refetchInterval)

    // Future implementation will use client.on() for:
    // - 'broadcast:message' - New messages
    // - 'broadcast:super-chat' - Super chat notifications
    // - 'broadcast:viewer-count' - Live viewer count updates

    return () => {
      // Cleanup will be added when WebSocket is implemented
    }
  }, [client, isConnected, roomId, queryClient])

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      // TODO: Use WebSocket when implemented
      // For now, use REST API
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content,
          messageType: 'TEXT',
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcast-messages', roomId] })
    },
  })

  // Send super chat mutation
  const sendSuperChat = useMutation({
    mutationFn: async ({ content, amount }: { content: string; amount: number }) => {
      const response = await fetch('/api/websocket/broadcast/super-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          roomId,
          content,
          amount,
          currency: 'USD',
        }),
      })

      if (!response.ok) throw new Error('Failed to send super chat')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcast-messages', roomId] })
    },
  })

  const handleModerate = (action: 'timeout' | 'ban' | 'delete', targetUserId?: string) => {
    // TODO: Implement moderation actions
    console.log(`Moderation action: ${action}`, { targetUserId })
    setModerationPanel(false)
  }

  const messages = messagesData?.data || []

  return (
    <div style={{ position: 'relative' }}>
      <LiveChatContainer>
        <ChatHeader>
          <HeaderLeft>
            <LiveIndicator>
              <LiveDot />
              Live
            </LiveIndicator>
            <ViewerCountBadge>
              <ViewerIcon>👁</ViewerIcon>
              {viewerCount}
            </ViewerCountBadge>
          </HeaderLeft>

          {isStreamer && (
            <ModerationButton onClick={() => setModerationPanel(!moderationPanel)}>
              Moderation
            </ModerationButton>
          )}
        </ChatHeader>

        <ChatFeedContainer>
          <ChatFeed
            feedId={roomId}
            currentUserId={streamerId}
            messages={messages.map((m) => ({
              id: m.id,
              senderId: m.senderId,
              content: m.content,
              createdAt: m.createdAt,
              priority: m.superChatAmount ? 'VIP' : 'NORMAL',
            }))}
            isLive={isConnected}
            config={{
              autoScroll: true,
              showLiveIndicator: true,
              showPriorityBadges: true,
            }}
          />
        </ChatFeedContainer>

        <ComposerContainer>
          <MessageComposer
            onSend={(content: string) => sendMessage.mutate(content)}
            disabled={sendMessage.isPending || sendSuperChat.isPending}
            config={{
              placeholder: isStreamer ? 'Message your viewers...' : 'Send a message...',
              allowEmoji: true,
            }}
          />
        </ComposerContainer>
      </LiveChatContainer>

      {moderationPanel && isStreamer && (
        <ModerationPanel>
          <ModerationHeader>Moderation Tools</ModerationHeader>
          <ModerationActions>
            <ModerationAction onClick={() => handleModerate('timeout')}>
              ⏸ Timeout User (10 min)
            </ModerationAction>
            <ModerationAction onClick={() => handleModerate('delete')}>
              🗑 Delete Message
            </ModerationAction>
            <ModerationAction variant="danger" onClick={() => handleModerate('ban')}>
              🚫 Ban User
            </ModerationAction>
          </ModerationActions>
        </ModerationPanel>
      )}
    </div>
  )
}
