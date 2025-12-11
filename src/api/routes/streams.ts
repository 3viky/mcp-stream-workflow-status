/**
 * Streams API routes
 */

import { Router, type Router as RouterType } from 'express';
import { getDatabase } from '../../database/client.js';
import { getAllStreams, getStream } from '../../database/queries/streams.js';

export const streamsRouter: RouterType = Router();

/**
 * GET /api/streams - List all streams with optional filters
 *
 * Query parameters:
 * - status: Filter by stream status (initializing, active, blocked, paused, completed, archived)
 * - category: Filter by stream category (frontend, backend, infrastructure, testing, documentation, refactoring)
 * - priority: Filter by priority (critical, high, medium, low)
 */
streamsRouter.get('/', (req, res) => {
  try {
    const { status, category, priority } = req.query;

    const db = getDatabase();
    const streams = getAllStreams(db, {
      status: status as string,
      category: category as string,
    });

    // Filter by priority if provided (client-side filter since DB query doesn't support it yet)
    const filtered = priority
      ? streams.filter(s => s.priority === priority)
      : streams;

    res.json({
      streams: filtered,
      total: filtered.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch streams', details: errorMessage });
  }
});

/**
 * GET /api/streams/:id - Get single stream by ID
 *
 * Path parameters:
 * - id: Stream identifier
 */
streamsRouter.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const stream = getStream(db, req.params.id);

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    res.json(stream);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch stream', details: errorMessage });
  }
});
