/**
 * ThreadListItem Component
 *
 * Displays a conversation thread in a list with preview and unread badge
 */

import styled from 'styled-components'
import { MessageCircle } from 'lucide-react'

export interface ThreadListItemProps {
  thread: {
    id: string
    participants: string[]
    lastMessage?: {
      content: string
      createdAt: string
      senderId: string
    }
    unreadCount: number
  }
  currentUserId: string
  onSelect?: (threadId: string) => void
  isSelected?: boolean
  className?: string
}

const ItemContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${(props) =>
    props.$isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  border-left: 3px solid
    ${(props) => (props.$isSelected ? props.theme.colors.primary || '#3b82f6' : 'transparent')};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) =>
      props.$isSelected
        ? 'rgba(59, 130, 246, 0.1)'
        : props.theme.colors.hover.surface};
  }
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`

const ParticipantName = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Timestamp = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  flex-shrink: 0;
  margin-left: 8px;
`

const Preview = styled.p<{ $hasUnread: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${(props) =>
    props.$hasUnread
      ? props.theme.colors.text || '#ffffff'
      : props.theme.colors.text.secondary || '#9ca3af'};
  font-weight: ${(props) => (props.$hasUnread ? 600 : 400)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const UnreadBadge = styled.div`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${(props) => props.theme.colors.primary || '#3b82f6'};
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
`

export function ThreadListItem({
  thread,
  currentUserId,
  onSelect,
  isSelected = false,
  className,
}: ThreadListItemProps) {
  const otherParticipant = thread.participants.find((id) => id !== currentUserId) || 'Unknown'
  const hasUnread = thread.unreadCount > 0

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const handleClick = () => {
    if (onSelect) {
      onSelect(thread.id)
    }
  }

  return (
    <ItemContainer $isSelected={isSelected} onClick={handleClick} className={className}>
      <Avatar>
        <MessageCircle size={24} />
      </Avatar>
      <Content>
        <Header>
          <ParticipantName>{otherParticipant}</ParticipantName>
          {thread.lastMessage && (
            <Timestamp>{formatTimestamp(thread.lastMessage.createdAt)}</Timestamp>
          )}
        </Header>
        <Preview $hasUnread={hasUnread}>
          {thread.lastMessage?.content || 'No messages yet'}
        </Preview>
      </Content>
      {hasUnread && <UnreadBadge>{thread.unreadCount > 99 ? '99+' : thread.unreadCount}</UnreadBadge>}
    </ItemContainer>
  )
}
