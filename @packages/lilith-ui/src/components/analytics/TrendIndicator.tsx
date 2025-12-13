import React from 'react'
import styled from 'styled-components'

export interface TrendIndicatorProps {
  value: number
  trend: 'up' | 'down' | 'neutral'
  label?: string
  size?: 'small' | 'medium' | 'large'
  showIcon?: boolean
}

const Container = styled.div<{ $size: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return props.theme.typography.fontSize.sm
      case 'large':
        return props.theme.typography.fontSize.lg
      default:
        return props.theme.typography.fontSize.base
    }
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
`

const TrendIcon = styled.span<{ $trend: 'up' | 'down' | 'neutral' }>`
  color: ${(props) => {
    switch (props.$trend) {
      case 'up':
        return props.theme.colors.success
      case 'down':
        return props.theme.colors.error
      default:
        return props.theme.colors.text.secondary
    }
  }};
  font-size: 1.2em;
`

const Value = styled.span<{ $trend: 'up' | 'down' | 'neutral' }>`
  color: ${(props) => {
    switch (props.$trend) {
      case 'up':
        return props.theme.colors.success
      case 'down':
        return props.theme.colors.error
      default:
        return props.theme.colors.text.secondary
    }
  }};
`

const Label = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
`

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  trend,
  label,
  size = 'medium',
  showIcon = true
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  return (
    <Container $size={size}>
      {showIcon && <TrendIcon $trend={trend}>{getTrendIcon()}</TrendIcon>}
      <Value $trend={trend}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </Value>
      {label && <Label>{label}</Label>}
    </Container>
  )
}
