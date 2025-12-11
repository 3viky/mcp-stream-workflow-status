/**
 * Add stream MCP tool
 */

import { z } from 'zod';
import type { AddStreamParams, Stream } from '../types.js';
import { getDatabase } from '../database/client.js';
import { insertStream } from '../database/queries/streams.js';
import { addHistoryEvent } from '../database/queries/history.js';

/**
 * Zod schema for validating add_stream parameters
 */
const addStreamSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  streamNumber: z.string().min(1, 'Stream number is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['frontend', 'backend', 'infrastructure', 'testing', 'documentation', 'refactoring']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  worktreePath: z.string().min(1, 'Worktree path is required'),
  branch: z.string().min(1, 'Branch is required'),
  estimatedPhases: z.array(z.string()).optional(),
});

/**
 * Add a new stream to the database
 *
 * @param params - Stream parameters
 * @returns MCP tool response
 */
export async function addStreamTool(params: any) {
  try {
    // Validate parameters with zod
    const validated = addStreamSchema.parse(params) as AddStreamParams;

    // Create stream object
    const stream: Stream = {
      id: validated.streamId,
      streamNumber: validated.streamNumber,
      title: validated.title,
      category: validated.category,
      priority: validated.priority,
      status: 'initializing',
      progress: 0,
      worktreePath: validated.worktreePath,
      branch: validated.branch,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phases: validated.estimatedPhases,
    };

    // Insert into database
    const db = getDatabase();
    insertStream(db, stream);

    // Add history event
    addHistoryEvent(db, {
      streamId: stream.id,
      eventType: 'created',
      timestamp: new Date().toISOString(),
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Stream added: ${stream.streamNumber} - ${stream.title}\nStatus: ${stream.status}\nPriority: ${stream.priority}`,
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
