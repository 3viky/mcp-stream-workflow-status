/**
 * Statistics and analytics queries
 */
import type Database from 'better-sqlite3';
import type { QuickStats } from '../../types.js';
import { DatabaseError } from '../errors.js';

/**
 * Get quick statistics dashboard
 *
 * @param db - Database instance
 * @returns QuickStats object
 */
export function getQuickStats(db: Database.Database): QuickStats {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // Get total active streams (not completed or archived)
    const totalStreamsStmt = db.prepare(`
      SELECT COUNT(*) as count FROM streams
      WHERE status NOT IN ('completed', 'archived')
    `);
    const activeStreams = (totalStreamsStmt.get() as any).count;

    // Get working streams (currently being worked on)
    const inProgress = getStreamsCountByStatus(db, 'active');

    // Get blocked streams count
    const blocked = getStreamsCountByStatus(db, 'blocked');

    // Get paused streams
    const readyToStart = getStreamsCountByStatus(db, 'paused');

    // Get completed today
    const completedToday = getCompletedToday(db);

    // Get total commits
    const totalCommitsStmt = db.prepare('SELECT COUNT(*) as count FROM commits');
    const totalCommits = (totalCommitsStmt.get() as any).count;

    // Get commits today
    const commitsToday = getCommitsToday(db);

    return {
      activeStreams,
      inProgress,
      blocked,
      readyToStart,
      completedToday,
      totalCommits,
      commitsToday
    };
  } catch (error) {
    throw new DatabaseError(
      'Failed to get quick stats',
      'getQuickStats',
      error
    );
  }
}

/**
 * Get count of streams by status
 *
 * @param db - Database instance
 * @param status - Status to filter by
 * @returns Count of streams with given status
 */
export function getStreamsCountByStatus(
  db: Database.Database,
  status: string
): number {
  try {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM streams WHERE status = ?
    `);

    const result = stmt.get(status) as any;
    return result.count;
  } catch (error) {
    throw new DatabaseError(
      `Failed to get streams count by status ${status}`,
      'getStreamsCountByStatus',
      error
    );
  }
}

/**
 * Get count of commits made today
 *
 * @param db - Database instance
 * @returns Count of commits today
 */
export function getCommitsToday(db: Database.Database): number {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM commits
      WHERE timestamp >= ?
    `);

    const result = stmt.get(todayStart) as any;
    return result.count;
  } catch (error) {
    throw new DatabaseError(
      'Failed to get commits today',
      'getCommitsToday',
      error
    );
  }
}

/**
 * Get count of streams completed today
 *
 * @param db - Database instance
 * @returns Count of streams completed today
 */
export function getCompletedToday(db: Database.Database): number {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM streams
      WHERE completed_at >= ?
    `);

    const result = stmt.get(todayStart) as any;
    return result.count;
  } catch (error) {
    throw new DatabaseError(
      'Failed to get completed streams today',
      'getCompletedToday',
      error
    );
  }
}
