#!/usr/bin/env node
/**
 * Project Dashboard Launcher - Multi-Agent Aware
 *
 * This script implements multi-agent coordination:
 * 1. Discovers existing API server via lock file
 * 2. Reuses existing server if found for this project
 * 3. Starts new server only if none exists
 * 4. Opens browser to the correct port
 *
 * Works seamlessly across multiple agents working on the same project.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Get lock file path for the current project
 */
function getLockFilePath() {
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const projectName = basename(projectRoot);
  const homeDir = process.env.HOME || process.env.USERPROFILE;

  return join(
    homeDir,
    '.cache',
    'mcp-services',
    'stream-workflow-status',
    'projects',
    projectName,
    '.api-server.lock'
  );
}

/**
 * Read lock file to get existing server info
 */
function readLockFile(lockFilePath) {
  try {
    if (!existsSync(lockFilePath)) {
      return null;
    }
    const content = readFileSync(lockFilePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read lock file:', error);
    return null;
  }
}

/**
 * Check if a process is alive
 */
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Discover existing API server or determine we need to start one
 */
function discoverServer() {
  const lockFilePath = getLockFilePath();
  const lock = readLockFile(lockFilePath);

  if (lock && isProcessAlive(lock.pid)) {
    console.log(`✓ Found existing server (PID: ${lock.pid}, Port: ${lock.port})`);
    console.log(`  Project: ${lock.projectName}`);
    console.log(`  Started: ${new Date(lock.startedAt).toLocaleString()}`);
    return { port: lock.port, existing: true };
  }

  console.log('✗ No existing server found');
  return { port: null, existing: false };
}

/**
 * Start the API server in the background
 */
function startAPIServer() {
  console.log('Starting API server...');

  const serverProcess = spawn('node', ['dist/server.js'], {
    cwd: rootDir,
    detached: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      API_ENABLED: 'true',
      // Don't set API_PORT - let server discovery handle it
      // Don't set DATABASE_PATH - config.ts handles centralized storage
      PROJECT_ROOT: process.env.PROJECT_ROOT || process.cwd(),
    },
  });

  // Detach the server so it continues running after this script exits
  serverProcess.unref();

  console.log(`Server process started (PID: ${serverProcess.pid})`);

  // Give the server time to start and write lock file
  return new Promise(resolve => setTimeout(resolve, 3000));
}

/**
 * Open browser to the dashboard URL
 */
async function openBrowser(port) {
  const dashboardUrl = `http://localhost:${port}/`;
  console.log(`\nOpening browser to ${dashboardUrl}...`);

  // Use the system's default browser opener
  const { platform } = process;
  let command;

  if (platform === 'linux') {
    command = 'xdg-open';
  } else if (platform === 'darwin') {
    command = 'open';
  } else if (platform === 'win32') {
    command = 'start';
  } else {
    console.error(`Unsupported platform: ${platform}`);
    console.log(`Please open ${dashboardUrl} in your browser`);
    return;
  }

  const browserProcess = spawn(command, [dashboardUrl], {
    detached: true,
    stdio: 'ignore',
  });

  browserProcess.unref();
}

/**
 * Main execution - Multi-agent aware
 */
async function main() {
  console.log('========================================');
  console.log('  Stream Workflow Status Dashboard');
  console.log('========================================\n');

  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const projectName = basename(projectRoot);
  console.log(`Project: ${projectName}`);
  console.log(`Root:    ${projectRoot}\n`);

  // Discover existing server
  let serverInfo = discoverServer();

  if (!serverInfo.existing) {
    // No existing server, start new one (which will handle its own discovery)
    console.log('Starting API server (will auto-discover or create new)...');
    await startAPIServer();
    console.log('✓ Server process started\n');
  }

  // Always re-read lock file to get final port
  // (Server might have discovered and reused existing server during startup)
  const lockFilePath = getLockFilePath();
  const lock = readLockFile(lockFilePath);

  if (lock) {
    serverInfo = { port: lock.port, existing: serverInfo.existing };
    console.log(`Server available on port ${lock.port}`);
  } else {
    console.error('Failed to read lock file');
    console.log('Server may still be starting up, or there was an error');
    console.log('Try again in a few seconds, or check logs');
    process.exit(1);
  }

  // Open browser to dashboard
  await openBrowser(serverInfo.port);

  console.log('\n========================================');
  console.log(`Dashboard: http://localhost:${serverInfo.port}/`);
  console.log(`API:       http://localhost:${serverInfo.port}/api/`);
  console.log('========================================\n');

  if (!serverInfo.existing) {
    console.log('Tip: Server will continue running in the background.');
    console.log('     Multiple agents can share this server.');
    console.log('     It will auto-cleanup on shutdown.\n');
  }
}

main().catch((err) => {
  console.error('Error launching dashboard:', err);
  process.exit(1);
});
