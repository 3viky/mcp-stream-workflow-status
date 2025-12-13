import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export interface RealtimeCounterProps {
  value: number
  label?: string
  formatValue?: (value: number) => string
  trend?: 'up' | 'down' | 'neutral'
  animationDuration?: number
  variant?: 'default' | 'large'
}

const Container = styled.div<{ $variant: string }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => {
    if (props.$variant === 'large') return props.theme.spacing.lg
    return props.theme.spacing.md
  }};
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const Value = styled.div<{ $variant: string; $trend?: string }>`
  font-size: ${(props) => {
    if (props.$variant === 'large') return props.theme.typography.fontSize['3xl']
    return props.theme.typography.fontSize['2xl']
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => {
    switch (props.$trend) {
      case 'up':
        return props.theme.colors.success
      case 'down':
        return props.theme.colors.error
      default:
        return props.theme.colors.text
    }
  }};
  line-height: 1;
  transition: color 0.3s;
`

const Label = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TrendIndicator = styled.span<{ $trend: string }>`
  margin-left: ${(props) => props.theme.spacing.xs};
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

export const RealtimeCounter: React.FC<RealtimeCounterProps> = ({
  value,
  label,
  formatValue = (val) => val.toLocaleString(),
  trend,
  animationDuration = 500,
  variant = 'default'
}) => {
  const [displayValue, setDisplayValue] = useState(value)
  const [_isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true)
      const startValue = displayValue
      const diff = value - startValue
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animationDuration, 1)

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(startValue + diff * eased)

        setDisplayValue(current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [value, displayValue, animationDuration])

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return ''
    }
  }

  return (
    <Container $variant={variant}>
      <Value $variant={variant} $trend={trend}>
        {formatValue(displayValue)}
        {trend && <TrendIndicator $trend={trend}>{getTrendIcon()}</TrendIndicator>}
      </Value>
      {label && <Label>{label}</Label>}
    </Container>
  )
}
