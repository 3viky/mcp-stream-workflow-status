/**
 * ReportButton Component
 *
 * Button for reporting abusive content or users in the creator community
 */

import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Flag, AlertTriangle } from 'lucide-react'

export interface ReportButtonProps {
  variant?: 'icon' | 'text' | 'text-icon'
  size?: 'sm' | 'md' | 'lg'
  isReported?: boolean
  isDisabled?: boolean
  label?: string
  onClick: () => void
  className?: string
}

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
`

const Button = styled.button<{
  $variant: 'icon' | 'text' | 'text-icon'
  $size: 'sm' | 'md' | 'lg'
  $isReported: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius?.md ?? '8px'};
  background: ${(props) =>
    props.$isReported
      ? 'rgba(239, 68, 68, 0.15)'
      : 'transparent'};
  color: ${(props) =>
    props.$isReported
      ? props.theme.colors?.error ?? '#ef4444'
      : props.theme.colors?.text?.secondary ?? '#9ca3af'};
  cursor: pointer;
  transition: all 0.2s ease;

  padding: ${(props) => {
    if (props.$variant === 'icon') {
      switch (props.$size) {
        case 'sm':
          return '6px'
        case 'lg':
          return '12px'
        default:
          return '8px'
      }
    }
    switch (props.$size) {
      case 'sm':
        return '4px 10px'
      case 'lg':
        return '10px 18px'
      default:
        return '6px 14px'
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

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.1);
    color: ${(props) => props.theme.colors?.error ?? '#ef4444'};

    svg {
      animation: ${shake} 0.3s ease;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Label = styled.span`
  font-weight: 500;
`

const ReportedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.15);
  color: ${(props) => props.theme.colors?.error ?? '#ef4444'};
  font-size: 12px;
  font-weight: 500;
`

export function ReportButton({
  variant = 'text-icon',
  size = 'md',
  isReported = false,
  isDisabled = false,
  label = 'Report',
  onClick,
  className,
}: ReportButtonProps) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16

  if (isReported) {
    return (
      <ReportedBadge className={className}>
        <AlertTriangle size={12} />
        Reported
      </ReportedBadge>
    )
  }

  return (
    <Button
      $variant={variant}
      $size={size}
      $isReported={isReported}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
      aria-label={label}
    >
      {(variant === 'icon' || variant === 'text-icon') && <Flag size={iconSize} />}
      {(variant === 'text' || variant === 'text-icon') && <Label>{label}</Label>}
    </Button>
  )
}

// Quick report dropdown for common reasons
export interface QuickReportOption {
  value: string
  label: string
  description?: string
}

export interface QuickReportButtonProps extends Omit<ReportButtonProps, 'onClick'> {
  options?: QuickReportOption[]
  onReport: (reason: string) => void
}

const QuickReportContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 200px;
  background: ${(props) => props.theme.colors?.surface ?? '#1f2937'};
  border: 1px solid ${(props) => props.theme.colors?.border ?? '#374151'};
  border-radius: ${(props) => props.theme.borderRadius?.md ?? '8px'};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  z-index: 50;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transform: translateY(${(props) => (props.$isOpen ? '0' : '-8px')});
  transition: all 0.2s ease;
`

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors?.text?.primary ?? '#ffffff'};
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:hover {
    background: ${(props) => props.theme.colors?.background ?? '#111827'};
  }
`

const DropdownItemLabel = styled.span`
  display: block;
  font-weight: 500;
  font-size: 14px;
`

const DropdownItemDescription = styled.span`
  display: block;
  font-size: 12px;
  color: ${(props) => props.theme.colors?.text?.secondary ?? '#9ca3af'};
  margin-top: 2px;
`

const DEFAULT_REPORT_OPTIONS: QuickReportOption[] = [
  { value: 'spam', label: 'Spam', description: 'Repetitive or promotional content' },
  { value: 'harassment', label: 'Harassment', description: 'Bullying or abusive behavior' },
  { value: 'impersonation', label: 'Impersonation', description: 'Pretending to be someone else' },
  { value: 'other', label: 'Other', description: 'Report for another reason' },
]

export function QuickReportButton({
  options = DEFAULT_REPORT_OPTIONS,
  onReport,
  isReported,
  isDisabled,
  size = 'md',
  className,
}: QuickReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (isReported) {
    return (
      <ReportedBadge className={className}>
        <AlertTriangle size={12} />
        Reported
      </ReportedBadge>
    )
  }

  return (
    <QuickReportContainer className={className}>
      <ReportButton
        variant="icon"
        size={size}
        isDisabled={isDisabled}
        onClick={() => setIsOpen(!isOpen)}
      />
      <DropdownMenu $isOpen={isOpen}>
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => {
              onReport(option.value)
              setIsOpen(false)
            }}
          >
            <DropdownItemLabel>{option.label}</DropdownItemLabel>
            {option.description && (
              <DropdownItemDescription>{option.description}</DropdownItemDescription>
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </QuickReportContainer>
  )
}
