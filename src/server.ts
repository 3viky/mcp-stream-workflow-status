#!/usr/bin/env node
/**
 * Stream Workflow Status MCP Server
 *
 * This is a THIN WRAPPER around @3viky/stream-workflow-status-dashboard.
 * All business logic, database operations, and services are provided
 * by the dashboard package. This file only provides MCP protocol adaptation.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { config, validateConfig } from './config.js';
import { TOOL_DEFINITIONS } from './tools/definitions.js';
import { handleToolCall } from './tools/handlers.js';

// Import from dashboard package
import {
  initializeDatabase,
  getDatabase,
  getAllStreams,
  syncFromFiles,
  scanAllWorktreeCommits,
  startApiServer,
  startSummaryWorker,
} from '@3viky/stream-workflow-status-dashboard';

import type { ApiServerConfig } from '@3viky/stream-workflow-status-dashboard';

// Validate configuration
validateConfig();

// Initialize database
initializeDatabase(config.DATABASE_PATH);

// Create MCP server
const server = new Server(
  {
    name: 'mcp-stream-workflow-status',
    version: '0.3.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOL_DEFINITIONS };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    return await handleToolCall(name, args);
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
  const db = getDatabase();

  // Auto-sync from .project/plan/streams/ if database is empty
  try {
    let streamCount = getAllStreams(db).length;

    if (streamCount === 0) {
      console.error('[MCP] Database empty, auto-syncing from .project/plan/streams/...');
      const result = await syncFromFiles(db, config.PROJECT_ROOT, config.WORKTREE_ROOT);
      console.error(`[MCP] Auto-sync complete: ${result.synced} streams synced`);
      streamCount = result.synced;
    }

    // Auto-scan commits asynchronously
    if (streamCount > 0) {
      setImmediate(async () => {
        try {
          const commitResult = await scanAllWorktreeCommits(db, config.PROJECT_ROOT);
          console.error(
            `[MCP] Background scan: ${commitResult.commitsAdded} commits from ${commitResult.scanned} streams`
          );
        } catch (error) {
          console.error('[MCP] Background commit scan failed:', error);
        }
      });
    }
  } catch (error) {
    console.error('[MCP] Auto-initialization failed (non-fatal):', error);
  }

  // Start API server for dashboard if enabled
  if (config.API_ENABLED) {
    try {
      const apiConfig: ApiServerConfig = {
        projectRoot: config.PROJECT_ROOT,
        projectName: config.PROJECT_NAME,
        worktreeRoot: config.WORKTREE_ROOT,
        lockFilePath: config.LOCK_FILE_PATH,
        databasePath: config.DATABASE_PATH,
        port: config.API_PORT,
      };

      const serverInfo = await startApiServer(db, apiConfig);
      console.error(
        `[MCP] API server ${serverInfo.existing ? 'discovered' : 'started'} on port ${serverInfo.port}`
      );
      console.error(`[MCP] Dashboard: http://localhost:${serverInfo.port}/`);
    } catch (error) {
      console.error('[MCP] Failed to start API server:', error);
    }
  }

  // Start background worker for intelligent summary generation
  setImmediate(() => {
    startSummaryWorker(db, config.PROJECT_ROOT, 10000).catch((error) => {
      console.error('[MCP] Background worker crashed:', error);
    });
  });

  // Connect MCP server to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Stream Workflow Status MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
