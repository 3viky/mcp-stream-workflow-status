/**
 * CommunityAccessBadge Component
 *
 * Displays the user's community access status and ban level
 */

import styled, { keyframes } from 'styled-components'
import { Shield, ShieldAlert, ShieldOff, ShieldCheck, ShieldX, Clock } from 'lucide-react'

export type BanLevel = 'none' | 'shadow_ban' | 'community_ban' | 'suspended' | 'permanent'

export interface CommunityAccessBadgeProps {
  hasAccess: boolean
  banLevel: BanLevel
  banReason?: string | null
  banExpiresAt?: Date | null
  size?: 'sm' | 'md' | 'lg'
  variant?: 'badge' | 'inline' | 'detailed'
  showIcon?: boolean
  className?: string
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

const BadgeContainer = styled.div<{
  $status: 'active' | 'warning' | 'error' | 'pending'
  $size: 'sm' | 'md' | 'lg'
  $variant: 'badge' | 'inline' | 'detailed'
}>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.$size === 'sm' ? '4px' : props.$size === 'lg' ? '10px' : '6px')};
  padding: ${(props) => {
    if (props.$variant === 'inline') return '0'
    switch (props.$size) {
      case 'sm':
        return '4px 8px'
      case 'lg':
        return '10px 16px'
      default:
        return '6px 12px'
    }
  }};
  border-radius: ${(props) => props.theme.borderRadius?.md ?? '8px'};
  background: ${(props) => {
    if (props.$variant === 'inline') return 'transparent'
    switch (props.$status) {
      case 'active':
        return 'rgba(34, 197, 94, 0.15)'
      case 'warning':
        return 'rgba(245, 158, 11, 0.15)'
      case 'error':
        return 'rgba(239, 68, 68, 0.15)'
      case 'pending':
        return 'rgba(156, 163, 175, 0.15)'
      default:
        return 'transparent'
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors?.success ?? '#22c55e'
      case 'warning':
        return props.theme.colors?.warning ?? '#f59e0b'
      case 'error':
        return props.theme.colors?.error ?? '#ef4444'
      case 'pending':
        return props.theme.colors?.text?.secondary ?? '#9ca3af'
      default:
        return props.theme.colors?.text?.primary ?? '#ffffff'
    }
  }};
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
`

const IconWrapper = styled.span<{ $status: 'active' | 'warning' | 'error' | 'pending' }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.$status === 'pending' &&
    `
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`

const Label = styled.span``

const DetailedContainer = styled.div<{ $status: 'active' | 'warning' | 'error' | 'pending' }>`
  padding: 16px;
  border-radius: ${(props) => props.theme.borderRadius?.lg ?? '12px'};
  background: ${(props) => props.theme.colors?.surface ?? '#1f2937'};
  border: 1px solid ${(props) => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors?.success ?? '#22c55e'
      case 'warning':
        return props.theme.colors?.warning ?? '#f59e0b'
      case 'error':
        return props.theme.colors?.error ?? '#ef4444'
      default:
        return props.theme.colors?.border ?? '#374151'
    }
  }};
`

const DetailedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

const DetailedTitle = styled.h4<{ $status: 'active' | 'warning' | 'error' | 'pending' }>`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors?.success ?? '#22c55e'
      case 'warning':
        return props.theme.colors?.warning ?? '#f59e0b'
      case 'error':
        return props.theme.colors?.error ?? '#ef4444'
      default:
        return props.theme.colors?.text?.primary ?? '#ffffff'
    }
  }};
`

const DetailedDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${(props) => props.theme.colors?.text?.secondary ?? '#9ca3af'};
  line-height: 1.5;
`

const ExpiryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${(props) => props.theme.colors?.border ?? '#374151'};
  font-size: 13px;
  color: ${(props) => props.theme.colors?.text?.secondary ?? '#9ca3af'};
