/**
 * Stream Dashboard Application
 *
 * Real-time dashboard showing commit activity, KPIs, and stream status
 * Layout: Commits (top) → KPIs → Streams (scrollable)
 */

import { useState } from 'react';
import styled from 'styled-components';
import { Heading } from './components/ui';
import { Activity, AlertCircle } from 'lucide-react';
import { QuickStats, FilterBar, StreamTable, CommitStream } from './components';
import { useStreams, useCommits, useStats } from './hooks';
import type { FilterOptions } from './types';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.colors.background.primary};
  display: flex;
  flex-direction: column;
`;

const DashboardHeader = styled.div`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const StatusIndicator = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$connected ? props.theme.colors.success : props.theme.colors.error};
    animation: ${props => props.$connected ? 'pulse 2s infinite' : 'none'};
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const DashboardContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
`;

const Section = styled.section<{ $maxHeight?: string; $compact?: boolean }>`
  margin-bottom: ${props => props.$compact ? props.theme.spacing.md : props.theme.spacing.lg};

  ${props => props.$maxHeight && `
    max-height: ${props.$maxHeight};
    overflow-y: auto;
  `}
`;

const ErrorBanner = styled.div`
  background: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.125rem;
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

  // Fetch data from API
  const {
    streams,
    loading: streamsLoading,
    error: streamsError,
    archiveStream,
    archiveStreams,
  } = useStreams();
  const { commits, loading: commitsLoading, error: commitsError } = useCommits(20);
  const { stats, loading: statsLoading } = useStats();

  // Filter streams based on current filter state
  const filteredStreams = streams.filter((stream) => {
    if (filters.status !== 'all' && stream.status !== filters.status) return false;
    if (filters.category !== 'all' && stream.category !== filters.category) return false;
    if (filters.priority !== 'all' && stream.priority !== filters.priority) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = stream.title.toLowerCase().includes(searchLower);
      const numberMatch = stream.streamNumber.includes(searchLower);
      if (!titleMatch && !numberMatch) return false;
    }

    return true;
  });

  const hasErrors = Boolean(streamsError || commitsError);
  const isConnected = !hasErrors && !streamsLoading && !commitsLoading;

  return (
    <AppContainer>
      <DashboardHeader>
        <HeaderContent>
          <Activity size={28} />
          <Heading as="h1">
            Stream Status Dashboard
          </Heading>
        </HeaderContent>
        <StatusIndicator $connected={isConnected}>
          {isConnected ? 'Live' : 'Connecting...'}
        </StatusIndicator>
      </DashboardHeader>

      <DashboardContent>
        {/* Error banners */}
        {streamsError && (
          <ErrorBanner>
            <AlertCircle size={20} />
            <span>Failed to load streams: {streamsError}</span>
          </ErrorBanner>
        )}
        {commitsError && (
          <ErrorBanner>
            <AlertCircle size={20} />
            <span>Failed to load commits: {commitsError}</span>
          </ErrorBanner>
        )}

        {/* 1. Recent Commits (Top Priority - Always visible) */}
        <Section $compact>
          <CommitStream
            commits={commits}
            limit={20}
            loading={commitsLoading}
          />
        </Section>

        {/* 2. Quick Statistics (KPIs) */}
        <Section $compact>
          <QuickStats stats={stats} loading={statsLoading} />
        </Section>

        {/* 3. Stream Filters */}
        <Section $compact>
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </Section>

        {/* 4. Streams Table (Scrollable content area) */}
        <Section $maxHeight="800px">
          {streamsLoading && streams.length === 0 ? (
            <LoadingOverlay>Loading streams...</LoadingOverlay>
          ) : (
            <StreamTable
              streams={filteredStreams}
              onArchive={archiveStream}
              onArchiveBulk={archiveStreams}
            />
          )}
        </Section>
      </DashboardContent>
    </AppContainer>
  );
}

export default App;
