#!/usr/bin/env node
/**
 * Stream Workflow Status MCP Server
 *
 * Provides real-time stream status tracking and dashboard
 * for development workflows.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { config, validateConfig } from './config.js';
import { initializeDatabase } from './database/client.js';
import { addStreamTool } from './tools/add-stream.js';
import { updateStreamTool } from './tools/update-stream.js';
import { addCommitTool } from './tools/add-commit.js';
import { removeStreamTool } from './tools/remove-stream.js';
import { getStreamStatsTool } from './tools/get-stream-stats.js';
import { getVersionTool } from './tools/get-version.js';
import { syncFromFilesTool } from './tools/sync-from-files.js';
import { scanCommitsTool } from './scanners/git-commits.js';

// Validate configuration
validateConfig();

// Initialize database
initializeDatabase(config.DATABASE_PATH);

// Import sync functions for auto-population
import { syncFromFiles } from './tools/sync-from-files.js';
import { scanAllWorktreeCommits } from './scanners/git-commits.js';
import { getAllStreams } from './database/queries/streams.js';
import { getTotalCommitsCount } from './database/queries/commits.js';
import { getDatabase } from './database/client.js';

// Create MCP server
const server = new Server(
  {
    name: 'mcp-stream-workflow-status',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
        description: 'Sync streams from .project/plan/streams/ directory into database (auto-runs on first startup)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'scan_commits',
        description: 'Scan git commits from worktrees and populate commits table (for stream activity tracking)',
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
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'add_stream':
        return await addStreamTool(args);
      case 'update_stream':
        return await updateStreamTool(args);
      case 'add_commit':
        return await addCommitTool(args);
      case 'remove_stream':
        return await removeStreamTool(args);
      case 'get_stream_stats':
        return await getStreamStatsTool();
      case 'get_version':
        return await getVersionTool();
      case 'sync_from_files':
        return await syncFromFilesTool();
      case 'scan_commits':
        return await scanCommitsTool(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `❌ ${name} failed\n\n${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Import and start API server if enabled
import { startApiServer } from './api/server.js';

// Start server
async function main() {
  // Auto-sync from .project/plan/streams/ if database is empty
  try {
    const db = getDatabase();
    let streamCount = getAllStreams(db).length;
    let commitCount = getTotalCommitsCount(db);

    // Sync streams from filesystem if database is empty
    if (streamCount === 0) {
      console.error('[MCP] Database empty, auto-syncing from .project/plan/streams/...');
      const result = await syncFromFiles();
      console.error(`[MCP] Auto-sync complete: ${result.synced} streams synced`);

      // Re-query after sync
      streamCount = getAllStreams(db).length;
    }

    // Auto-scan commits asynchronously (don't block server startup)
    if (streamCount > 0 && commitCount === 0) {
      console.error('[MCP] Scheduling background commit scan (last 50 commits or 7 days per stream)...');
      // Run in background after server is up
      setImmediate(async () => {
        try {
          const commitResult = await scanAllWorktreeCommits();
          console.error(`[MCP] Background scan complete: ${commitResult.commitsAdded} commits from ${commitResult.scanned} streams (${commitResult.errors} errors)`);
        } catch (error) {
          console.error('[MCP] Background commit scan failed:', error);
        }
      });
    }
  } catch (error) {
    console.error('[MCP] Auto-initialization failed (non-fatal):', error);
  }

  // Start API server first (if enabled) to establish multi-agent coordination
  if (config.API_ENABLED) {
    try {
      const serverInfo = await startApiServer();
      console.error(`[MCP] API server ${serverInfo.existing ? 'discovered' : 'started'} on port ${serverInfo.port}`);
    } catch (error) {
      console.error('[MCP] Failed to start API server:', error);
      console.error('[MCP] Continuing with MCP tools only (API disabled)');
    }
  }

  // Connect MCP server to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Stream Workflow Status MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
