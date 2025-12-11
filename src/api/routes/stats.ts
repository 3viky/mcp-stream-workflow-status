/**
 * Statistics API routes
 */

import { Router, type Router as RouterType } from 'express';
import { getDatabase } from '../../database/client.js';
import { getQuickStats } from '../../database/queries/stats.js';

export const statsRouter: RouterType = Router();

/**
 * GET /api/stats - Get quick statistics
 *
 * Returns dashboard statistics including:
 * - activeStreams: Number of active streams
 * - inProgress: Number of streams in progress (active + paused)
 * - blocked: Number of blocked streams
 * - readyToStart: Number of streams ready to start (initializing)
 * - completedToday: Number of streams completed today
 * - totalCommits: Total number of commits
 * - commitsToday: Number of commits made today
 */
statsRouter.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const stats = getQuickStats(db);

    res.json(stats);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch stats', details: errorMessage });
  }
});
