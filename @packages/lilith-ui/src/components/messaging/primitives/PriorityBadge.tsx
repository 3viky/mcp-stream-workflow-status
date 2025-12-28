/**
 * PriorityBadge Component
 *
 * Displays message priority indicators (VIP, WHALE, URGENT)
 */

import styled from 'styled-components'
import { Crown, DollarSign, AlertCircle } from 'lucide-react'

export interface PriorityBadgeProps {
  priority: 'VIP' | 'WHALE' | 'URGENT'
  size?: 'small' | 'medium' | 'large'
  showIcon?: boolean
  className?: string
}

const Badge = styled.span<{ $priority: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '3px'
      case 'large':
        return '6px'
      default:
        return '4px'
    }
  }};
  padding: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '2px 6px'
      case 'large':
        return '6px 12px'
      default:
        return '4px 8px'
    }
  }};
  border-radius: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '8px'
      case 'large':
        return '12px'
      default:
        return '10px'
    }
  }};
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '10px'
      case 'large':
        return '14px'
      default:
        return '12px'
    }
  }};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => {
    switch (props.$priority) {
      case 'VIP':
        return 'rgba(139, 92, 246, 0.15)'
      case 'WHALE':
        return 'rgba(245, 158, 11, 0.15)'
      case 'URGENT':
        return 'rgba(239, 68, 68, 0.15)'
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
  border: 1px solid
    ${(props) => {
      switch (props.$priority) {
        case 'VIP':
          return 'rgba(139, 92, 246, 0.3)'
        case 'WHALE':
          return 'rgba(245, 158, 11, 0.3)'
        case 'URGENT':
          return 'rgba(239, 68, 68, 0.3)'
        default:
          return 'transparent'
      }
    }};
`

const icons = {
  VIP: Crown,
  WHALE: DollarSign,
  URGENT: AlertCircle,
}

export function PriorityBadge({
  priority,
  size = 'medium',
  showIcon = true,
  className,
}: PriorityBadgeProps) {
  const Icon = icons[priority]
  const iconSize = size === 'small' ? 12 : size === 'large' ? 16 : 14

  return (
    <Badge $priority={priority} $size={size} className={className}>
      {showIcon && <Icon size={iconSize} />}
      <span>{priority}</span>
    </Badge>
  )
}
