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
 * - activeStreams: Total number of streams (not completed/archived)
 * - inProgress: Number of streams actively being worked on (status='active')
 * - blocked: Number of blocked streams
 * - readyToStart: Number of paused streams
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
