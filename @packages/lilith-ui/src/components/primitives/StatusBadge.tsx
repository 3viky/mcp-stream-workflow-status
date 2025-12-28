import React from 'react'
import styled from 'styled-components'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface StatusBadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  size?: 'small' | 'medium'
}

const Badge = styled.span<{ $variant: BadgeVariant; $size: 'small' | 'medium' }>`
  display: inline-block;
  padding: ${(props) => {
    if (props.$size === 'small') {
      return `${props.theme.spacing.xs} ${props.theme.spacing.xs}`
    }
    return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`
  }};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => {
    if (props.$size === 'small') {
      return props.theme.typography.fontSize.xs
    }
    return props.theme.typography.fontSize.sm
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  text-transform: capitalize;
  white-space: nowrap;

  ${(props) => {
    const colorMap = {
      success: props.theme.colors.success,
      warning: props.theme.colors.warning,
      error: props.theme.colors.error,
      info: props.theme.colors.primary,
      neutral: props.theme.colors.text.secondary
    }

    const color = colorMap[props.$variant]

    return `
      background: ${color}20;
      color: ${color};
    `
  }}
`

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  children,
  size = 'medium'
}) => {
  return (
    <Badge $variant={variant} $size={size}>
      {children}
    </Badge>
  )
}
