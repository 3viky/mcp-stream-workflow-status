/**
 * Commits API routes
 */

import { Router, type Router as RouterType } from 'express';
import { getDatabase } from '../../database/client.js';
import { getRecentCommits, getStreamCommits } from '../../database/queries/commits.js';

export const commitsRouter: RouterType = Router();

/**
 * GET /api/commits - Get recent commits
 *
 * Query parameters:
 * - limit: Maximum number of commits to return (default: 20)
 * - streamId: Filter commits by stream ID
 */
commitsRouter.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const streamId = req.query.streamId as string;

    const db = getDatabase();
    const commits = streamId
      ? getStreamCommits(db, streamId, limit)
      : getRecentCommits(db, limit);

    res.json({
      commits,
      total: commits.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch commits', details: errorMessage });
  }
});
