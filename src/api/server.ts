/**
 * Express API Server for Stream Workflow Status
 *
 * Implements multi-agent coordination:
 * - Discovers existing API servers via lock files
 * - Reuses existing servers for the same project
 * - Only starts new server if none exists
 * - Cleans up lock files on shutdown
 */

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';
import { streamsRouter } from './routes/streams.js';
import { commitsRouter } from './routes/commits.js';
import { statsRouter } from './routes/stats.js';
import { reconciliationRouter } from './routes/reconciliation.js';
import {
  discoverApiServer,
  writeLockFile,
  setupGracefulShutdown,
  type ServerLock,
} from '../utils/server-discovery.js';
import { eventManager, notifyUpdate } from './events.js';
import { scanAllWorktreeCommits } from '../scanners/git-commits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/streams', streamsRouter);
app.use('/api/commits', commitsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/reconciliation', reconciliationRouter);

// SSE endpoint for real-time updates
app.get('/api/events', (req, res) => {
  eventManager.addClient(res);
});

// Serve dashboard (static files from dashboard/dist)
const dashboardPath = path.join(__dirname, '../../dashboard/dist');
app.use(express.static(dashboardPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(dashboardPath, 'index.html'));
});

/**
 * Start the API server with multi-agent coordination
 *
 * Discovers if a server is already running for this project.
 * If found, returns existing server info without starting a new one.
 * If not found, starts new server and writes lock file.
 *
 * @returns Server information (port, existing flag)
 */
export async function startApiServer(): Promise<{ port: number; existing: boolean }> {
  if (!config.API_ENABLED) {
    console.error('[Server] API server disabled (API_ENABLED=false)');
    throw new Error('API server is disabled');
  }

  // Discover if server already exists for this project
  const discovery = await discoverApiServer(
    config.LOCK_FILE_PATH,
    config.PROJECT_ROOT,
    config.PROJECT_NAME
  );

  if (discovery.existing) {
    // Server already running, reuse it
    console.error(`[Server] Reusing existing server for ${config.PROJECT_NAME} on port ${discovery.port}`);
    console.error(`[Server] Dashboard: http://localhost:${discovery.port}/`);
    return { port: discovery.port, existing: true };
  }

  // No existing server, start new one
  const port = discovery.port;

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.error(`\n${'='.repeat(60)}`);
      console.error('Stream Workflow Status API Server');
      console.error(`${'='.repeat(60)}\n`);
      console.error(`Project:        ${config.PROJECT_NAME}`);
      console.error(`Dashboard:      http://localhost:${port}/`);
      console.error(`API Endpoints:  http://localhost:${port}/api/`);
      console.error(`Database:       ${config.DATABASE_PATH}`);
      console.error(`Lock File:      ${config.LOCK_FILE_PATH}`);
      console.error(`\nAvailable Routes:`);
      console.error(`  GET  /api/streams              List all streams`);
      console.error(`  GET  /api/streams/:id          Get single stream`);
      console.error(`  PATCH /api/streams/:id         Update stream status`);
      console.error(`  POST /api/streams/:id/archive  Archive single stream`);
      console.error(`  POST /api/streams/archive-bulk Archive multiple streams`);
      console.error(`  GET  /api/commits              Get recent commits`);
      console.error(`  GET  /api/stats                Get statistics`);
      console.error(`  GET  /api/reconciliation/status  Compare DB vs worktrees`);
      console.error(`  POST /api/reconciliation/run     Run reconciliation`);
      console.error(`\n${'='.repeat(60)}\n`);

      // Write lock file
      const lock: ServerLock = {
        pid: process.pid,
        port,
        projectRoot: config.PROJECT_ROOT,
        projectName: config.PROJECT_NAME,
        startedAt: new Date().toISOString(),
        nodeVersion: process.version,
      };

      try {
        writeLockFile(config.LOCK_FILE_PATH, lock);
        console.error(`[Server] Lock file written: ${config.LOCK_FILE_PATH}`);
      } catch (error) {
        console.error('[Server] Failed to write lock file:', error);
      }

      // Setup graceful shutdown
      setupGracefulShutdown(config.LOCK_FILE_PATH);

      // Start periodic git scanning (every 60 seconds)
      startPeriodicScanning();

      resolve({ port, existing: false });
    });

    server.on('error', (error) => {
      console.error('[Server] Failed to start:', error);
      reject(error);
    });
  });
}

const SCAN_INTERVAL_MS = 60_000; // 1 minute
let scanningInterval: NodeJS.Timeout | null = null;

/**
 * Start periodic git commit scanning
 * Scans every 60 seconds and notifies connected clients of new data
 */
function startPeriodicScanning(): void {
  if (scanningInterval) {
    clearInterval(scanningInterval);
  }

  console.error(`[Scanner] Starting periodic git scan (every ${SCAN_INTERVAL_MS / 1000}s)`);

  scanningInterval = setInterval(async () => {
    try {
      const result = await scanAllWorktreeCommits();

      // Only notify if new commits were added
      if (result.commitsAdded > 0) {
        console.error(`[Scanner] Found ${result.commitsAdded} new commits`);
        notifyUpdate('commits');
        notifyUpdate('stats');
      }
    } catch (error) {
      console.error('[Scanner] Periodic scan failed:', error);
    }
  }, SCAN_INTERVAL_MS);

  // Don't prevent process exit
  scanningInterval.unref();
}
