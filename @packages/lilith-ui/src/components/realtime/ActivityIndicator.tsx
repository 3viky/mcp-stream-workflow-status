import React from 'react'
import styled from 'styled-components'

export interface ActivityIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
`

const Indicator = styled.div<{ $status: string; $size: string }>`
  width: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '8px'
      case 'large':
        return '16px'
      default:
        return '12px'
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '8px'
      case 'large':
        return '16px'
      default:
        return '12px'
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

const Label = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: capitalize;
`

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  status,
  showLabel = false,
  size = 'medium'
}) => {
  return (
    <Container>
      <Indicator $status={status} $size={size} />
      {showLabel && <Label>{status}</Label>}
    </Container>
  )
}
