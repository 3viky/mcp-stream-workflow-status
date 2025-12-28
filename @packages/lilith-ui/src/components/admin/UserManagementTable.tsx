import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { DataTable } from '../data/DataTable'
import type { Column } from '../data/DataTable'
import { Checkbox } from '../primitives/Checkbox'
import { Button } from '../primitives/Button'
import { StatusBadge } from '../primitives/StatusBadge'
import { BulkActionToolbar } from './BulkActionToolbar'
import type { BulkAction } from './BulkActionToolbar'
import { formatDate } from '../../utils/formatters'

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'suspended' | 'banned'
  createdAt: Date
}

export interface ColumnConfig {
  visible: string[]
  order: string[]
}

export interface UserManagementTableProps {
  users: User[]
  onBulkAction?: (action: string, userIds: string[]) => void
  onUserEdit?: (user: User) => void
  onUserDelete?: (userId: string) => void
  loading?: boolean
  columnConfig?: ColumnConfig
  onColumnConfigChange?: (config: ColumnConfig) => void
}

const TableWrapper = styled.div`
  position: relative;
`

const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${(props) => props.theme.spacing.md};
`

const ColumnConfigButton = styled.div`
  position: relative;
`

const ColumnConfigDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${(props) => props.theme.spacing.xs};
  min-width: 280px;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: ${(props) => props.theme.spacing.md};
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  z-index: 1000;
`

const DropdownHeader = styled.h4`
  margin: 0 0 ${(props) => props.theme.spacing.md} 0;
  font-size: ${(props) => props.theme.typography.fontSize.base};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
`

const ColumnCheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
  max-height: 300px;
  overflow-y: auto;
`

const ColumnCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  cursor: pointer;
  user-select: none;
  padding: ${(props) => props.theme.spacing.xs};
  border-radius: ${(props) => props.theme.borderRadius.sm};

  &:hover {
    background: ${(props) => props.theme.colors.hover.primary};
  }
`

const ColumnLabel = styled.span`
  flex: 1;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const ColumnOrderControls = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
`

const OrderButton = styled.button`
  padding: ${(props) => props.theme.spacing.xs};
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.hover.primary};
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`

