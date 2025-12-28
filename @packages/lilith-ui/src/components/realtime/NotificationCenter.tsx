import React, {  } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Badge } from '../primitives/Badge'

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
  icon?: string
  actionLabel?: string
  onAction?: () => void
}

export interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onClear: () => void
  maxHeight?: string
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  min-width: 320px;
  max-width: 400px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.background};
`

const Title = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
`

const NotificationList = styled.div<{ $maxHeight?: string }>`
  max-height: ${(props) => props.$maxHeight || '400px'};
  overflow-y: auto;
`

const NotificationItem = styled.div<{ $read: boolean }>`
  padding: ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => (props.$read ? props.theme.colors.background : props.theme.colors.surface)};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.primary}05;
  }

  &:last-child {
    border-bottom: none;
  }
`

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.xs};
`

const NotificationTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  flex: 1;
`

const NotificationIcon = styled.span<{ $type: string }>`
  font-size: 20px;
  flex-shrink: 0;
`

const NotificationTitle = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const NotificationMessage = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  line-height: 1.4;
`

const NotificationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(props) => props.theme.spacing.sm};
`

const Timestamp = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 18px;
  line-height: 1;

  &:hover {
    background: ${(props) => props.theme.colors.error}20;
    color: ${(props) => props.theme.colors.error};
  }
`

const EmptyState = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
`

const UnreadIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  flex-shrink: 0;
`

const getIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return '✅'
    case 'warning':
      return '⚠️'
    case 'error':
      return '❌'
    default:
      return 'ℹ️'
  }
}

const formatTimestamp = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClear,
  maxHeight
}) => {
  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <Container>
      <Header>
        <Title>
          Notifications
          {unreadCount > 0 && <Badge variant="primary">{unreadCount}</Badge>}
        </Title>
        <Actions>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          )}
        </Actions>
      </Header>

      <NotificationList $maxHeight={maxHeight} data-testid="notification-list">
        {notifications.length === 0 ? (
          <EmptyState>No notifications</EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              $read={notification.read}
              onClick={() => handleNotificationClick(notification)}
              data-testid="notification-item"
            >
              <NotificationHeader>
                <NotificationTitleRow>
                  {!notification.read && <UnreadIndicator />}
                  <NotificationIcon $type={notification.type}>
                    {notification.icon || getIcon(notification.type)}
                  </NotificationIcon>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                </NotificationTitleRow>
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(notification.id)
                  }}
                  aria-label="Delete notification"
                >
                  ×
                </DeleteButton>
              </NotificationHeader>

              <NotificationMessage>{notification.message}</NotificationMessage>

              <NotificationFooter>
                <Timestamp>{formatTimestamp(notification.timestamp)}</Timestamp>
                {notification.actionLabel && notification.onAction && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      notification.onAction?.()
                    }}
                  >
                    {notification.actionLabel}
                  </Button>
                )}
              </NotificationFooter>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </Container>
  )
}
