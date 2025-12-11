/**
 * Database queries for commits table
 */

import type Database from 'better-sqlite3';
import type { Commit } from '../../types.js';

/**
 * Insert a new commit
 */
export function insertCommit(db: Database.Database, commit: Commit): number {
  const stmt = db.prepare(`
    INSERT INTO commits (stream_id, commit_hash, message, author, files_changed, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    commit.streamId,
    commit.commitHash,
    commit.message,
    commit.author,
    commit.filesChanged,
    commit.timestamp
  );

  return result.lastInsertRowid as number;
}

/**
 * Get commits for a stream
 */
export function getCommitsByStream(db: Database.Database, streamId: string): Commit[] {
  const stmt = db.prepare(`
    SELECT * FROM commits WHERE stream_id = ? ORDER BY timestamp DESC
  `);

  const rows = stmt.all(streamId) as any[];
  return rows.map(rowToCommit);
}

/**
 * Get all commits
 */
export function getAllCommits(db: Database.Database): Commit[] {
  const stmt = db.prepare(`
    SELECT * FROM commits ORDER BY timestamp DESC
  `);

  const rows = stmt.all() as any[];
  return rows.map(rowToCommit);
}

/**
 * Get recent commits with limit
 */
export function getRecentCommits(db: Database.Database, limit: number = 20): Commit[] {
  const stmt = db.prepare(`
    SELECT * FROM commits ORDER BY timestamp DESC LIMIT ?
  `);

  const rows = stmt.all(limit) as any[];
  return rows.map(rowToCommit);
}

/**
 * Get commits for a specific stream with limit
 */
export function getStreamCommits(db: Database.Database, streamId: string, limit: number = 20): Commit[] {
  const stmt = db.prepare(`
    SELECT * FROM commits WHERE stream_id = ? ORDER BY timestamp DESC LIMIT ?
  `);

  const rows = stmt.all(streamId, limit) as any[];
  return rows.map(rowToCommit);
}

/**
 * Get commits count for a stream
 */
export function getCommitsCountByStream(db: Database.Database, streamId: string): number {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM commits WHERE stream_id = ?
  `);

  const row = stmt.get(streamId) as any;
  return row.count;
}

/**
 * Get total commits count
 */
export function getTotalCommitsCount(db: Database.Database): number {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM commits
  `);

  const row = stmt.get() as any;
  return row.count;
}

/**
 * Get commits count for today
 */
export function getCommitsCountToday(db: Database.Database): number {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM commits WHERE timestamp >= ?
  `);

  const row = stmt.get(todayStart.toISOString()) as any;
  return row.count;
}

/**
 * Convert database row to Commit object
 */
function rowToCommit(row: any): Commit {
  return {
    id: row.id,
    streamId: row.stream_id,
    commitHash: row.commit_hash,
    message: row.message,
    author: row.author,
    filesChanged: row.files_changed,
    timestamp: row.timestamp,
  };
}
