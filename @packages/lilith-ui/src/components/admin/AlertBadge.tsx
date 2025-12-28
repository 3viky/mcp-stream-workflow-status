import React from 'react'
import styled, { css, keyframes } from 'styled-components'

export interface AlertBadgeProps {
  count: number
  max?: number
  variant?: 'info' | 'warning' | 'error' | 'success'
  pulse?: boolean
  invisible?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  children?: React.ReactNode
}

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
`

const Wrapper = styled.div<{ hasChildren: boolean }>`
  ${(props) =>
    props.hasChildren &&
    css`
      position: relative;
      display: inline-flex;
    `}
`

const Badge = styled.span<{
  $variant: 'info' | 'warning' | 'error' | 'success'
  $pulse: boolean
  $invisible: boolean
  $position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  $hasChildren: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: 600;
  line-height: 1;
  border-radius: 10px;
  color: ${(props) => props.theme.colors.background};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$invisible ? 0 : 1)};
  pointer-events: ${(props) => (props.$invisible ? 'none' : 'auto')};

  ${(props) => {
    const variantColors = {
      info: props.theme.colors.primary,
      warning: props.theme.colors.warning,
      error: props.theme.colors.error,
      success: props.theme.colors.success
    }
    return css`
      background: ${variantColors[props.$variant]};
    `
  }}

  ${(props) =>
    props.$pulse &&
    css`
      animation: ${pulseAnimation} 2s ease-in-out infinite;
    `}

  ${(props) =>
    props.$hasChildren &&
    css`
      position: absolute;
      ${props.$position === 'top-right' &&
      css`
        top: -8px;
        right: -8px;
      `}
      ${props.$position === 'top-left' &&
      css`
        top: -8px;
        left: -8px;
      `}
      ${props.$position === 'bottom-right' &&
      css`
        bottom: -8px;
        right: -8px;
      `}
      ${props.$position === 'bottom-left' &&
      css`
        bottom: -8px;
        left: -8px;
      `}
    `}
`

export const AlertBadge: React.FC<AlertBadgeProps> = ({
  count,
  max = 99,
  variant = 'info',
  pulse = false,
  invisible = false,
  position = 'top-right',
  children
}) => {
  const displayCount = count > max ? `${max}+` : count.toString()
  const hasChildren = Boolean(children)

  const badge = (
    <Badge
      $variant={variant}
      $pulse={pulse}
      $invisible={invisible}
      $position={position}
      $hasChildren={hasChildren}
      role="status"
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </Badge>
  )

  if (children) {
    return (
      <Wrapper hasChildren={hasChildren}>
        {children}
        {badge}
      </Wrapper>
    )
  }

  return badge
}
