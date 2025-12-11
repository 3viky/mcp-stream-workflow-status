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

// Validate configuration
validateConfig();

// Initialize database
initializeDatabase(config.DATABASE_PATH);

// Create MCP server
const server = new Server(
  {
    name: 'stream-workflow-status',
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

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Stream Workflow Status MCP server running on stdio');
}

// Import and start API server if enabled
import { startApiServer } from './api/server.js';

if (config.API_ENABLED) {
  startApiServer();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
