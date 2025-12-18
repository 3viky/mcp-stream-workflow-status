/**
 * MCP Tool Handlers
 *
 * Thin adapters that delegate to @3viky/stream-workflow-status-dashboard services.
 * Each handler validates input, calls the appropriate dashboard function,
 * and formats the response for MCP.
 */

import { z } from 'zod';
import { config } from '../config.js';
import type { ToolName } from './definitions.js';

// Import everything from the dashboard package
import {
  getDatabase,
  getQuickStats,
  addStream,
  updateStream,
  completeStream,
  deleteStream,
  getStream,
  addCommit,
  addHistoryEvent,
  syncFromFiles,
  scanAllWorktreeCommits,
  scanStreamWorktree,
  reconcileWorktrees,
} from '@3viky/stream-workflow-status-dashboard';

import type {
  Stream,
  StreamStatus,
  StreamCategory,
  StreamPriority,
} from '@3viky/stream-workflow-status-dashboard';

// ============================================================================
// Zod Schemas for input validation
// ============================================================================

const addStreamSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  streamNumber: z.string().min(1, 'Stream number is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['frontend', 'backend', 'infrastructure', 'testing', 'documentation', 'refactoring']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  worktreePath: z.string().min(1, 'Worktree path is required'),
  branch: z.string().min(1, 'Branch is required'),
  estimatedPhases: z.array(z.string()).optional(),
});

const updateStreamSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  status: z.enum(['initializing', 'active', 'blocked', 'paused', 'completed', 'archived']).optional(),
  progress: z.number().min(0).max(100).optional(),
  currentPhase: z.number().optional(),
  blockedBy: z.string().optional(),
});

const addCommitSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  commitHash: z.string().min(1, 'Commit hash is required'),
  message: z.string().min(1, 'Commit message is required'),
  author: z.string().min(1, 'Author is required'),
  filesChanged: z.number().int().min(0),
  timestamp: z.string().optional(),
});

const removeStreamSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  completionSummary: z.string().optional(),
});

const scanCommitsSchema = z.object({
  streamId: z.string().optional(),
});

const reconcileSchema = z.object({
  dryRun: z.boolean().default(true),
  autoArchiveStale: z.boolean().default(false),
  autoAddOrphaned: z.boolean().default(false),
});

// ============================================================================
// MCP Response Helpers
// ============================================================================

interface McpResponse {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

function success(message: string): McpResponse {
  return { content: [{ type: 'text', text: message }] };
}

function json(data: unknown, prefix?: string): McpResponse {
  const text = prefix
    ? `${prefix}\n\n${JSON.stringify(data, null, 2)}`
    : JSON.stringify(data, null, 2);
  return { content: [{ type: 'text', text }] };
}

// ============================================================================
// Tool Handler Implementation
// ============================================================================

export async function handleToolCall(name: string, args: unknown): Promise<McpResponse> {
  const db = getDatabase();

  switch (name as ToolName) {
    case 'add_stream': {
      const validated = addStreamSchema.parse(args);

      const stream: Stream = {
        id: validated.streamId,
        streamNumber: validated.streamNumber,
        title: validated.title,
        category: validated.category as StreamCategory,
        priority: validated.priority as StreamPriority,
        status: 'initializing',
        progress: 0,
        worktreePath: validated.worktreePath,
        branch: validated.branch,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        phases: validated.estimatedPhases,
      };

      addStream(db, stream);
      addHistoryEvent(db, {
        streamId: stream.id,
        eventType: 'created',
        timestamp: new Date().toISOString(),
      });

      return success(
        `✅ Stream added: ${stream.streamNumber} - ${stream.title}\nStatus: ${stream.status}\nPriority: ${stream.priority}`
      );
    }

    case 'update_stream': {
      const validated = updateStreamSchema.parse(args);

      const stream = getStream(db, validated.streamId);
      if (!stream) {
        throw new Error(`Stream not found: ${validated.streamId}`);
      }

      const previousStatus = stream.status;

      if (validated.status === 'completed' && previousStatus !== 'completed') {
        completeStream(db, validated.streamId);
      } else {
        updateStream(db, validated.streamId, {
          status: validated.status as StreamStatus | undefined,
          progress: validated.progress,
          blockedBy: validated.blockedBy,
        });
      }

      if (validated.status && validated.status !== previousStatus) {
        addHistoryEvent(db, {
          streamId: validated.streamId,
          eventType: 'status_changed',
          oldValue: previousStatus,
          newValue: validated.status,
          timestamp: new Date().toISOString(),
        });
      }

      return success(
        `✅ Stream updated: ${validated.streamId}\n${validated.status ? `Status: ${previousStatus} → ${validated.status}` : ''}${validated.progress !== undefined ? `\nProgress: ${validated.progress}%` : ''}`
      );
    }

    case 'add_commit': {
      const validated = addCommitSchema.parse(args);

      addCommit(db, {
        streamId: validated.streamId,
        commitHash: validated.commitHash,
        message: validated.message,
        author: validated.author,
        filesChanged: validated.filesChanged,
        timestamp: validated.timestamp || new Date().toISOString(),
      });

      return success(
        `✅ Commit tracked: ${validated.commitHash.substring(0, 7)}\nStream: ${validated.streamId}\nMessage: ${validated.message}`
      );
    }

    case 'remove_stream': {
      const validated = removeStreamSchema.parse(args);

      const stream = getStream(db, validated.streamId);
      if (!stream) {
        throw new Error(`Stream not found: ${validated.streamId}`);
      }

      addHistoryEvent(db, {
        streamId: validated.streamId,
        eventType: 'completed',
        newValue: validated.completionSummary || 'Stream archived',
        timestamp: new Date().toISOString(),
      });

      deleteStream(db, validated.streamId);

      return success(`✅ Stream archived: ${validated.streamId}`);
    }

    case 'get_stream_stats': {
      const stats = getQuickStats(db);
      return json(stats, '📊 Stream Statistics');
    }

    case 'get_version': {
      return json({
        name: 'mcp-stream-workflow-status',
        version: '0.3.0',
        capabilities: [
          'add_stream',
          'update_stream',
          'add_commit',
          'remove_stream',
          'get_stream_stats',
          'sync_from_files',
          'scan_commits',
          'reconcile_worktrees',
        ],
        notes: [
          'Thin MCP wrapper around @3viky/stream-workflow-status-dashboard',
          'All business logic delegated to dashboard package',
        ],
      });
    }

    case 'sync_from_files': {
      const result = await syncFromFiles(db, config.PROJECT_ROOT, config.WORKTREE_ROOT);
      return json(result, '🔄 Sync from files complete');
    }

    case 'scan_commits': {
      const validated = scanCommitsSchema.parse(args);

      if (validated.streamId) {
        const stream = getStream(db, validated.streamId);
        if (!stream) {
          throw new Error(`Stream not found: ${validated.streamId}`);
        }
        const result = await scanStreamWorktree(db, stream);
        return json(result, `📝 Scanned commits for ${validated.streamId}`);
      }

      const result = await scanAllWorktreeCommits(db, config.PROJECT_ROOT);
      return json(result, '📝 Scanned all worktree commits');
    }

    case 'reconcile_worktrees': {
      const validated = reconcileSchema.parse(args);
      const result = await reconcileWorktrees(db, config.PROJECT_ROOT, {
        dryRun: validated.dryRun,
        autoArchiveStale: validated.autoArchiveStale,
        autoAddOrphaned: validated.autoAddOrphaned,
      });
      return json(result, validated.dryRun ? '🔍 Reconciliation (dry run)' : '✅ Reconciliation complete');
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
