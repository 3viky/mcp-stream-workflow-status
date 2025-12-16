/**
 * Worktree Reconciliation Scanner
 *
 * Compares database entries against actual git worktrees and merged branches
 * to identify stale, completed, orphaned, and active streams.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { basename } from 'path';
import { config } from '../config.js';
import { getDatabase } from '../database/client.js';
import { getAllStreams, updateStream, completeStream } from '../database/queries/streams.js';
import { addHistoryEvent } from '../database/queries/history.js';
import type { Stream, StreamStatus } from '../types.js';

// ============================================================================
// TYPES
// ============================================================================

export interface WorktreeInfo {
  path: string;
  branch: string;
  commitHash: string;
  isMain: boolean;
}

export interface ReconciliationResult {
  /** Streams with existing worktrees, not merged */
  active: StreamReconciliationEntry[];
  /** Streams whose branches are merged to main */
  completed: StreamReconciliationEntry[];
  /** DB entries without corresponding worktrees */
  stale: StreamReconciliationEntry[];
  /** Worktrees without corresponding DB entries */
  orphaned: WorktreeInfo[];
  /** Streams that failed to process */
  errors: { streamId: string; error: string }[];
  /** Summary statistics */
  summary: ReconciliationSummary;
}

export interface StreamReconciliationEntry {
  streamId: string;
  title: string;
  branch: string;
  worktreePath: string;
  previousStatus: StreamStatus;
  newStatus?: StreamStatus;
  reason: string;
}

export interface ReconciliationSummary {
  totalInDb: number;
  totalWorktrees: number;
  active: number;
  completed: number;
  stale: number;
  orphaned: number;
  errors: number;
}

export interface ReconciliationOptions {
  /** Only report, don't update database */
  dryRun?: boolean;
  /** Automatically mark stale streams as archived */
  autoArchiveStale?: boolean;
  /** Automatically add orphaned worktrees to database */
  autoAddOrphaned?: boolean;
}

// ============================================================================
// GIT HELPERS
// ============================================================================

/**
 * Get list of all git worktrees from the main repository
 */
