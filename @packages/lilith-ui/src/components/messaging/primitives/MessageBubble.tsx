/**
 * MessageBubble Component
 *
 * Displays a single message in a chat thread with sender/receiver variants
 */

import styled from 'styled-components'
import { Clock } from 'lucide-react'

export interface MessageBubbleProps {
  message: {
    id: string
    content: string
    senderId: string
    createdAt: string
    editedAt?: string
    priority?: 'NORMAL' | 'VIP' | 'WHALE' | 'URGENT'
  }
  currentUserId: string
  showTimestamp?: boolean
  showPriorityBadge?: boolean
  className?: string
}

const BubbleContainer = styled.div<{ $isSender: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isSender ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
  max-width: 70%;
  align-self: ${(props) => (props.$isSender ? 'flex-end' : 'flex-start')};
`

const Bubble = styled.div<{ $isSender: boolean; $priority?: string }>`
  background: ${(props) => {
    if (props.$priority === 'VIP') return props.theme.colors.accent || '#8b5cf6'
    if (props.$priority === 'WHALE') return props.theme.colors.warning || '#f59e0b'
    if (props.$priority === 'URGENT') return props.theme.colors.error || '#ef4444'
    return props.$isSender
      ? props.theme.colors.primary || '#3b82f6'
      : props.theme.colors.surface || '#374151'
  }};
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  padding: 10px 14px;
  border-radius: ${(props) => (props.$isSender ? '16px 16px 4px 16px' : '16px 16px 16px 4px')};
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
`

const MessageContent = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
`

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 11px;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
`

const EditedBadge = styled.span`
  font-style: italic;
  opacity: 0.7;
`

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.$priority) {
      case 'VIP':
        return 'rgba(139, 92, 246, 0.2)'
      case 'WHALE':
        return 'rgba(245, 158, 11, 0.2)'
      case 'URGENT':
        return 'rgba(239, 68, 68, 0.2)'
      default:
        return 'transparent'
    }
  }};
  color: ${(props) => {
    switch (props.$priority) {
      case 'VIP':
        return '#a78bfa'
      case 'WHALE':
        return '#fbbf24'
      case 'URGENT':
        return '#f87171'
      default:
        return 'inherit'
    }
  }};
`

export function MessageBubble({
  message,
  currentUserId,
  showTimestamp = true,
  showPriorityBadge = false,
  className,
}: MessageBubbleProps) {
  const isSender = message.senderId === currentUserId
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <BubbleContainer $isSender={isSender} className={className}>
      <Bubble $isSender={isSender} $priority={message.priority}>
        <MessageContent>{message.content}</MessageContent>
      </Bubble>
      {(showTimestamp || message.editedAt || (showPriorityBadge && message.priority)) && (
        <MessageMeta>
          {showPriorityBadge && message.priority && message.priority !== 'NORMAL' && (
            <PriorityBadge $priority={message.priority}>{message.priority}</PriorityBadge>
          )}
          {showTimestamp && (
            <>
              <Clock size={12} />
              <span>{timestamp}</span>
            </>
          )}
          {message.editedAt && <EditedBadge>edited</EditedBadge>}
        </MessageMeta>
      )}
    </BubbleContainer>
  )
}