const DEFAULT_COLUMN_ORDER = ['select', 'name', 'email', 'role', 'status', 'createdAt', 'actions']
const DEFAULT_VISIBLE_COLUMNS = ['select', 'name', 'email', 'role', 'status', 'createdAt', 'actions']

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onBulkAction,
  onUserEdit,
  onUserDelete,
  loading = false,
  columnConfig,
  onColumnConfigChange
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [_selectAll, setSelectAll] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentConfig: ColumnConfig = useMemo(() => columnConfig || {
    visible: DEFAULT_VISIBLE_COLUMNS,
    order: DEFAULT_COLUMN_ORDER
  }, [columnConfig])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsConfigOpen(false)
      }
    }

    if (isConfigOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isConfigOpen])

  const handleSelectUser = useCallback((userId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedIds(newSelected)
    setSelectAll(false)
  }, [selectedIds])

  const handleBulkAction = (actionId: string) => {
    if (onBulkAction && selectedIds.size > 0) {
      onBulkAction(actionId, Array.from(selectedIds))
      setSelectedIds(new Set())
      setSelectAll(false)
    }
  }

  const handleColumnToggle = (columnKey: string) => {
    if (!onColumnConfigChange) return

    const newVisible = currentConfig.visible.includes(columnKey)
      ? currentConfig.visible.filter((k) => k !== columnKey)
      : [...currentConfig.visible, columnKey]

    onColumnConfigChange({
      ...currentConfig,
      visible: newVisible
    })
  }

  const handleMoveColumn = (columnKey: string, direction: 'up' | 'down') => {
    if (!onColumnConfigChange) return

    const currentIndex = currentConfig.order.indexOf(columnKey)
    if (currentIndex === -1) return

    const newOrder = [...currentConfig.order]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= newOrder.length) return

    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]]

    onColumnConfigChange({
      ...currentConfig,
      order: newOrder
    })
  }

  const bulkActions: BulkAction[] = [
    { id: 'activate', label: 'Activate', variant: 'secondary' },
    { id: 'suspend', label: 'Suspend', variant: 'secondary' },
    { id: 'delete', label: 'Delete', variant: 'danger', confirmRequired: true }
  ]

  const allColumns: { [key: string]: Column<User> } = useMemo(() => ({
    select: {
      key: 'select',
      header: '',
      render: (user) => (
        <Checkbox
          checked={selectedIds.has(user.id)}
          onChange={() => handleSelectUser(user.id)}
          aria-label={`Select ${user.name}`}
        />
      )
    },
    name: {
      key: 'name',
      header: 'Name',
      render: (user) => user.name
    },
    email: {
      key: 'email',
      header: 'Email',
      render: (user) => user.email
    },
    role: {
      key: 'role',
      header: 'Role',
      render: (user) => user.role
    },
    status: {
      key: 'status',
      header: 'Status',
      render: (user) => {
        const variantMap = {
          active: 'success' as const,
          suspended: 'warning' as const,
          banned: 'error' as const
        }
        return <StatusBadge variant={variantMap[user.status]}>{user.status}</StatusBadge>
      }
    },
    createdAt: {
      key: 'createdAt',
      header: 'Created',
      render: (user) => formatDate(user.createdAt)
    },
    actions: {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <Actions>
          {onUserEdit && (
            <Button variant="secondary" size="sm" onClick={() => onUserEdit(user)}>
              Edit
            </Button>
          )}
          {onUserDelete && (
            <Button variant="danger" size="sm" onClick={() => onUserDelete(user.id)}>
              Delete
            </Button>
          )}
        </Actions>
      )
    }
  }), [selectedIds, handleSelectUser, onUserEdit, onUserDelete])

  const visibleColumns = useMemo(() => {
    return currentConfig.order
      .filter((key) => currentConfig.visible.includes(key))
      .map((key) => allColumns[key])
      .filter(Boolean)
  }, [currentConfig, allColumns])

  const columnLabels: { [key: string]: string } = {
    select: 'Select',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    createdAt: 'Created',
    actions: 'Actions'
  }

  return (
    <TableWrapper>
      {onColumnConfigChange && (
        <TableHeader>
          <ColumnConfigButton ref={dropdownRef}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              aria-label="Configure columns"
            >
              Configure Columns
            </Button>
            <ColumnConfigDropdown $isOpen={isConfigOpen}>
              <DropdownHeader>Column Settings</DropdownHeader>
              <ColumnCheckboxList>
                {currentConfig.order.map((columnKey, index) => (
                  <ColumnCheckboxItem key={columnKey}>
                    <Checkbox
                      checked={currentConfig.visible.includes(columnKey)}
                      onChange={() => handleColumnToggle(columnKey)}
                      disabled={columnKey === 'select' || columnKey === 'actions'}
                    />
                    <ColumnLabel>{columnLabels[columnKey] || columnKey}</ColumnLabel>
                    <ColumnOrderControls>
                      <OrderButton
                        onClick={() => handleMoveColumn(columnKey, 'up')}
                        disabled={index === 0}
                        aria-label={`Move ${columnLabels[columnKey]} up`}
                        type="button"
                      >
                        ↑
                      </OrderButton>
                      <OrderButton
                        onClick={() => handleMoveColumn(columnKey, 'down')}
                        disabled={index === currentConfig.order.length - 1}
                        aria-label={`Move ${columnLabels[columnKey]} down`}
                        type="button"
                      >
                        ↓
                      </OrderButton>
                    </ColumnOrderControls>
                  </ColumnCheckboxItem>
                ))}
              </ColumnCheckboxList>
            </ColumnConfigDropdown>
          </ColumnConfigButton>
        </TableHeader>
      )}
      <BulkActionToolbar
        selectedCount={selectedIds.size}
        actions={bulkActions}
        onAction={handleBulkAction}
        onClearSelection={() => {
          setSelectedIds(new Set())
          setSelectAll(false)
        }}
        loading={loading}
      />
      <DataTable columns={visibleColumns} data={users} keyExtractor={(user) => user.id} isLoading={loading} />
    </TableWrapper>
  )
}
