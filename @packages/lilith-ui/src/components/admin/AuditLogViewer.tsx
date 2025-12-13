import React, { useState } from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'
import { Select } from '../primitives/Select'
import type { SelectOption } from '../primitives/Select'
import { Button } from '../primitives/Button'
import { Badge } from '../primitives/Badge'

export interface AuditLogEntry {
  id: string
  timestamp: Date
  actor: string
  action: string
  resource: string
  resourceId: string
  changes?: {
    field: string
    before: unknown
    after: unknown
  }[]
  metadata?: Record<string, unknown>
  severity: 'info' | 'warning' | 'error'
}

export interface AuditLogViewerProps {
  entries: AuditLogEntry[]
  onExport?: (format: 'csv' | 'json') => void
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

const ViewerContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
`

const Header = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const Title = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.md} 0;
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
`

const Timeline = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.md};
`

const LogEntry = styled.div`
  position: relative;
  padding: ${(props) => props.theme.spacing.md};
  padding-left: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.border};

  &:before {
    content: '';
    position: absolute;
    left: 16px;
    top: 0;
    bottom: -16px;
    width: 2px;
    background: ${(props) => props.theme.colors.border};
  }

  &:last-child:before {
    display: none;
  }
`

const TimelineDot = styled.div<{ $severity: 'info' | 'warning' | 'error' }>`
  position: absolute;
  left: 11px;
  top: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$severity) {
      case 'error':
        return props.theme.colors.error
      case 'warning':
        return props.theme.colors.warning
      default:
        return props.theme.colors.primary
    }
  }};
  border: 2px solid ${(props) => props.theme.colors.background};
  z-index: 1;
`

const EntryHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`

const EntryAction = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
`

const EntryTimestamp = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const EntryDetails = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const EntryResource = styled.span`
  font-family: monospace;
  background: ${(props) => props.theme.colors.surface};
  padding: 2px 6px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
`

const Changes = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const ChangeItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.xs} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const ChangeField = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text};
`

const ChangeValue = styled.span<{ $type: 'before' | 'after' }>`
  font-family: monospace;
  color: ${(props) => props.$type === 'before' ? props.theme.colors.error : props.theme.colors.success};
`

const Footer = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ExportActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  entries,
  onExport,
  onLoadMore,
  hasMore = false,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')

  const severityOptions: SelectOption[] = [
    { value: 'all', label: 'All Severities' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ]

  const actions = Array.from(new Set(entries.map(e => e.action)))
  const actionOptions: SelectOption[] = [
    { value: 'all', label: 'All Actions' },
    ...actions.map(action => ({ value: action, label: action }))
  ]

  const filteredEntries = entries.filter(entry => {
    if (severityFilter !== 'all' && entry.severity !== severityFilter) return false
    if (actionFilter !== 'all' && entry.action !== actionFilter) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        entry.actor.toLowerCase().includes(search) ||
        entry.action.toLowerCase().includes(search) ||
        entry.resource.toLowerCase().includes(search) ||
        entry.resourceId.toLowerCase().includes(search)
      )
    }
    return true
  })

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  return (
    <ViewerContainer>
      <Header>
        <Title>Audit Log</Title>
        <Filters>
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={severityOptions}
          />
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={actionOptions}
          />
        </Filters>
      </Header>

      <Timeline>
        {filteredEntries.map(entry => (
          <LogEntry key={entry.id}>
            <TimelineDot $severity={entry.severity} />
            <EntryHeader>
              <div>
                <EntryAction>{entry.action}</EntryAction>
                <EntryTimestamp>
                  {new Date(entry.timestamp).toLocaleString()}
                </EntryTimestamp>
              </div>
              <Badge variant={entry.severity === 'error' ? 'error' : entry.severity === 'warning' ? 'warning' : 'default'}>
                {entry.severity}
              </Badge>
            </EntryHeader>

            <EntryDetails>
              <span>Actor: <strong>{entry.actor}</strong></span>
              <span>Resource: <EntryResource>{entry.resource}/{entry.resourceId}</EntryResource></span>
            </EntryDetails>

            {entry.changes && entry.changes.length > 0 && (
              <Changes>
                {entry.changes.map((change, idx) => (
                  <ChangeItem key={idx}>
                    <ChangeField>{change.field}</ChangeField>
                    <ChangeValue $type="before">{formatValue(change.before)}</ChangeValue>
                    <ChangeValue $type="after">{formatValue(change.after)}</ChangeValue>
                  </ChangeItem>
                ))}
              </Changes>
            )}
          </LogEntry>
        ))}
      </Timeline>

      <Footer>
        <div>
          {filteredEntries.length} of {entries.length} entries
        </div>
        <ExportActions>
          {onExport && (
            <>
              <Button variant="secondary" size="sm" onClick={() => onExport('csv')}>
                Export CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onExport('json')}>
                Export JSON
              </Button>
            </>
          )}
          {hasMore && onLoadMore && (
            <Button variant="primary" size="sm" onClick={onLoadMore} disabled={loading}>
              Load More
            </Button>
          )}
        </ExportActions>
      </Footer>
    </ViewerContainer>
  )
}
