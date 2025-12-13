import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Spinner } from '../primitives/Spinner'

export interface BulkAction {
  id: string
  label: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  confirmRequired?: boolean
}

export interface BulkActionToolbarProps {
  selectedCount: number
  actions: BulkAction[]
  onAction: (actionId: string) => void | Promise<void>
  onClearSelection: () => void
  loading?: boolean
}

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`

const Count = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.primary};
`

const Label = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const ActionGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  margin-left: auto;
`

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCount,
  actions,
  onAction,
  onClearSelection,
  loading = false
}) => {
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  const handleAction = async (actionId: string) => {
    const action = actions.find(a => a.id === actionId)

    if (action?.confirmRequired) {
      const confirmed = window.confirm(`Are you sure you want to perform this action on ${selectedCount} items?`)
      if (!confirmed) return
    }

    setProcessingAction(actionId)
    try {
      await onAction(actionId)
    } finally {
      setProcessingAction(null)
    }
  }

  if (selectedCount === 0) return null

  return (
    <Toolbar>
      <SelectionInfo>
        <Count>{selectedCount}</Count>
        <Label>item{selectedCount !== 1 ? 's' : ''} selected</Label>
      </SelectionInfo>

      {loading || processingAction ? (
        <LoadingOverlay>
          <Spinner size="sm" />
          <span>Processing...</span>
        </LoadingOverlay>
      ) : (
        <ActionGroup>
          {actions.map(action => (
            <Button
              key={action.id}
              variant={action.variant || 'secondary'}
              size="sm"
              onClick={() => handleAction(action.id)}
              disabled={loading}
            >
              {action.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={loading}
          >
            Clear
          </Button>
        </ActionGroup>
      )}
    </Toolbar>
  )
}
