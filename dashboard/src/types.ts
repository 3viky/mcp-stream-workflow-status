/**
 * TypeScript type definitions for Stream Dashboard
 */

export type StreamStatus = 'initializing' | 'active' | 'blocked' | 'paused' | 'completed' | 'archived';

export type StreamCategory =
  | 'frontend'
  | 'backend'
  | 'infrastructure'
  | 'documentation'
  | 'refactoring'
  | 'testing'
  | 'design'
  | 'deployment';

export type StreamPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Stream {
  id: string;
  streamNumber: string;
  title: string;
  status: StreamStatus;
  category: StreamCategory;
  priority: StreamPriority;
  createdAt?: string;
  updatedAt?: string;
  worktreePath?: string;
  branch?: string;
  recentActivity?: {
    lastCommit?: string;
    lastCommitTime?: string;
    filesChanged?: number;
  };
}

export interface Commit {
  id: string;
  streamId: string;
  streamNumber: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  filesChanged: number;
}

export interface QuickStats {
  activeStreams: number;
  inProgress: number;
  blocked: number;
  readyToStart: number;
}

export interface FilterOptions {
  status: StreamStatus | 'all';
  category: StreamCategory | 'all';
  priority: StreamPriority | 'all';
  search: string;
}

// Activity Timeline Types

export type ActivityLevel = 'hot' | 'warm' | 'cold';
export type GroupingKey = 'today' | 'yesterday' | 'this-week' | 'older';
export type GroupBy = 'time' | 'stream' | 'author';

export interface StreamContext {
  title: string;
  branch?: string;
  worktreePath?: string;
  category: StreamCategory;
  status: StreamStatus;
}

export interface EnrichedCommit extends Commit {
  relativeTime: string;
  groupingKey: GroupingKey;
  activityLevel: ActivityLevel;
  streamContext?: StreamContext;
  isMerged: boolean;
}

export interface TimelineFilters {
  streams: string[];
  authors: string[];
  timeRange: 'hour' | '6h' | '24h' | '7d' | '30d' | 'all';
  activeOnly: boolean;
}

export interface WorktreeSummary {
  activeCount: number;
  mergedCount: number;
}
