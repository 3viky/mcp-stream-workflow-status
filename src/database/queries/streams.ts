/**
 * Database queries for streams table
 */

import type Database from 'better-sqlite3';
import type { Stream, StreamStatus } from '../../types.js';

/**
 * Insert a new stream
 */
export function insertStream(db: Database.Database, stream: Stream): void {
  const stmt = db.prepare(`
    INSERT INTO streams (
      id, stream_number, title, category, priority, status, progress,
      current_phase, worktree_path, branch, blocked_by, created_at,
      updated_at, completed_at, phases
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    stream.id,
    stream.streamNumber,
    stream.title,
    stream.category,
    stream.priority,
    stream.status,
    stream.progress,
    stream.currentPhase ?? null,
    stream.worktreePath,
    stream.branch,
    stream.blockedBy ?? null,
    stream.createdAt,
    stream.updatedAt,
    stream.completedAt ?? null,
    stream.phases ? JSON.stringify(stream.phases) : null
  );
}

/**
 * Update stream fields
 */
export function updateStream(
  db: Database.Database,
  streamId: string,
  updates: {
    status?: StreamStatus;
    progress?: number;
    currentPhase?: number;
    blockedBy?: string;
  }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.status !== undefined) {
    fields.push('status = ?');
    values.push(updates.status);
  }
  if (updates.progress !== undefined) {
    fields.push('progress = ?');
    values.push(updates.progress);
  }
  if (updates.currentPhase !== undefined) {
    fields.push('current_phase = ?');
    values.push(updates.currentPhase);
  }
  if (updates.blockedBy !== undefined) {
    fields.push('blocked_by = ?');
    values.push(updates.blockedBy || null);
  }

  if (fields.length === 0) {
    return; // Nothing to update
  }

  // Always update updated_at
  fields.push('updated_at = ?');
  values.push(new Date().toISOString());

  values.push(streamId);

  const stmt = db.prepare(`
    UPDATE streams
    SET ${fields.join(', ')}
    WHERE id = ?
  `);

  stmt.run(...values);
}

/**
 * Get stream by ID
 */
export function getStreamById(db: Database.Database, streamId: string): Stream | undefined {
  const stmt = db.prepare(`
    SELECT * FROM streams WHERE id = ?
  `);

  const row = stmt.get(streamId) as any;
  if (!row) {
    return undefined;
  }

  return rowToStream(row);
}

/**
 * Get all streams with optional filters
 */
export function getAllStreams(
  db: Database.Database,
  filters?: {
    status?: string;
    category?: string;
  }
): Stream[] {
  let query = `SELECT * FROM streams WHERE 1=1`;
  const params: any[] = [];

  if (filters?.status) {
    query += ` AND status = ?`;
    params.push(filters.status);
  }

  if (filters?.category) {
    query += ` AND category = ?`;
    params.push(filters.category);
  }

  query += ` ORDER BY updated_at DESC`;

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];
  return rows.map(rowToStream);
}

/**
 * Get stream by ID (alias for getStreamById)
 */
export function getStream(db: Database.Database, streamId: string): Stream | undefined {
  return getStreamById(db, streamId);
}

/**
 * Get streams by status
 */
export function getStreamsByStatus(db: Database.Database, status: StreamStatus): Stream[] {
  const stmt = db.prepare(`
    SELECT * FROM streams WHERE status = ? ORDER BY updated_at DESC
  `);

  const rows = stmt.all(status) as any[];
  return rows.map(rowToStream);
}

/**
 * Mark stream as completed
 */
export function completeStream(db: Database.Database, streamId: string): void {
  const stmt = db.prepare(`
    UPDATE streams
    SET status = 'completed',
        completed_at = ?,
        updated_at = ?
    WHERE id = ?
  `);

  const now = new Date().toISOString();
  stmt.run(now, now, streamId);
}

/**
 * Update stream's updated_at timestamp
 */
export function touchStream(db: Database.Database, streamId: string): void {
  const stmt = db.prepare(`
    UPDATE streams SET updated_at = ? WHERE id = ?
  `);

  stmt.run(new Date().toISOString(), streamId);
}

/**
 * Convert database row to Stream object
 */
function rowToStream(row: any): Stream {
  return {
    id: row.id,
    streamNumber: row.stream_number,
    title: row.title,
    category: row.category,
    priority: row.priority,
    status: row.status,
    progress: row.progress,
    currentPhase: row.current_phase ?? undefined,
    worktreePath: row.worktree_path,
    branch: row.branch,
    blockedBy: row.blocked_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at ?? undefined,
    phases: row.phases ? JSON.parse(row.phases) : undefined,
  };
}
