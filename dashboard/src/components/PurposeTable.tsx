/**
 * PurposeTable Component
 *
 * Explanation table showing what this dashboard is and its data sources
 */

import styled from 'styled-components';
import { Card } from '@transftw/lilith-ui';

const TableContainer = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: ${props => props.theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
    width: 30%;
  }

  td {
    color: ${props => props.theme.colors.textSecondary};
  }

  tr:last-child th,
  tr:last-child td {
    border-bottom: none;
  }
`;

interface PurposeTableProps {
  lastSync?: string;
}

export function PurposeTable({ lastSync = '2 minutes ago' }: PurposeTableProps) {
  return (
    <TableContainer>
      <Table>
        <tbody>
          <tr>
            <th>What is this?</th>
            <td>Real-time stream status dashboard</td>
          </tr>
          <tr>
            <th>Data Source</th>
            <td>.stream-state.json + worktree git logs</td>
          </tr>
          <tr>
            <th>Last Sync</th>
            <td>{lastSync}</td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
  );
}
