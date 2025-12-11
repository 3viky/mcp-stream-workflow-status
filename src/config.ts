/**
 * Configuration for Stream Workflow Status MCP Server
 */

import { join } from 'node:path';
import { homedir } from 'node:os';
import type { Config } from './types.js';

// Load configuration from environment variables
export const config: Config = {
  PROJECT_ROOT: process.env.PROJECT_ROOT || process.cwd(),
  WORKTREE_ROOT: process.env.WORKTREE_ROOT || join(process.cwd(), '..', 'worktrees'),
  DATABASE_PATH: process.env.DATABASE_PATH || join(homedir(), 'Code', 'packages', 'src', '@mcp', 'stream-workflow-status', 'data', 'streams.db'),
  API_PORT: parseInt(process.env.API_PORT || '3001', 10),
  API_ENABLED: process.env.API_ENABLED === 'true' || process.env.API_ENABLED === '1',
};

// Validate configuration
export function validateConfig(): void {
  if (!config.PROJECT_ROOT) {
    throw new Error('PROJECT_ROOT environment variable is required');
  }
  if (!config.WORKTREE_ROOT) {
    throw new Error('WORKTREE_ROOT environment variable is required');
  }
  if (!config.DATABASE_PATH) {
    throw new Error('DATABASE_PATH environment variable is required');
  }
  if (isNaN(config.API_PORT) || config.API_PORT < 1 || config.API_PORT > 65535) {
    throw new Error(`Invalid API_PORT: ${config.API_PORT}. Must be between 1-65535`);
  }
}
