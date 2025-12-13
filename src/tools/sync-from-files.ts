/**
 * Sync streams from .project/plan/streams/ markdown files into database
 *
 * This tool scans the project's stream directory and populates
 * the database with all active streams, parsing metadata from
 * markdown frontmatter and directory structure.
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, basename } from 'path';
import { config } from '../config.js';
import { getDatabase } from '../database/client.js';
import { insertStream, updateStream, getAllStreams } from '../database/queries/streams.js';
import { addHistoryEvent } from '../database/queries/history.js';
import type { StreamCategory, StreamPriority, StreamStatus, Stream } from '../types.js';

interface StreamMetadata {
  streamId: string;
  streamNumber: string;
  title: string;
  category: StreamCategory;
  priority: StreamPriority;
  status: StreamStatus;
  worktreePath: string;
  branch: string;
  estimatedPhases?: string[];
}

/**
 * Parse stream metadata from markdown file
 */
function parseStreamMarkdown(filePath: string, streamId: string): StreamMetadata | null {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // Extract frontmatter if present
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    const frontmatter: Record<string, any> = {};

    if (frontmatterMatch) {
      const lines = frontmatterMatch[1].split('\n');
      for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
        }
      }
    }

    // Extract title from first H1 heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = frontmatter.title || (titleMatch ? titleMatch[1] : streamId);

    // Extract stream number from filename or frontmatter
    const numberMatch = streamId.match(/stream-(\d+)/);
    const streamNumber = frontmatter.streamNumber || (numberMatch ? numberMatch[1] : '0000');

    // Determine worktree path
    const worktreeName = streamId;
    const worktreePath = join(config.WORKTREE_ROOT, worktreeName);

    return {
      streamId,
      streamNumber,
      title,
      category: frontmatter.category || 'backend' as StreamCategory,
      priority: frontmatter.priority || 'medium' as StreamPriority,
      status: frontmatter.status || 'active' as StreamStatus,
      worktreePath,
      branch: frontmatter.branch || streamId,
      estimatedPhases: frontmatter.phases ? frontmatter.phases.split(',').map((p: string) => p.trim()) : undefined,
    };
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error);
    return null;
  }
}

/**
 * Sync all streams from .project/plan/streams/ directory
 */
export async function syncFromFiles(): Promise<{
  synced: number;
  skipped: number;
  errors: number;
}> {
  const streamsDir = join(config.PROJECT_ROOT, '.project', 'plan', 'streams');

  let synced = 0;
  let skipped = 0;
  let errors = 0;

  try {
    const entries = readdirSync(streamsDir);

    for (const entry of entries) {
      const entryPath = join(streamsDir, entry);
      const stat = statSync(entryPath);

      // Handle both stream-XX-name.md files and stream-XX-name/ directories
      let streamId: string;
      let markdownPath: string;

      if (stat.isDirectory()) {
        streamId = entry;
        markdownPath = join(entryPath, 'README.md');

        // Skip if no README.md in directory
        try {
          statSync(markdownPath);
        } catch {
          skipped++;
          continue;
        }
      } else if (entry.endsWith('.md')) {
        streamId = basename(entry, '.md');
        markdownPath = entryPath;
      } else {
        // Skip non-markdown files
        skipped++;
        continue;
      }

      // Parse stream metadata
      const metadata = parseStreamMarkdown(markdownPath, streamId);

      if (!metadata) {
        errors++;
        continue;
      }

      // Add to database (will skip if already exists)
      try {
        const db = getDatabase();

        // Create stream object
        const stream: Stream = {
          id: metadata.streamId,
          streamNumber: metadata.streamNumber,
          title: metadata.title,
          category: metadata.category,
          priority: metadata.priority,
          status: metadata.status,
          progress: 0,
          worktreePath: metadata.worktreePath,
          branch: metadata.branch,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phases: metadata.estimatedPhases,
        };

        // Insert into database
        insertStream(db, stream);

        // Add history event
        addHistoryEvent(db, {
          streamId: stream.id,
          eventType: 'created',
          timestamp: new Date().toISOString(),
        });

        synced++;
      } catch (error) {
        // Stream might already exist, that's okay
        if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
          skipped++;
        } else {
          errors++;
          console.error(`Failed to add stream ${streamId}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to sync from files:', error);
    throw error;
  }

  return { synced, skipped, errors };
}

/**
 * MCP tool handler for sync-from-files
 */
export async function syncFromFilesTool(): Promise<any> {
  const result = await syncFromFiles();

  return {
    content: [
      {
        type: 'text',
        text: `✅ Stream sync complete\n\n` +
              `Synced: ${result.synced} streams\n` +
              `Skipped: ${result.skipped} (already in database or invalid)\n` +
              `Errors: ${result.errors}\n\n` +
              `Database: ${config.DATABASE_PATH}`,
      },
    ],
  };
}
