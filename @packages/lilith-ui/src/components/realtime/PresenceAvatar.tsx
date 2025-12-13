import React from 'react'
import styled from 'styled-components'
import { Avatar } from '../primitives/Avatar'
import type { AvatarProps } from '../primitives/Avatar'

export interface PresenceAvatarProps extends Omit<AvatarProps, 'children'> {
  status: 'online' | 'offline' | 'away' | 'busy'
  showStatus?: boolean
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`

const StatusDot = styled.div<{ $status: string; $size: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '10px'
      case 'large':
        return '18px'
      default:
        return '14px'
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '10px'
      case 'large':
        return '18px'
      default:
        return '14px'
    }
  }};
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case 'online':
        return props.theme.colors.success
      case 'offline':
        return props.theme.colors.text.secondary
      case 'away':
        return props.theme.colors.warning
      case 'busy':
        return props.theme.colors.error
      default:
        return props.theme.colors.text.secondary
    }
  }};
  border: 2px solid ${(props) => props.theme.colors.background};
`

export const PresenceAvatar: React.FC<PresenceAvatarProps> = ({
  status,
  showStatus = true,
  ...avatarProps
}) => {
  return (
    <Container>
      <Avatar {...avatarProps} />
      {showStatus && <StatusDot $status={status} $size={avatarProps.size || 'medium'} />}
    </Container>
  )
}
