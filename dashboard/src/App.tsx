/**
 * Stream Dashboard Application
 *
 * Main app component orchestrating the dashboard UI
 */

import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Heading } from '@transftw/lilith-ui';
import { PurposeTable, QuickStats, FilterBar, StreamTable, CommitStream } from './components';
import { mockStreams, mockCommits } from './mockData';
import type { FilterOptions, QuickStats as QuickStatsType } from './types';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
  overflow-y: auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const DashboardContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

// ============================================================================
// COMPONENT
// ============================================================================

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
  });

  // Filter streams based on current filter state
  const filteredStreams = useMemo(() => {
    return mockStreams.filter((stream) => {
      // Status filter
      if (filters.status !== 'all' && stream.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && stream.category !== filters.category) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && stream.priority !== filters.priority) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = stream.title.toLowerCase().includes(searchLower);
        const numberMatch = stream.streamNumber.includes(searchLower);
        if (!titleMatch && !numberMatch) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Calculate quick stats
  const quickStats = useMemo((): QuickStatsType => {
    return {
      activeStreams: mockStreams.length,
      inProgress: mockStreams.filter(s => s.status === 'in-progress').length,
      blocked: mockStreams.filter(s => s.status === 'blocked').length,
      readyToStart: mockStreams.filter(s => s.status === 'ready').length,
    };
  }, []);

  return (
    <AppContainer>
      <DashboardContent>
        <DashboardHeader>
          <Heading level={1}>Stream Status Dashboard</Heading>
        </DashboardHeader>

        {/* Purpose explanation table */}
        <PurposeTable lastSync="Just now (mock data)" />

        {/* Quick statistics */}
        <QuickStats stats={quickStats} />

        {/* Filter controls */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Main streams table */}
        <StreamTable streams={filteredStreams} />

        {/* Recent commits stream */}
        <CommitStream commits={mockCommits} limit={10} />
      </DashboardContent>
    </AppContainer>
  );
}

export default App;
