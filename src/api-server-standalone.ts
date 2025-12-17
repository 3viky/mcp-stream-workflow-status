#!/usr/bin/env node
/**
 * Standalone API Server for Stream Workflow Status
 *
 * This entry point runs ONLY the Express API server without MCP stdio transport.
 * Used by systemd service to provide persistent dashboard access.
 *
 * Unlike src/server.ts which runs both API + MCP stdio, this runs only the API server
 * and can persist independently of Claude Code sessions.
 */

import { config, validateConfig } from './config.js';
import { initializeDatabase } from './database/client.js';
import { startApiServer } from './api/server.js';
import { syncFromFiles } from './tools/sync-from-files.js';
import { scanAllWorktreeCommits } from './scanners/git-commits.js';
import { getAllStreams } from './database/queries/streams.js';
import { getTotalCommitsCount } from './database/queries/commits.js';
import { getDatabase } from './database/client.js';

// Validate configuration
validateConfig();

// Initialize database
initializeDatabase(config.DATABASE_PATH);

/**
 * Start standalone API server
 */
async function main() {
  console.error('[Standalone] Stream Workflow Status API Server');
  console.error('[Standalone] Running in standalone mode (no MCP stdio)');
  console.error(`[Standalone] Project: ${config.PROJECT_NAME}`);
  console.error(`[Standalone] Database: ${config.DATABASE_PATH}\n`);

  // Auto-sync from .project/plan/streams/ if database is empty
  try {
    const db = getDatabase();
    let streamCount = getAllStreams(db).length;
    let commitCount = getTotalCommitsCount(db);

    // Sync streams from filesystem if database is empty
    if (streamCount === 0) {
      console.error('[Standalone] Database empty, auto-syncing from .project/plan/streams/...');
      const result = await syncFromFiles();
      console.error(`[Standalone] Auto-sync complete: ${result.synced} streams synced`);

      // Re-query after sync
      streamCount = getAllStreams(db).length;
    }

    // Auto-scan commits asynchronously (don't block server startup)
    if (streamCount > 0 && commitCount === 0) {
      console.error('[Standalone] Scheduling background commit scan (last 50 commits or 7 days per stream)...');
      // Run in background after server is up
      setImmediate(async () => {
        try {
          const commitResult = await scanAllWorktreeCommits();
          console.error(`[Standalone] Background scan complete: ${commitResult.commitsAdded} commits from ${commitResult.scanned} streams (${commitResult.errors} errors)`);
        } catch (error) {
          console.error('[Standalone] Background commit scan failed:', error);
        }
      });
    }
  } catch (error) {
    console.error('[Standalone] Auto-initialization failed (non-fatal):', error);
  }

  // Start API server
  if (!config.API_ENABLED) {
    console.error('[Standalone] ERROR: API_ENABLED is false. This standalone server requires API_ENABLED=true');
    process.exit(1);
  }

  try {
    const serverInfo = await startApiServer();
    console.error(`[Standalone] API server ${serverInfo.existing ? 'discovered' : 'started'} on port ${serverInfo.port}`);
    console.error(`[Standalone] Dashboard: http://localhost:${serverInfo.port}/`);
    console.error(`[Standalone] API: http://localhost:${serverInfo.port}/api/`);
    console.error('[Standalone] Server running - press Ctrl+C to stop\n');

    // Keep process alive (no stdio transport to block on)
    // The Express server and periodic scanning will keep the event loop active
  } catch (error) {
    console.error('[Standalone] Failed to start API server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[Standalone] Fatal error:', error);
  process.exit(1);
});
