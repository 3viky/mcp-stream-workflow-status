#!/usr/bin/env node
/**
 * Project Dashboard Launcher - Systemd Service Integration
 *
 * This script manages the dashboard as a systemd user service:
 * 1. Checks if systemd service is installed
 * 2. Offers to install service if missing
 * 3. Starts service using systemctl if not running
 * 4. Opens browser to dashboard
 *
 * Benefits:
 * - Service persists across agent sessions
 * - Auto-restart on failure
 * - Standard Linux service management
 * - Journal logging integration
 */

import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { getMCPServiceDataDir } from '@3viky/mcp-common';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const SERVICE_NAME = 'stream-dashboard';
const SERVICE_FILE = `${SERVICE_NAME}.service`;

/**
 * Get systemd user service directory
 */
function getSystemdUserDir() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  return join(homeDir, '.config', 'systemd', 'user');
}

/**
 * Check if systemd service is installed
 */
function isServiceInstalled() {
  const servicePath = join(getSystemdUserDir(), SERVICE_FILE);
  return existsSync(servicePath);
}

/**
 * Check if systemd service is running
 */
function isServiceRunning() {
  try {
    const result = execSync(`systemctl --user is-active ${SERVICE_NAME}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return result === 'active';
  } catch (error) {
    return false;
  }
}

/**
 * Check and enable user linger (required for services to persist beyond sessions)
 */
function ensureLinger() {
  try {
    const lingerStatus = execSync('loginctl show-user $(whoami) --property=Linger', {
      encoding: 'utf-8',
    }).trim();

    if (lingerStatus === 'Linger=no') {
      console.log('Enabling user linger (allows service to persist beyond sessions)...');
      execSync('loginctl enable-linger $(whoami)', { stdio: 'inherit' });
      console.log('✓ User linger enabled');
    }
  } catch (error) {
    console.warn('Warning: Could not enable linger. Service may stop when you log out.');
    console.warn('  Run manually: loginctl enable-linger $(whoami)');
  }
}

/**
 * Install systemd service
 */
function installService() {
  console.log('Installing systemd service...');

  const systemdUserDir = getSystemdUserDir();
  const serviceSrc = join(rootDir, 'systemd', SERVICE_FILE);
  const serviceDest = join(systemdUserDir, SERVICE_FILE);

  // Create systemd user directory if needed
  if (!existsSync(systemdUserDir)) {
    mkdirSync(systemdUserDir, { recursive: true });
  }

  // Read template and replace placeholders
  let serviceContent = readFileSync(serviceSrc, 'utf-8');
  const homeDir = process.env.HOME || process.env.USERPROFILE;

  // Replace %h with actual home directory for compatibility
  serviceContent = serviceContent.replace(/%h/g, homeDir);

  // Write service file
  writeFileSync(serviceDest, serviceContent);

  console.log(`✓ Service file installed: ${serviceDest}`);

  // Reload systemd daemon
  try {
    execSync('systemctl --user daemon-reload', { stdio: 'inherit' });
    console.log('✓ Systemd daemon reloaded');
  } catch (error) {
    console.error('Failed to reload systemd daemon:', error.message);
    throw error;
  }

  // Enable linger so service persists beyond login sessions
  ensureLinger();

  console.log('\nService installed successfully!');
  console.log('Optional: Enable auto-start on login:');
  console.log(`  systemctl --user enable ${SERVICE_NAME}`);
}

/**
 * Start systemd service
 */
function startService() {
  console.log(`Starting ${SERVICE_NAME} service...`);

  try {
    execSync(`systemctl --user start ${SERVICE_NAME}`, { stdio: 'inherit' });
    console.log('✓ Service started');
  } catch (error) {
    console.error('Failed to start service:', error.message);
    throw error;
  }
}

/**
 * Get service status
 */
function getServiceStatus() {
  try {
    const status = execSync(`systemctl --user status ${SERVICE_NAME} --no-pager`, {
      encoding: 'utf-8',
    });
    return status;
  } catch (error) {
    return error.stdout || error.message;
  }
}

/**
 * Get lock file path for the current project
 */
function getLockFilePath() {
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const projectName = basename(projectRoot);

  // Use same path logic as server config
  const projectStorageDir = join(
    getMCPServiceDataDir('stream-workflow-status'),
    'projects',
    projectName
  );

  return join(projectStorageDir, '.api-server.lock');
}

/**
 * Read lock file to get server info
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
 * Wait for server to be ready (lock file written)
 */
async function waitForServer(maxAttempts = 10) {
  const lockFilePath = getLockFilePath();

  for (let i = 0; i < maxAttempts; i++) {
    const lock = readLockFile(lockFilePath);
    if (lock) {
      return lock;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return null;
}

/**
 * Open browser to the dashboard URL
 */
async function openBrowser(port) {
  const dashboardUrl = `http://localhost:${port}/`;
  console.log(`\nOpening browser to ${dashboardUrl}...`);

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
 * Main execution - Systemd service management
 */
async function main() {
  console.log('========================================');
  console.log('  Stream Workflow Status Dashboard');
  console.log('  Systemd Service Manager');
  console.log('========================================\n');

  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const projectName = basename(projectRoot);
  console.log(`Project: ${projectName}`);
  console.log(`Root:    ${projectRoot}\n`);

  // Check if service is installed
  if (!isServiceInstalled()) {
    console.log('⚠ Systemd service not installed\n');
    installService();
    console.log('');
  }

  // Check if service is running
  const isRunning = isServiceRunning();

  if (isRunning) {
    console.log(`✓ Service is already running`);
  } else {
    console.log('✗ Service is not running');
    startService();
  }

  // Wait for server to be ready
  console.log('\nWaiting for server to be ready...');
  const lock = await waitForServer();

  if (!lock) {
    console.error('\n✗ Failed to connect to server');
    console.log('\nService status:');
    console.log(getServiceStatus());
    console.log('\nCheck logs with: journalctl --user -u stream-dashboard -n 50');
    process.exit(1);
  }

  console.log(`✓ Server ready (PID: ${lock.pid}, Port: ${lock.port})`);
  console.log(`  Project: ${lock.projectName}`);
  console.log(`  Started: ${new Date(lock.startedAt).toLocaleString()}`);

  // Open browser to dashboard
  await openBrowser(lock.port);

  console.log('\n========================================');
  console.log(`Dashboard: http://localhost:${lock.port}/`);
  console.log(`API:       http://localhost:${lock.port}/api/`);
  console.log('========================================\n');

  console.log('Service Management:');
  console.log(`  Status:  systemctl --user status ${SERVICE_NAME}`);
  console.log(`  Stop:    systemctl --user stop ${SERVICE_NAME}`);
  console.log(`  Restart: systemctl --user restart ${SERVICE_NAME}`);
  console.log(`  Logs:    journalctl --user -u ${SERVICE_NAME} -f`);
  console.log(`  Enable:  systemctl --user enable ${SERVICE_NAME} (auto-start)\n`);
}

main().catch((err) => {
  console.error('Error launching dashboard:', err);
  process.exit(1);
});
