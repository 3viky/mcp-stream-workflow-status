/**
 * StreamTable Component
 *
 * Main table showing active streams with sortable columns
 */

import { useState } from 'react';
import styled from 'styled-components';
import { StatusBadge } from './ui';
import { ArrowUpDown, Archive } from 'lucide-react';
import type { Stream } from '../types';

const TableContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${props => props.theme.colors.hover.surface};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableHeader = styled.th<{ $sortable?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;

  &:hover {
    background: ${props => props.$sortable ? 'rgba(255, 255, 255, 0.02)' : 'transparent'};
  }

  svg {
    display: inline-block;
    margin-left: ${props => props.theme.spacing.xs};
    opacity: 0.5;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    transition: background 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.hover.surface};
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const StreamNumber = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const StreamTitle = styled.div`
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const CommitMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const NoResults = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'default' }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background: transparent;
  color: ${props => props.$variant === 'danger' ? props.theme.colors.error : props.theme.colors.text.secondary};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$variant === 'danger' ? props.theme.colors.error : props.theme.colors.hover.surface};
    color: ${props => props.$variant === 'danger' ? 'white' : props.theme.colors.text.primary};
    border-color: ${props => props.$variant === 'danger' ? props.theme.colors.error : props.theme.colors.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionCell = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;
`;

const SelectAllCheckbox = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const RowCheckbox = styled.input`
  cursor: pointer;
  width: 14px;
  height: 14px;
`;

const BulkActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.warning}22;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SelectedCount = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface StreamTableProps {
  streams: Stream[];
  onArchive?: (streamId: string) => Promise<boolean>;
  onArchiveBulk?: (streamIds: string[]) => Promise<{ success: boolean; results: any[] }>;
}

type SortColumn = 'streamNumber' | 'title' | 'status' | 'category' | 'priority';
type SortDirection = 'asc' | 'desc';

export function StreamTable({ streams, onArchive, onArchiveBulk }: StreamTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('streamNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [archiving, setArchiving] = useState<Set<string>>(new Set());

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleSelect = (streamId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(streamId)) {
        next.delete(streamId);
      } else {
        next.add(streamId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === streams.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(streams.map(s => s.id)));
    }
  };

  const handleArchive = async (streamId: string) => {
    if (!onArchive) return;
    setArchiving(prev => new Set(prev).add(streamId));
    await onArchive(streamId);
    setArchiving(prev => {
      const next = new Set(prev);
      next.delete(streamId);
      return next;
    });
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(streamId);
      return next;
    });
  };

  const handleBulkArchive = async () => {
    if (!onArchiveBulk || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    ids.forEach(id => setArchiving(prev => new Set(prev).add(id)));
    await onArchiveBulk(ids);
    setArchiving(new Set());
    setSelectedIds(new Set());
  };

  const sortedStreams = [...streams].sort((a, b) => {
    let aValue: string | number = a[sortColumn];
    let bValue: string | number = b[sortColumn];

    if (sortColumn === 'streamNumber') {
      aValue = parseInt(a.streamNumber, 10);
      bValue = parseInt(b.streamNumber, 10);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatStatus = (status: string) => {
    return status.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (streams.length === 0) {
    return (
      <TableContainer>
        <NoResults>No streams match your filters</NoResults>
      </TableContainer>
    );
  }

  const hasArchive = Boolean(onArchive || onArchiveBulk);

  return (
    <TableContainer>
      {selectedIds.size > 0 && onArchiveBulk && (
        <BulkActionBar>
          <SelectedCount>{selectedIds.size} stream(s) selected</SelectedCount>
          <ActionButton onClick={handleBulkArchive} $variant="danger">
            <Archive size={14} />
            Archive Selected
          </ActionButton>
        </BulkActionBar>
      )}
      <Table>
        <TableHead>
          <tr>
            {hasArchive && (
              <TableHeader>
                <SelectAllCheckbox
                  type="checkbox"
                  checked={selectedIds.size === streams.length && streams.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableHeader>
            )}
            <TableHeader $sortable onClick={() => handleSort('streamNumber')}>
              Stream
              <ArrowUpDown size={14} />
            </TableHeader>
            <TableHeader $sortable onClick={() => handleSort('title')}>
              Title
              <ArrowUpDown size={14} />
            </TableHeader>
            <TableHeader $sortable onClick={() => handleSort('status')}>
              Status
              <ArrowUpDown size={14} />
            </TableHeader>
            <TableHeader $sortable onClick={() => handleSort('category')}>
              Category
              <ArrowUpDown size={14} />
            </TableHeader>
            <TableHeader $sortable onClick={() => handleSort('priority')}>
              Priority
              <ArrowUpDown size={14} />
            </TableHeader>
            <TableHeader>Recent Activity</TableHeader>
            {hasArchive && <TableHeader>Actions</TableHeader>}
          </tr>
        </TableHead>
        <TableBody>
          {sortedStreams.map((stream) => (
            <tr key={stream.id}>
              {hasArchive && (
                <TableCell>
                  <RowCheckbox
                    type="checkbox"
                    checked={selectedIds.has(stream.id)}
                    onChange={() => toggleSelect(stream.id)}
                  />
                </TableCell>
              )}
              <TableCell>
                <StreamNumber>{stream.streamNumber}</StreamNumber>
              </TableCell>
              <TableCell>
                <StreamTitle>{stream.title}</StreamTitle>
              </TableCell>
              <TableCell>
                <StatusBadge status={stream.status}>
                  {formatStatus(stream.status)}
                </StatusBadge>
              </TableCell>
              <TableCell>{stream.category}</TableCell>
              <TableCell>{stream.priority}</TableCell>
              <TableCell>
                {stream.recentActivity?.lastCommit ? (
                  <>
                    <CommitMessage>{stream.recentActivity.lastCommit}</CommitMessage>
                    <ActivityText>
                      {stream.recentActivity.filesChanged} files changed • {stream.recentActivity.lastCommitTime}
                    </ActivityText>
                  </>
                ) : (
                  <ActivityText>No commits yet</ActivityText>
                )}
              </TableCell>
              {hasArchive && (
                <TableCell>
                  <ActionCell>
                    {stream.status !== 'archived' && onArchive && (
                      <ActionButton
                        onClick={() => handleArchive(stream.id)}
                        disabled={archiving.has(stream.id)}
                        title="Archive this stream"
                      >
                        <Archive size={12} />
                        {archiving.has(stream.id) ? 'Archiving...' : 'Archive'}
                      </ActionButton>
                    )}
                    {stream.status === 'archived' && (
                      <ActivityText>Archived</ActivityText>
                    )}
                  </ActionCell>
                </TableCell>
              )}
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
