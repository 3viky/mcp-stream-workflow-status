/**
 * TypeScript type definitions for Stream Dashboard
 */

export type StreamStatus = 'ready' | 'in-progress' | 'blocked' | 'completed' | 'initializing';

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
