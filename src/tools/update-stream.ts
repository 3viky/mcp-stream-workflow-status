/**
 * Update stream MCP tool
 */

import { z } from 'zod';
import type { UpdateStreamParams } from '../types.js';
import { getDatabase } from '../database/client.js';
import { updateStream, getStreamById } from '../database/queries/streams.js';
import { addHistoryEvent } from '../database/queries/history.js';

/**
 * Zod schema for validating update_stream parameters
 */
const updateStreamSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  status: z.enum(['initializing', 'active', 'blocked', 'paused', 'completed', 'archived']).optional(),
  progress: z.number().min(0).max(100).optional(),
  currentPhase: z.number().int().nonnegative().optional(),
  blockedBy: z.string().optional(),
});

/**
 * Update an existing stream
 *
 * @param params - Update parameters
 * @returns MCP tool response
 */
export async function updateStreamTool(params: any) {
  try {
    // Validate parameters with zod
    const validated = updateStreamSchema.parse(params) as UpdateStreamParams;

    const db = getDatabase();

    // Get current stream state for history
    const currentStream = getStreamById(db, validated.streamId);
    if (!currentStream) {
      throw new Error(`Stream not found: ${validated.streamId}`);
    }

    // Track what changed for history
    const changes: string[] = [];

    if (validated.status !== undefined && validated.status !== currentStream.status) {
      addHistoryEvent(db, {
        streamId: validated.streamId,
        eventType: 'status_changed',
        oldValue: currentStream.status,
        newValue: validated.status,
        timestamp: new Date().toISOString(),
      });
      changes.push(`status: ${currentStream.status} → ${validated.status}`);
    }

    if (validated.progress !== undefined && validated.progress !== currentStream.progress) {
      addHistoryEvent(db, {
        streamId: validated.streamId,
        eventType: 'progress_updated',
        oldValue: String(currentStream.progress),
        newValue: String(validated.progress),
        timestamp: new Date().toISOString(),
      });
      changes.push(`progress: ${currentStream.progress}% → ${validated.progress}%`);
    }

    // Update stream
    updateStream(db, validated.streamId, {
      status: validated.status,
      progress: validated.progress,
      currentPhase: validated.currentPhase,
      blockedBy: validated.blockedBy,
    });

    const changesText = changes.length > 0 ? `\n\nChanges:\n${changes.join('\n')}` : '';

    return {
      content: [
        {
          type: 'text',
          text: `✅ Stream updated: ${currentStream.streamNumber} - ${currentStream.title}${changesText}`,
        },
      ],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Validation failed:\n${errors}`);
    }
    throw error;
  }
}
