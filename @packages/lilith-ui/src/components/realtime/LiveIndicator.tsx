import React from 'react'
import styled, { keyframes } from 'styled-components'

export interface LiveIndicatorProps {
  label?: string
  variant?: 'default' | 'compact'
  color?: string
}

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const Container = styled.div<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => {
    if (props.$variant === 'compact') return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`
    return `${props.theme.spacing.sm} ${props.theme.spacing.md}`
  }};
  background: ${(props) => props.theme.colors.error}20;
  border-radius: ${(props) => props.theme.borderRadius.full};
`

const Dot = styled.div<{ $color?: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.$color || props.theme.colors.error};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`

const Label = styled.span<{ $variant: string; $color?: string }>`
  color: ${(props) => props.$color || props.theme.colors.error};
  font-size: ${(props) => {
    if (props.$variant === 'compact') return props.theme.typography.fontSize.xs
    return props.theme.typography.fontSize.sm
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  label = 'LIVE',
  variant = 'default',
  color
}) => {
  return (
    <Container $variant={variant}>
      <Dot $color={color} />
      <Label $variant={variant} $color={color}>
        {label}
      </Label>
    </Container>
  )
}
