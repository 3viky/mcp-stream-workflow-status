import { useState } from 'react'
import styled from 'styled-components'
import { Badge } from '../primitives/Badge'
import { NotificationCenter, type Notification } from './NotificationCenter'

export interface NotificationBellProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onClear: () => void
}

const BellContainer = styled.div`
  position: relative;
  display: inline-block;
`

const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`

const BadgeWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
`

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1000;
  box-shadow: ${(props) => props.theme.shadows.lg};
`

export function NotificationBell({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClear,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BellContainer>
      <BellButton
        data-testid="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        🔔
        {unreadCount > 0 && (
          <BadgeWrapper>
            <Badge
              data-testid="notification-badge"
              variant="error"
              size="sm"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          </BadgeWrapper>
        )}
      </BellButton>

      {isOpen && (
        <DropdownContainer data-testid="notification-dropdown">
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={(id) => {
              onMarkAsRead(id)
            }}
            onMarkAllAsRead={() => {
              onMarkAllAsRead()
            }}
            onDelete={(id) => {
              onDelete(id)
              if (notifications.length === 1) {
                setIsOpen(false)
              }
            }}
            onClear={() => {
              onClear()
              setIsOpen(false)
            }}
          />
        </DropdownContainer>
      )}
    </BellContainer>
  )
}
