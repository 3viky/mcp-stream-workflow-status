import React from 'react'
import styled, { keyframes } from 'styled-components'

export interface TypingIndicatorProps {
  users?: string[]
  variant?: 'default' | 'compact'
}

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
`

const Container = styled.div<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => {
    if (props.$variant === 'compact') return props.theme.spacing.xs
    return `${props.theme.spacing.sm} ${props.theme.spacing.md}`
  }};
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.full};
`

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.text.secondary};
  animation: ${bounce} 1.4s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`

const Label = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  font-style: italic;
`

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users,
  variant = 'default'
}) => {
  const getLabel = () => {
    if (!users || users.length === 0) return 'Someone is typing'
    if (users.length === 1) return `${users[0]} is typing`
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing`
    return `${users[0]} and ${users.length - 1} others are typing`
  }

  return (
    <Container $variant={variant}>
      <DotsContainer>
        <Dot />
        <Dot />
        <Dot />
      </DotsContainer>
      {variant === 'default' && <Label>{getLabel()}</Label>}
    </Container>
  )
}
