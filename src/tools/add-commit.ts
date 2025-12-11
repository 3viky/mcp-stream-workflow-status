/**
 * Add commit MCP tool
 */

import { z } from 'zod';
import type { AddCommitParams, Commit } from '../types.js';
import { getDatabase } from '../database/client.js';
import { insertCommit } from '../database/queries/commits.js';
import { touchStream, getStreamById } from '../database/queries/streams.js';

/**
 * Zod schema for validating add_commit parameters
 */
const addCommitSchema = z.object({
  streamId: z.string().min(1, 'Stream ID is required'),
  commitHash: z.string().min(1, 'Commit hash is required'),
  message: z.string().min(1, 'Commit message is required'),
  author: z.string().min(1, 'Author is required'),
  filesChanged: z.number().int().nonnegative(),
  timestamp: z.string().optional(),
});

/**
 * Track a commit for a stream
 *
 * @param params - Commit parameters
 * @returns MCP tool response
 */
export async function addCommitTool(params: any) {
  try {
    // Validate parameters with zod
    const validated = addCommitSchema.parse(params) as AddCommitParams;

    const db = getDatabase();

    // Verify stream exists
    const stream = getStreamById(db, validated.streamId);
    if (!stream) {
      throw new Error(`Stream not found: ${validated.streamId}`);
    }

    // Create commit object
    const commit: Commit = {
      streamId: validated.streamId,
      commitHash: validated.commitHash,
      message: validated.message,
      author: validated.author,
      filesChanged: validated.filesChanged,
      timestamp: validated.timestamp || new Date().toISOString(),
    };

    // Insert commit
    const commitId = insertCommit(db, commit);

    // Update stream's updated_at timestamp
    touchStream(db, validated.streamId);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Commit tracked: ${commit.commitHash.substring(0, 8)}\nStream: ${stream.streamNumber} - ${stream.title}\nMessage: ${commit.message}\nFiles changed: ${commit.filesChanged}`,
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
