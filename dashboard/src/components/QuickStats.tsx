/**
 * QuickStats Component
 *
 * Minimal stats cards showing stream counts by status
 */

import styled from 'styled-components';
import { Card } from '@transftw/lilith-ui';
import type { QuickStats as QuickStatsType } from '../types';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatCard = styled(Card)`
  padding: ${props => props.theme.spacing.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface QuickStatsProps {
  stats: QuickStatsType;
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <StatsGrid>
      <StatCard>
        <StatValue>{stats.activeStreams}</StatValue>
        <StatLabel>Active Streams</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{stats.inProgress}</StatValue>
        <StatLabel>In Progress</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{stats.blocked}</StatValue>
        <StatLabel>Blocked</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{stats.readyToStart}</StatValue>
        <StatLabel>Ready to Start</StatLabel>
      </StatCard>
    </StatsGrid>
  );
}
