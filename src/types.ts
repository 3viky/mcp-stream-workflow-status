/**
 * Type definitions for Stream Workflow Status MCP Server
 */

// Stream status values
export type StreamStatus = 'initializing' | 'active' | 'blocked' | 'paused' | 'completed' | 'archived';

// Stream categories
export type StreamCategory = 'frontend' | 'backend' | 'infrastructure' | 'testing' | 'documentation' | 'refactoring';

// Stream priorities
export type StreamPriority = 'critical' | 'high' | 'medium' | 'low';

// Main stream interface
export interface Stream {
  id: string;
  streamNumber: string;
  title: string;
  category: StreamCategory;
  priority: StreamPriority;
  status: StreamStatus;
  progress: number;
  currentPhase?: number;
  worktreePath: string;
  branch: string;
  blockedBy?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  phases?: string[];
}

// Commit interface
export interface Commit {
  id?: number;
  streamId: string;
  commitHash: string;
  message: string;
  author: string;
  filesChanged: number;
  timestamp: string;
}

// Stream history event
export interface StreamHistoryEvent {
  id?: number;
  streamId: string;
  eventType: 'created' | 'status_changed' | 'progress_updated' | 'completed' | 'archived';
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

// Quick statistics
export interface QuickStats {
  activeStreams: number;
  inProgress: number;
  blocked: number;
  readyToStart: number;
  completedToday: number;
  totalCommits: number;
  commitsToday: number;
}

// MCP Tool parameters
export interface AddStreamParams {
  streamId: string;
  streamNumber: string;
  title: string;
  category: StreamCategory;
  priority: StreamPriority;
  worktreePath: string;
  branch: string;
  estimatedPhases?: string[];
}

export interface UpdateStreamParams {
  streamId: string;
  status?: StreamStatus;
  progress?: number;
  currentPhase?: number;
  blockedBy?: string;
}

export interface AddCommitParams {
  streamId: string;
  commitHash: string;
  message: string;
  author: string;
  filesChanged: number;
  timestamp?: string;
}

export interface RemoveStreamParams {
  streamId: string;
  completionSummary?: string;
}

// Configuration
export interface Config {
  PROJECT_ROOT: string;
  WORKTREE_ROOT: string;
  DATABASE_PATH: string;
  API_PORT: number;
  API_ENABLED: boolean;
}
