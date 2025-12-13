/**
 * StickyDataTable Component
 *
 * Extended DataTable with sticky headers and columns for large datasets.
 * Supports multi-row headers and sticky left columns.
 */

import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

/**
 * Column definition with sticky support
 */
export interface StickyColumn<T> {
  key: string
  header: string | ReactNode
  subHeader?: string | ReactNode
  render?: (row: T) => ReactNode
  width?: string
  minWidth?: string
  sticky?: 'left' | 'top' | 'both'
  stickyLeft?: number  // Offset from left for multiple sticky columns
}

/**
 * Column group for multi-row headers
 */
export interface ColumnGroup {
  header: string | ReactNode
  columns: StickyColumn<unknown>[]
  sticky?: 'left' | 'top' | 'both'
}

/**
 * Sort function type
 *
 * Returns a number for comparison:
 * - negative: a comes before b
 * - zero: a and b are equal
 * - positive: b comes before a
 */
export type SortFn<T> = (a: T, b: T) => number

/**
 * Column configuration for sticky data table
 *
 * Supports multi-level headers via columnGroups and flexible rendering
 */
export interface StickyDataTableProps<T> {
  /** Column group definitions for multi-row headers (optional) */
  columnGroups?: ColumnGroup[]

  /** Column definitions - defines what data to show and how to render it */
  columns: StickyColumn<T>[]

  /** Data rows to display */
  data: T[]

  /** Function to extract unique key from each row (for React keys) */
  keyExtractor: (row: T) => string

  /** Message to show when data is empty */
  emptyMessage?: string

  /** Show loading state */
  isLoading?: boolean

  /** Show group headers row (only applies if columnGroups provided) */
  showGroupHeaders?: boolean

  /**
   * Sort functions applied in order
   *
   * Each function compares two rows. Functions are applied sequentially
   * until one returns non-zero. This allows multi-level sorting.
   *
   * Example:
   * ```
   * sortBy={[
   *   (a, b) => a.priority - b.priority,  // Primary sort
   *   (a, b) => a.name.localeCompare(b.name)  // Secondary sort
   * ]}
   * ```
   */
  sortBy?: SortFn<T>[]
}

// Styled Components

const TableContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: ${props => props.theme.colors.background};
  position: relative;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1800px;
  background: ${props => props.theme.colors.background};

  th, td {
    border: 1px solid ${props => props.theme.colors.border};
    padding: ${props => props.theme.spacing.md};
    text-align: left;
    vertical-align: top;
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`

const HeaderRow = styled.tr`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${props => props.theme.colors.background};
`

const SubHeaderRow = styled.tr`
  position: sticky;
  top: 45px;
  z-index: 19;
  background: ${props => props.theme.colors.background};
`

const ColumnHeader = styled.th<{ $sticky?: 'left' | 'top' | 'both'; $stickyLeft?: number }>`
  background: ${props => props.theme.colors.surface};
  position: ${props => props.$sticky ? 'sticky' : 'relative'};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};

  ${props => props.$sticky === 'left' && css`
    left: ${props.$stickyLeft || 0}px;
    z-index: 25;
  `}

  ${props => props.$sticky === 'both' && css`
    left: ${props.$stickyLeft || 0}px;
    top: 0;
    z-index: 30;
  `}
`

const SubColumnHeader = styled.th<{ $sticky?: 'left' | 'top' | 'both'; $stickyLeft?: number }>`
  background: ${props => props.theme.colors.surface};
  position: ${props => props.$sticky ? 'sticky' : 'relative'};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  padding: ${props => props.theme.spacing.sm} !important;
  border: 1px solid ${props => props.theme.colors.border};
  opacity: 0.9;

  ${props => props.$sticky === 'left' && css`
    left: ${props.$stickyLeft || 0}px;
    z-index: 25;
  `}

  ${props => props.$sticky === 'both' && css`
    left: ${props.$stickyLeft || 0}px;
    top: 45px;
    z-index: 29;
  `}
`

const DataRow = styled.tr``

const DataCell = styled.td<{ $sticky?: 'left' | 'top' | 'both'; $stickyLeft?: number; $minWidth?: string }>`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  min-width: ${props => props.$minWidth || 'auto'};

  ${props => props.$sticky === 'left' && css`
    position: sticky;
    left: ${props.$stickyLeft || 0}px;
    z-index: 15;
  `}
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.md};
`

/**
 * Data table with sticky headers and columns for large datasets.
 * Extends base DataTable with multi-row header support and sticky positioning.
 */
export function StickyDataTable<T>({
  columnGroups,
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  isLoading: _isLoading = false,
  showGroupHeaders = false,
  sortBy,
}: StickyDataTableProps<T>) {
  // Apply sorting if provided
  const sortedData = sortBy && sortBy.length > 0
    ? [...data].sort((a, b) => {
        for (const sortFn of sortBy) {
          const result = sortFn(a, b)
          if (result !== 0) return result
        }
        return 0
      })
    : data

  if (sortedData.length === 0) {
    return (
      <TableContainer>
        <EmptyState>{emptyMessage}</EmptyState>
      </TableContainer>
    )
  }

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          {showGroupHeaders && columnGroups && (
            <HeaderRow>
              {columnGroups.map((group, idx) => (
                <ColumnHeader
                  key={idx}
                  colSpan={group.columns.length}
                  $sticky={group.sticky}
                  $stickyLeft={group.sticky === 'left' || group.sticky === 'both'
                    ? group.columns[0].stickyLeft
                    : undefined}
                >
                  {group.header}
                </ColumnHeader>
              ))}
            </HeaderRow>
          )}

          <SubHeaderRow>
            {columns.map((column) => (
              <SubColumnHeader
                key={column.key}
                $sticky={column.sticky}
                $stickyLeft={column.stickyLeft}
              >
                {column.subHeader || column.header}
              </SubColumnHeader>
            ))}
          </SubHeaderRow>
        </thead>

        <tbody>
          {sortedData.map((row) => (
            <DataRow key={keyExtractor(row)}>
              {columns.map((column) => (
                <DataCell
                  key={column.key}
                  $sticky={column.sticky}
                  $stickyLeft={column.stickyLeft}
                  $minWidth={column.minWidth}
                >
                  {column.render
                    ? column.render(row)
                    : String((row as Record<string, unknown>)[column.key] ?? '')}
                </DataCell>
              ))}
            </DataRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  )
}
