/**
 * Configuration types for Stream Workflow Status MCP Server
 */

export interface Config {
  PROJECT_ROOT: string;
  PROJECT_NAME: string;
  WORKTREE_ROOT: string;
  DATABASE_PATH: string;
  LOCK_FILE_PATH: string;
  API_PORT: number | undefined;
  API_ENABLED: boolean;
}
