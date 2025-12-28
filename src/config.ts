/**
 * Configuration for Stream Workflow Status MCP Server
 *
 * Uses centralized per-project storage pattern:
 * ~/.cache/mcp-services/stream-workflow-status/projects/{project}/
 */

import { join, basename } from 'node:path';
import { getMCPServiceDataDir } from '@3viky/mcp-common';
import type { Config } from './types.js';

// Determine project root and name
const projectRoot = process.env.PROJECT_ROOT || process.cwd();
const projectName = basename(projectRoot);

// Get centralized storage directory for this project
const projectStorageDir = join(
  getMCPServiceDataDir('stream-workflow-status'),
  'projects',
  projectName
);

// Load configuration from environment variables
// API_ENABLED defaults to true - dashboard should always be available
// Set API_ENABLED=false to explicitly disable
export const config: Config = {
  PROJECT_ROOT: projectRoot,
  PROJECT_NAME: projectName,
  WORKTREE_ROOT: process.env.WORKTREE_ROOT || join(projectRoot, '..', `${projectName}-worktrees`),
  DATABASE_PATH: process.env.DATABASE_PATH || join(projectStorageDir, 'streams.db'),
  LOCK_FILE_PATH: join(projectStorageDir, '.api-server.lock'),
  API_PORT: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : undefined,
  API_ENABLED: process.env.API_ENABLED !== 'false' && process.env.API_ENABLED !== '0',
};

// Validate configuration
export function validateConfig(): void {
  if (!config.PROJECT_ROOT) {
    throw new Error('PROJECT_ROOT environment variable is required');
  }
  if (!config.PROJECT_NAME) {
    throw new Error('PROJECT_NAME could not be determined from PROJECT_ROOT');
  }
  if (!config.WORKTREE_ROOT) {
    throw new Error('WORKTREE_ROOT environment variable is required');
  }
  if (!config.DATABASE_PATH) {
    throw new Error('DATABASE_PATH could not be determined');
  }
  if (!config.LOCK_FILE_PATH) {
    throw new Error('LOCK_FILE_PATH could not be determined');
  }
  if (config.API_PORT !== undefined && (isNaN(config.API_PORT) || config.API_PORT < 1 || config.API_PORT > 65535)) {
    throw new Error(`Invalid API_PORT: ${config.API_PORT}. Must be between 1-65535`);
  }
}