export function getWorktreeList(): Map<string, WorktreeInfo> {
  const worktrees = new Map<string, WorktreeInfo>();

  try {
    // Run git worktree list from the project root
    const output = execSync('git worktree list --porcelain', {
      cwd: config.PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    // Parse porcelain output
    // Format:
    // worktree /path/to/worktree
    // HEAD abc123
    // branch refs/heads/branch-name
    // (blank line)
    const entries = output.trim().split('\n\n');

    for (const entry of entries) {
      const lines = entry.trim().split('\n');
      let path = '';
      let commitHash = '';
      let branch = '';

      for (const line of lines) {
        if (line.startsWith('worktree ')) {
          path = line.substring(9);
        } else if (line.startsWith('HEAD ')) {
          commitHash = line.substring(5);
        } else if (line.startsWith('branch ')) {
          branch = line.substring(7).replace('refs/heads/', '');
        }
      }

      if (path && branch) {
        const isMain = branch === 'main' || branch === 'master';
        const streamId = isMain ? 'main' : basename(path);

        worktrees.set(streamId, {
          path,
          branch,
          commitHash,
          isMain,
        });
      }
    }
  } catch (error) {
    console.error('Failed to get worktree list:', error);
  }

  return worktrees;
}

/**
 * Get set of branches that have been merged to main
 */
export function getMergedBranches(): Set<string> {
  const merged = new Set<string>();

  try {
    const output = execSync('git branch --merged main', {
      cwd: config.PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const lines = output.trim().split('\n');
    for (const line of lines) {
      const branch = line.trim().replace(/^\*\s*/, '');
      if (branch && branch !== 'main' && branch !== 'master') {
        merged.add(branch);
      }
    }
  } catch (error) {
    console.error('Failed to get merged branches:', error);
  }

  return merged;
}

/**
 * Check if a specific worktree path exists on filesystem
 */
export function worktreeExists(worktreePath: string): boolean {
  return existsSync(worktreePath);
}

// ============================================================================
// RECONCILIATION LOGIC
// ============================================================================

/**
 * Perform full reconciliation between database and git state
 */
export async function reconcileWorktrees(
  options: ReconciliationOptions = {}
): Promise<ReconciliationResult> {
  const { dryRun = true, autoArchiveStale = false, autoAddOrphaned = false } = options;

  const db = getDatabase();
  const streams = getAllStreams(db);
  const worktrees = getWorktreeList();
  const mergedBranches = getMergedBranches();

  const result: ReconciliationResult = {
    active: [],
    completed: [],
    stale: [],
    orphaned: [],
    errors: [],
    summary: {
      totalInDb: streams.length,
      totalWorktrees: worktrees.size - 1, // Exclude main worktree
      active: 0,
      completed: 0,
      stale: 0,
      orphaned: 0,
      errors: 0,
    },
  };

  // Track which worktrees have matching DB entries
  const matchedWorktrees = new Set<string>();
  matchedWorktrees.add('main'); // Always exclude main

  // Process each stream in database
  for (const stream of streams) {
    try {
      const worktree = worktrees.get(stream.id);
      const hasWorktree = worktree !== undefined || worktreeExists(stream.worktreePath);
      const isMerged = mergedBranches.has(stream.branch);

      if (worktree) {
        matchedWorktrees.add(stream.id);
      }

      // Determine stream state
      if (isMerged) {
        // Branch merged to main → completed
        const entry: StreamReconciliationEntry = {
          streamId: stream.id,
          title: stream.title,
          branch: stream.branch,
          worktreePath: stream.worktreePath,
          previousStatus: stream.status,
          newStatus: 'completed',
          reason: 'Branch merged to main',
        };
        result.completed.push(entry);
        result.summary.completed++;

        // Update database if not dry run
        if (!dryRun && stream.status !== 'completed') {
          completeStream(db, stream.id);
          addHistoryEvent(db, {
            streamId: stream.id,
            eventType: 'status_changed',
            oldValue: stream.status,
            newValue: 'completed',
            timestamp: new Date().toISOString(),
          });
        }
      } else if (!hasWorktree) {
        // No worktree exists → stale
        const entry: StreamReconciliationEntry = {
          streamId: stream.id,
          title: stream.title,
          branch: stream.branch,
          worktreePath: stream.worktreePath,
          previousStatus: stream.status,
          newStatus: autoArchiveStale ? 'archived' : undefined,
          reason: 'Worktree does not exist',
        };
        result.stale.push(entry);
        result.summary.stale++;

        // Update database if auto-archive enabled and not dry run
        if (!dryRun && autoArchiveStale && stream.status !== 'archived') {
          updateStream(db, stream.id, { status: 'archived' });
          addHistoryEvent(db, {
            streamId: stream.id,
            eventType: 'status_changed',
            oldValue: stream.status,
            newValue: 'archived',
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        // Worktree exists, not merged → active
        const entry: StreamReconciliationEntry = {
          streamId: stream.id,
          title: stream.title,
          branch: stream.branch,
          worktreePath: stream.worktreePath,
          previousStatus: stream.status,
          reason: 'Worktree exists and branch not merged',
        };
        result.active.push(entry);
        result.summary.active++;

        // Ensure status is active if it was something else
        if (!dryRun && stream.status !== 'active' && stream.status !== 'blocked' && stream.status !== 'paused') {
          updateStream(db, stream.id, { status: 'active' });
          addHistoryEvent(db, {
            streamId: stream.id,
            eventType: 'status_changed',
            oldValue: stream.status,
            newValue: 'active',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      result.errors.push({
        streamId: stream.id,
        error: error instanceof Error ? error.message : String(error),
      });
      result.summary.errors++;
    }
  }

  // Find orphaned worktrees (exist but no DB entry)
  for (const [streamId, worktree] of worktrees) {
    if (!matchedWorktrees.has(streamId) && !worktree.isMain) {
      result.orphaned.push(worktree);
      result.summary.orphaned++;

      // TODO: Auto-add orphaned if option enabled
      // This would require parsing the worktree to extract stream metadata
    }
  }

  return result;
}

/**
 * Format reconciliation result as human-readable text
 */
export function formatReconciliationResult(result: ReconciliationResult, dryRun: boolean): string {
  const lines: string[] = [];

  lines.push(dryRun ? '🔍 Reconciliation Report (DRY RUN)' : '✅ Reconciliation Complete');
  lines.push('');
  lines.push('## Summary');
  lines.push(`- Database entries: ${result.summary.totalInDb}`);
  lines.push(`- Git worktrees: ${result.summary.totalWorktrees}`);
  lines.push(`- Active: ${result.summary.active}`);
  lines.push(`- Completed (merged): ${result.summary.completed}`);
  lines.push(`- Stale (no worktree): ${result.summary.stale}`);
  lines.push(`- Orphaned (no DB entry): ${result.summary.orphaned}`);
  if (result.summary.errors > 0) {
    lines.push(`- Errors: ${result.summary.errors}`);
  }

  if (result.completed.length > 0) {
    lines.push('');
    lines.push('## Completed Streams (merged to main)');
    for (const entry of result.completed.slice(0, 10)) {
      const statusChange = entry.previousStatus !== 'completed' ? ` [${entry.previousStatus} → completed]` : '';
      lines.push(`- ${entry.streamId}: ${entry.title}${statusChange}`);
    }
    if (result.completed.length > 10) {
      lines.push(`  ... and ${result.completed.length - 10} more`);
    }
  }

  if (result.stale.length > 0) {
    lines.push('');
    lines.push('## Stale Streams (worktree missing)');
    for (const entry of result.stale.slice(0, 10)) {
      lines.push(`- ${entry.streamId}: ${entry.title}`);
    }
    if (result.stale.length > 10) {
      lines.push(`  ... and ${result.stale.length - 10} more`);
    }
  }

  if (result.orphaned.length > 0) {
    lines.push('');
    lines.push('## Orphaned Worktrees (not in database)');
    for (const worktree of result.orphaned.slice(0, 10)) {
      lines.push(`- ${worktree.branch} at ${worktree.path}`);
    }
    if (result.orphaned.length > 10) {
      lines.push(`  ... and ${result.orphaned.length - 10} more`);
    }
  }

  if (result.errors.length > 0) {
    lines.push('');
    lines.push('## Errors');
    for (const err of result.errors) {
      lines.push(`- ${err.streamId}: ${err.error}`);
    }
  }

  return lines.join('\n');
}

/**
 * MCP tool handler for reconciliation
 */
export async function reconcileWorktreesTool(args?: {
  dryRun?: boolean;
  autoArchiveStale?: boolean;
  autoAddOrphaned?: boolean;
}): Promise<{ content: { type: string; text: string }[] }> {
  const dryRun = args?.dryRun ?? true;
  const result = await reconcileWorktrees({
    dryRun,
    autoArchiveStale: args?.autoArchiveStale ?? false,
    autoAddOrphaned: args?.autoAddOrphaned ?? false,
  });

  const text = formatReconciliationResult(result, dryRun);

  return {
    content: [{ type: 'text', text }],
  };
}