`

function getStatusFromBanLevel(
  hasAccess: boolean,
  banLevel: BanLevel
): 'active' | 'warning' | 'error' | 'pending' {
  if (!hasAccess && banLevel === 'none') return 'pending'
  if (hasAccess && banLevel === 'none') return 'active'
  if (banLevel === 'shadow_ban') return 'warning'
  return 'error'
}

function getIcon(banLevel: BanLevel, hasAccess: boolean, size: number) {
  if (!hasAccess && banLevel === 'none') return <Shield size={size} />
  if (banLevel === 'none') return <ShieldCheck size={size} />
  if (banLevel === 'shadow_ban') return <ShieldAlert size={size} />
  if (banLevel === 'suspended') return <ShieldOff size={size} />
  return <ShieldX size={size} />
}

function getLabel(banLevel: BanLevel, hasAccess: boolean): string {
  if (!hasAccess && banLevel === 'none') return 'Pending Access'
  if (banLevel === 'none') return 'Active Member'
  if (banLevel === 'shadow_ban') return 'Limited'
  if (banLevel === 'community_ban') return 'Banned'
  if (banLevel === 'suspended') return 'Suspended'
  return 'Permanently Banned'
}

function getDescription(banLevel: BanLevel, hasAccess: boolean, banReason?: string | null): string {
  if (!hasAccess && banLevel === 'none') {
    return 'Your community access request is being processed. This usually takes 3 days after verification.'
  }
  if (banLevel === 'none') {
    return 'You have full access to the creator community features including direct messaging and forums.'
  }
  if (banLevel === 'shadow_ban') {
    return 'Your posts and messages may have limited visibility. Continue participating positively to restore full access.'
  }
  if (banLevel === 'community_ban') {
    return banReason ?? 'Your access to community features has been revoked due to policy violations.'
  }
  if (banLevel === 'suspended') {
    return banReason ?? 'Your account has been temporarily suspended from community features.'
  }
  return banReason ?? 'Your account has been permanently banned from community features.'
}

export function CommunityAccessBadge({
  hasAccess,
  banLevel,
  banReason,
  banExpiresAt,
  size = 'md',
  variant = 'badge',
  showIcon = true,
  className,
}: CommunityAccessBadgeProps) {
  const status = getStatusFromBanLevel(hasAccess, banLevel)
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16
  const label = getLabel(banLevel, hasAccess)

  if (variant === 'detailed') {
    const description = getDescription(banLevel, hasAccess, banReason)

    return (
      <DetailedContainer $status={status} className={className}>
        <DetailedHeader>
          <IconWrapper $status={status}>
            {getIcon(banLevel, hasAccess, 24)}
          </IconWrapper>
          <DetailedTitle $status={status}>{label}</DetailedTitle>
        </DetailedHeader>
        <DetailedDescription>{description}</DetailedDescription>
        {banExpiresAt && (
          <ExpiryInfo>
            <Clock size={14} />
            Expires: {new Date(banExpiresAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </ExpiryInfo>
        )}
      </DetailedContainer>
    )
  }

  return (
    <BadgeContainer
      $status={status}
      $size={size}
      $variant={variant}
      className={className}
    >
      {showIcon && (
        <IconWrapper $status={status}>
          {getIcon(banLevel, hasAccess, iconSize)}
        </IconWrapper>
      )}
      <Label>{label}</Label>
    </BadgeContainer>
  )
}

// Simple status dot for inline use
export interface StatusDotProps {
  hasAccess: boolean
  banLevel: BanLevel
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Dot = styled.span<{ $status: 'active' | 'warning' | 'error' | 'pending'; $size: 'sm' | 'md' | 'lg' }>`
  display: inline-block;
  width: ${(props) => (props.$size === 'sm' ? '8px' : props.$size === 'lg' ? '14px' : '10px')};
  height: ${(props) => (props.$size === 'sm' ? '8px' : props.$size === 'lg' ? '14px' : '10px')};
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors?.success ?? '#22c55e'
      case 'warning':
        return props.theme.colors?.warning ?? '#f59e0b'
      case 'error':
        return props.theme.colors?.error ?? '#ef4444'
      default:
        return props.theme.colors?.text?.secondary ?? '#9ca3af'
    }
  }};

  ${(props) =>
    props.$status === 'active' &&
    `
    box-shadow: 0 0 8px ${props.theme.colors?.success ?? '#22c55e'};
  `}
`

export function StatusDot({ hasAccess, banLevel, size = 'md', className }: StatusDotProps) {
  const status = getStatusFromBanLevel(hasAccess, banLevel)
  return <Dot $status={status} $size={size} className={className} />
}
