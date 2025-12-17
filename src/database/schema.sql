-- Stream Workflow Status Database Schema
-- SQLite with foreign keys and WAL mode enabled

CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY,
  stream_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'initializing',
  progress INTEGER DEFAULT 0,
  current_phase INTEGER,
  worktree_path TEXT,
  branch TEXT NOT NULL,
  blocked_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  phases TEXT  -- JSON array of phase names
);

CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
CREATE INDEX IF NOT EXISTS idx_streams_category ON streams(category);
CREATE INDEX IF NOT EXISTS idx_streams_priority ON streams(priority);
CREATE INDEX IF NOT EXISTS idx_streams_updated ON streams(updated_at DESC);

CREATE TABLE IF NOT EXISTS commits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  commit_hash TEXT NOT NULL,
  message TEXT NOT NULL,
  author TEXT,
  files_changed INTEGER DEFAULT 0,
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commits_stream ON commits(stream_id);
CREATE INDEX IF NOT EXISTS idx_commits_timestamp ON commits(timestamp DESC);

CREATE TABLE IF NOT EXISTS stream_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_history_stream ON stream_history(stream_id);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON stream_history(timestamp DESC);

CREATE TABLE IF NOT EXISTS summary_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL,
  stream_number TEXT NOT NULL,
  stream_title TEXT NOT NULL,
  stream_category TEXT NOT NULL,
  stream_branch TEXT NOT NULL,
  stream_worktree_path TEXT NOT NULL,
  stream_created_at TEXT NOT NULL,
  stream_completed_at TEXT,
  user_summary TEXT NOT NULL,
  history_file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_summary_jobs_status ON summary_jobs(status);
CREATE INDEX IF NOT EXISTS idx_summary_jobs_created ON summary_jobs(created_at DESC);
