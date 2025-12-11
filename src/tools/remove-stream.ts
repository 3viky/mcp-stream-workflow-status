/**
 * Remove stream MCP tool
 */

import { z } from 'zod';
import type { RemoveStreamParams } from '../types.js';
import { getDatabase } from '../database/client.js';
import { completeStream, getStreamById } from '../database/queries/streams.js';
import { addHistoryEvent } from '../database/queries/history.js';

/**
 * Zod schema for validating remove_stream parameters
 */
const removeStreamSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  completionSummary: z.string().optional(),
});

/**
 * Archive a completed stream
 *
 * @param params - Remove parameters
 * @returns MCP tool response
 */
export async function removeStreamTool(params: any) {
  try {
    // Validate parameters with zod
    const validated = removeStreamSchema.parse(params) as RemoveStreamParams;

    const db = getDatabase();

    // Get stream info before archiving
    const stream = getStreamById(db, validated.streamId);
    if (!stream) {
      throw new Error(`Stream not found: ${validated.streamId}`);
    }

    // Mark stream as completed
    completeStream(db, validated.streamId);

    // Add completion history event
    addHistoryEvent(db, {
      streamId: validated.streamId,
      eventType: 'completed',
      newValue: validated.completionSummary,
      timestamp: new Date().toISOString(),
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Stream archived: ${stream.streamNumber} - ${stream.title}\nStatus: completed${validated.completionSummary ? `\nSummary: ${validated.completionSummary}` : ''}`,
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
