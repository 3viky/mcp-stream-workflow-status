/**
 * MCP Tool Definitions
 *
 * JSON Schema definitions for all MCP tools.
 * These are the exact schemas exposed to Claude via the MCP protocol.
 */

export const TOOL_DEFINITIONS = [
  {
    name: 'add_stream',
    description: 'Register new stream in status database',
    inputSchema: {
      type: 'object',
      properties: {
        streamId: { type: 'string', description: 'Unique stream identifier' },
        streamNumber: { type: 'string', description: 'Stream number (e.g., "0101")' },
        title: { type: 'string', description: 'Stream title' },
        category: {
          type: 'string',
          enum: ['frontend', 'backend', 'infrastructure', 'testing', 'documentation', 'refactoring'],
          description: 'Stream category',
        },
        priority: {
          type: 'string',
          enum: ['critical', 'high', 'medium', 'low'],
          description: 'Stream priority',
        },
        worktreePath: { type: 'string', description: 'Path to worktree' },
        branch: { type: 'string', description: 'Git branch name' },
        estimatedPhases: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional array of phase names',
        },
      },
      required: ['streamId', 'streamNumber', 'title', 'category', 'priority', 'worktreePath', 'branch'],
    },
  },
  {
    name: 'update_stream',
    description: 'Update stream status, progress, or metadata',
    inputSchema: {
      type: 'object',
      properties: {
        streamId: { type: 'string', description: 'Stream identifier' },
        status: {
          type: 'string',
          enum: ['initializing', 'active', 'blocked', 'paused', 'completed', 'archived'],
          description: 'New status',
        },
        progress: {
          type: 'number',
          minimum: 0,
          maximum: 100,
          description: 'Progress percentage (0-100)',
        },
        currentPhase: {
          type: 'number',
          description: 'Index of current phase',
        },
        blockedBy: {
          type: 'string',
          description: 'Stream ID blocking this stream',
        },
      },
      required: ['streamId'],
    },
  },
  {
    name: 'add_commit',
    description: 'Track commit made in worktree',
    inputSchema: {
      type: 'object',
      properties: {
        streamId: { type: 'string', description: 'Stream identifier' },
        commitHash: { type: 'string', description: 'Git commit hash' },
        message: { type: 'string', description: 'Commit message' },
        author: { type: 'string', description: 'Commit author' },
        filesChanged: { type: 'number', description: 'Number of files changed' },
        timestamp: { type: 'string', description: 'ISO 8601 timestamp (optional)' },
      },
      required: ['streamId', 'commitHash', 'message', 'author', 'filesChanged'],
    },
  },
  {
    name: 'remove_stream',
    description: 'Archive completed stream',
    inputSchema: {
      type: 'object',
      properties: {
        streamId: { type: 'string', description: 'Stream identifier' },
        completionSummary: { type: 'string', description: 'Optional completion summary' },
      },
      required: ['streamId'],
    },
  },
  {
    name: 'get_stream_stats',
    description: 'Get quick dashboard statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_version',
    description: 'Get service version information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'sync_from_files',
    description:
      'Sync streams from .project/plan/streams/ directory into database (auto-runs on first startup)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'scan_commits',
    description:
      'Scan git commits from worktrees and populate commits table (for stream activity tracking)',
    inputSchema: {
      type: 'object',
      properties: {
        streamId: {
          type: 'string',
          description: 'Optional: scan specific stream only (otherwise scans all streams)',
        },
      },
    },
  },
  {
    name: 'reconcile_worktrees',
    description:
      'Reconcile database with actual git worktrees. Identifies stale entries (no worktree), completed streams (merged to main), and orphaned worktrees (no DB entry).',
    inputSchema: {
      type: 'object',
      properties: {
        dryRun: {
          type: 'boolean',
          default: true,
          description: 'Only report differences, do not update database (default: true)',
        },
        autoArchiveStale: {
          type: 'boolean',
          default: false,
          description: 'Automatically mark stale streams (no worktree) as archived (default: false)',
        },
        autoAddOrphaned: {
          type: 'boolean',
          default: false,
          description: 'Automatically add orphaned worktrees to database (default: false)',
        },
      },
    },
  },
] as const;

export type ToolName = (typeof TOOL_DEFINITIONS)[number]['name'];
