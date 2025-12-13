/**
 * VoteButton Component
 *
 * Upvote/downvote button for forum threads and replies
 */

import { useState, useCallback } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { ChevronUp, ChevronDown } from 'lucide-react'

export type VoteType = 'upvote' | 'downvote'

export interface VoteButtonProps {
  voteType: VoteType
  count: number
  isActive?: boolean
  isDisabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  onVote: () => void
  className?: string
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`

const Container = styled.button<{
  $voteType: VoteType
  $isActive: boolean
  $size: 'sm' | 'md' | 'lg'
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '4px 8px'
      case 'lg':
        return '8px 16px'
      default:
        return '6px 12px'
    }
  }};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius?.md ?? '8px'};
  background: ${(props) =>
    props.$isActive
      ? props.$voteType === 'upvote'
        ? 'rgba(34, 197, 94, 0.15)'
        : 'rgba(239, 68, 68, 0.15)'
      : 'transparent'};
  color: ${(props) => {
    if (props.$isActive) {
      return props.$voteType === 'upvote'
        ? props.theme.colors?.success ?? '#22c55e'
        : props.theme.colors?.error ?? '#ef4444'
    }
    return props.theme.colors?.text?.secondary ?? '#9ca3af'
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '12px'
      case 'lg':
        return '16px'
      default:
        return '14px'
    }
  }};
  font-weight: 500;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$voteType === 'upvote'
        ? 'rgba(34, 197, 94, 0.1)'
        : 'rgba(239, 68, 68, 0.1)'};
    color: ${(props) =>
      props.$voteType === 'upvote'
        ? props.theme.colors?.success ?? '#22c55e'
        : props.theme.colors?.error ?? '#ef4444'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$isActive &&
    css`
      svg {
        animation: ${pulse} 0.3s ease;
      }
    `}
`

const IconWrapper = styled.span<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '16px'
      case 'lg':
        return '24px'
      default:
        return '20px'
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return '16px'
      case 'lg':
        return '24px'
      default:
        return '20px'
    }
  }};
`

const Count = styled.span`
  min-width: 1ch;
  text-align: center;
`

export function VoteButton({
  voteType,
  count,
  isActive = false,
  isDisabled = false,
  size = 'md',
  showCount = true,
  onVote,
  className,
}: VoteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = useCallback(() => {
    if (isDisabled) return
    setIsAnimating(true)
    onVote()
    setTimeout(() => setIsAnimating(false), 300)
  }, [isDisabled, onVote])

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20
  const Icon = voteType === 'upvote' ? ChevronUp : ChevronDown

  return (
    <Container
      $voteType={voteType}
      $isActive={isActive || isAnimating}
      $size={size}
      disabled={isDisabled}
      onClick={handleClick}
      className={className}
      aria-label={`${voteType === 'upvote' ? 'Upvote' : 'Downvote'} (${count} votes)`}
      aria-pressed={isActive}
    >
      <IconWrapper $size={size}>
        <Icon size={iconSize} />
      </IconWrapper>
      {showCount && <Count>{formatCount(count)}</Count>}
    </Container>
  )
}

function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return String(count)
}

// Combined vote control with both buttons
export interface VoteControlProps {
  upvotes: number
  downvotes: number
  myVote: VoteType | null
  isDisabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
  onVote: (voteType: VoteType) => void
  className?: string
}

const VoteControlContainer = styled.div<{ $layout: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${(props) => (props.$layout === 'vertical' ? 'column' : 'row')};
  align-items: center;
  gap: ${(props) => (props.$layout === 'vertical' ? '0' : '4px')};
`

const VoteScore = styled.span<{ $positive: boolean; $negative: boolean }>`
  font-weight: 600;
  font-size: 14px;
  min-width: 2ch;
  text-align: center;
  color: ${(props) => {
    if (props.$positive) return props.theme.colors?.success ?? '#22c55e'
    if (props.$negative) return props.theme.colors?.error ?? '#ef4444'
    return props.theme.colors?.text?.primary ?? '#ffffff'
  }};
`

export function VoteControl({
  upvotes,
  downvotes,
  myVote,
  isDisabled = false,
  size = 'md',
  layout = 'horizontal',
  onVote,
  className,
}: VoteControlProps) {
  const score = upvotes - downvotes

  return (
    <VoteControlContainer $layout={layout} className={className}>
      <VoteButton
        voteType="upvote"
        count={upvotes}
        isActive={myVote === 'upvote'}
        isDisabled={isDisabled}
        size={size}
        showCount={false}
        onVote={() => onVote('upvote')}
      />
      <VoteScore $positive={score > 0} $negative={score < 0}>
        {formatCount(score)}
      </VoteScore>
      <VoteButton
        voteType="downvote"
        count={downvotes}
        isActive={myVote === 'downvote'}
        isDisabled={isDisabled}
        size={size}
        showCount={false}
        onVote={() => onVote('downvote')}
      />
    </VoteControlContainer>
  )
}
