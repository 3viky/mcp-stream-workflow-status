/**
 * DataTable Component
 *
 * Theme-agnostic data table with sorting, loading states, and custom renderers.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 *
 * IMPORTANT: This component preserves ALL business logic from cyberpunk-ui/ui-table.
 * Only styling has been converted to styled-components with semantic tokens.
 */

import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { ArrowUp, ArrowDown } from 'lucide-react'

/**
 * Column definition for DataTable
 */
export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
}

/**
 * DataTable component props
 */
export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onSort?: (key: string) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onRowClick?: (row: T) => void
  emptyMessage?: string
  isLoading?: boolean
}

// Styled Components

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};

  /* Cyberpunk neon border glow */
  ${props => props.theme.extensions?.cyberpunk && css`
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 10px ${props.theme.colors.primary}33;
  `}
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  ${props => props.theme.extensions?.cyberpunk && css`
    background-color: ${props.theme.colors.primary}15;
    border-bottom-color: ${props.theme.colors.primary}50;
  `}
`

const TableHeader = styled.th<{ $width?: string; $sortable?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  width: ${props => props.$width || 'auto'};
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  transition: background ${props => props.theme.transitions.normal};

  ${props => props.$sortable && css`
    &:hover {
      background-color: ${props => props.theme.colors.hover.surface};
    }
  `}

  ${props => props.$sortable && props.theme.extensions?.cyberpunk && css`
    color: ${props.theme.colors.primary};
  `}
`

const TableHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const TableBody = styled.tbody``

const TableRow = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background ${props => props.theme.transitions.normal};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  &:hover {
    background-color: ${props => props.$clickable
      ? props.theme.colors.hover.surface
      : 'transparent'};
  }

  ${props => props.$clickable && props.theme.extensions?.cyberpunk && css`
    &:hover {
      background-color: ${props.theme.colors.primary}10;
    }
  `}
`

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
`

const EmptyState = styled.div`
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.md};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const LoadingState = styled.div`
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.md};
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

/**
 * Cyberpunk-themed data table component with sorting, loading states, and custom renderers.
 * Features theme-aware styling that adapts to luxe or cyberpunk themes.
 *
 * @param props - DataTable component props
 * @param props.columns - Array of column definitions
 * @param props.data - Array of data rows
 * @param props.keyExtractor - Function to extract unique key from each row
 * @param props.onSort - Optional sort handler
 * @param props.sortKey - Current sort column key
 * @param props.sortDirection - Current sort direction ('asc' | 'desc')
 * @param props.onRowClick - Optional row click handler
 * @param props.emptyMessage - Message to display when data is empty
 * @param props.isLoading - Loading state indicator
 * @returns A styled data table with theme-aware aesthetics
 *
 * @example
 * // Basic data table
 * <DataTable
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email' }
 *   ]}
 *   data={users}
 *   keyExtractor={(user) => user.id}
 * />
 *
 * @example
 * // Table with custom renderer and sorting
 * <DataTable
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     {
 *       key: 'status',
 *       header: 'Status',
 *       render: (user) => <Badge variant={user.status}>{user.status}</Badge>
 *     }
 *   ]}
 *   data={users}
 *   keyExtractor={(user) => user.id}
 *   onSort={handleSort}
 *   sortKey={sortKey}
 *   sortDirection={sortDirection}
 * />
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
}: DataTableProps<T>) {
  // PRESERVED: Original sorting handler logic
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  // PRESERVED: Original sort icon rendering logic
  const renderSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) return null
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <tr>
            {columns.map((column) => (
              <TableHeader
                key={column.key}
                $width={column.width}
                $sortable={column.sortable}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <TableHeaderContent>
                  {column.header}
                  {column.sortable && renderSortIcon(column.key)}
                </TableHeaderContent>
              </TableHeader>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {/* PRESERVED: Original loading state logic */}
          {isLoading ? (
            <tr>
              <TableCell colSpan={columns.length}>
                <LoadingState>Loading...</LoadingState>
              </TableCell>
            </tr>
          ) : data.length === 0 ? (
            /* PRESERVED: Original empty state logic */
            <tr>
              <TableCell colSpan={columns.length}>
                <EmptyState>{emptyMessage}</EmptyState>
              </TableCell>
            </tr>
          ) : (
            /* PRESERVED: Original data rendering logic */
            data.map((row) => (
              <TableRow
                key={keyExtractor(row)}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  )
}
