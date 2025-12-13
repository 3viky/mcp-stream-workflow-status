import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Spinner } from '../primitives/Spinner'

export interface DraftAutosaveProps {
  status: 'saved' | 'saving' | 'unsaved' | 'error'
  lastSaved?: Date
  onSave: () => Promise<void>
  autoSaveInterval?: number
  showManualSaveButton?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const StatusIndicator = styled.div<{ $status: 'saved' | 'saving' | 'unsaved' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  color: ${(props) => {
    switch (props.$status) {
      case 'saved':
        return props.theme.colors.success || '#22c55e'
      case 'saving':
        return props.theme.colors.text.secondary
      case 'unsaved':
        return props.theme.colors.warning || '#f59e0b'
      case 'error':
        return props.theme.colors.error || '#ef4444'
      default:
        return props.theme.colors.text
    }
  }};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`

const StatusIcon = styled.div<{ $status: 'saved' | 'saving' | 'unsaved' | 'error' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 16px;

  ${(props) => {
    if (props.$status === 'saved') {
      return `
        &::before {
          content: '✓';
          color: ${props.theme.colors.success || '#22c55e'};
        }
      `
    } else if (props.$status === 'unsaved') {
      return `
        &::before {
          content: '●';
          color: ${props.theme.colors.warning || '#f59e0b'};
        }
      `
    } else if (props.$status === 'error') {
      return `
        &::before {
          content: '✕';
          color: ${props.theme.colors.error || '#ef4444'};
        }
      `
    }
    return ''
  }}
`

const StatusText = styled.span``

const LastSavedTime = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-left: ${(props) => props.theme.spacing.xs};
`

const Spacer = styled.div`
  flex: 1;
`

const getStatusText = (status: 'saved' | 'saving' | 'unsaved' | 'error'): string => {
  switch (status) {
    case 'saved':
      return 'All changes saved'
    case 'saving':
      return 'Saving...'
    case 'unsaved':
      return 'Unsaved changes'
    case 'error':
      return 'Error saving'
    default:
      return ''
  }
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  if (diffSec < 10) return 'just now'
  if (diffSec < 60) return `${diffSec} seconds ago`
  if (diffMin === 1) return '1 minute ago'
  if (diffMin < 60) return `${diffMin} minutes ago`
  if (diffHr === 1) return '1 hour ago'
  if (diffHr < 24) return `${diffHr} hours ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

export const DraftAutosave: React.FC<DraftAutosaveProps> = ({
  status,
  lastSaved,
  onSave,
  autoSaveInterval = 30000, // 30 seconds
  showManualSaveButton = true
}) => {
  const intervalRef = useRef<NodeJS.Timeout>()
  const [relativeTime, setRelativeTime] = React.useState<string>('')

  // Auto-save interval
  useEffect(() => {
    if (autoSaveInterval > 0 && status === 'unsaved') {
      intervalRef.current = setInterval(() => {
        onSave()
      }, autoSaveInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [autoSaveInterval, status, onSave])

  // Update relative time display
  useEffect(() => {
    if (lastSaved) {
      setRelativeTime(formatRelativeTime(lastSaved))

      const updateInterval = setInterval(() => {
        setRelativeTime(formatRelativeTime(lastSaved))
      }, 10000) // Update every 10 seconds

      return () => clearInterval(updateInterval)
    }
  }, [lastSaved])

  const handleManualSave = async () => {
    await onSave()
  }

  return (
    <Container>
      <StatusIndicator $status={status}>
        {status === 'saving' ? (
          <Spinner />
        ) : (
          <StatusIcon $status={status} />
        )}
        <StatusText>{getStatusText(status)}</StatusText>
      </StatusIndicator>

      {lastSaved && status !== 'saving' && (
        <LastSavedTime>
          Last saved {relativeTime}
        </LastSavedTime>
      )}

      <Spacer />

      {showManualSaveButton && (
        <Button
          size="sm"
          variant={status === 'unsaved' ? 'primary' : 'ghost'}
          onClick={handleManualSave}
          disabled={status === 'saving' || status === 'saved'}
        >
          {status === 'saving' ? 'Saving...' : 'Save Now'}
        </Button>
      )}
    </Container>
  )
}
