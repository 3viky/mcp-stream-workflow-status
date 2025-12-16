/**
 * Streams API routes
 */

import { Router, type Router as RouterType } from 'express';
import { getDatabase } from '../../database/client.js';
import { getAllStreams, getStream, updateStream, completeStream } from '../../database/queries/streams.js';
import { addHistoryEvent } from '../../database/queries/history.js';
import type { StreamStatus } from '../../types.js';

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

/**
 * PATCH /api/streams/:id - Update stream status or metadata
 *
 * Path parameters:
 * - id: Stream identifier
 *
 * Body:
 * - status: New status (initializing, active, blocked, paused, completed, archived)
 * - progress: Progress percentage (0-100)
 * - blockedBy: Stream ID blocking this stream
 */
streamsRouter.patch('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const stream = getStream(db, req.params.id);

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const { status, progress, blockedBy } = req.body;

    // Validate status if provided
    const validStatuses: StreamStatus[] = ['initializing', 'active', 'blocked', 'paused', 'completed', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Validate progress if provided
    if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
      return res.status(400).json({ error: 'Progress must be a number between 0 and 100' });
    }

    const previousStatus = stream.status;

    // Handle completion separately (sets completed_at)
    if (status === 'completed' && previousStatus !== 'completed') {
      completeStream(db, req.params.id);
    } else {
      // Update stream with provided fields
      updateStream(db, req.params.id, {
        status: status as StreamStatus,
        progress,
        blockedBy,
      });
    }

    // Record history if status changed
    if (status && status !== previousStatus) {
      addHistoryEvent(db, {
        streamId: req.params.id,
        eventType: 'status_changed',
        oldValue: previousStatus,
        newValue: status,
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch updated stream
    const updatedStream = getStream(db, req.params.id);

    res.json({
      success: true,
      stream: updatedStream,
      changes: {
        status: status !== previousStatus ? { from: previousStatus, to: status } : undefined,
        progress: progress !== undefined ? progress : undefined,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update stream', details: errorMessage });
  }
});

/**
 * POST /api/streams/:id/archive - Quick archive endpoint
 *
 * Path parameters:
 * - id: Stream identifier
 */
streamsRouter.post('/:id/archive', (req, res) => {
  try {
    const db = getDatabase();
    const stream = getStream(db, req.params.id);

    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const previousStatus = stream.status;

    if (previousStatus === 'archived') {
      return res.json({ success: true, message: 'Stream already archived', stream });
    }

    updateStream(db, req.params.id, { status: 'archived' });

    addHistoryEvent(db, {
      streamId: req.params.id,
      eventType: 'status_changed',
      oldValue: previousStatus,
      newValue: 'archived',
      timestamp: new Date().toISOString(),
    });

    const updatedStream = getStream(db, req.params.id);

    res.json({
      success: true,
      message: `Stream ${req.params.id} archived`,
      stream: updatedStream,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to archive stream', details: errorMessage });
  }
});

/**
 * POST /api/streams/archive-bulk - Archive multiple streams at once
 *
 * Body:
 * - streamIds: Array of stream IDs to archive
 */
streamsRouter.post('/archive-bulk', (req, res) => {
  try {
    const { streamIds } = req.body;

    if (!Array.isArray(streamIds) || streamIds.length === 0) {
      return res.status(400).json({ error: 'streamIds must be a non-empty array' });
    }

    const db = getDatabase();
    const results: { streamId: string; success: boolean; error?: string }[] = [];

    for (const streamId of streamIds) {
      try {
        const stream = getStream(db, streamId);

        if (!stream) {
          results.push({ streamId, success: false, error: 'Not found' });
          continue;
        }

        if (stream.status === 'archived') {
          results.push({ streamId, success: true, error: 'Already archived' });
          continue;
        }

        updateStream(db, streamId, { status: 'archived' });

        addHistoryEvent(db, {
          streamId,
          eventType: 'status_changed',
          oldValue: stream.status,
          newValue: 'archived',
          timestamp: new Date().toISOString(),
        });

        results.push({ streamId, success: true });
      } catch (error) {
        results.push({
          streamId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: failCount === 0,
      message: `Archived ${successCount} streams, ${failCount} failed`,
      results,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to archive streams', details: errorMessage });
  }
});
