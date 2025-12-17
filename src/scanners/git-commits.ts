/**
 * Git Commit Scanner
 *
 * Scans worktree git logs and populates commits table with recent activity.
 * Provides comprehensive git history tracking for stream activity visualization.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { getDatabase } from '../database/client.js';
import { addCommit as insertCommit } from '../database/queries/commits.js';
import { getAllStreams } from '../database/queries/streams.js';
import type { Stream, Commit } from '../types.js';

/**
 * Parse git log output into commit objects
 */
function parseGitLog(streamId: string, streamNumber: string, logOutput: string): Commit[] {
  const commits: Commit[] = [];
  const lines = logOutput.trim().split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

    // Format: hash|author|timestamp|message|filesChanged
    const parts = line.split('|');
    if (parts.length !== 5) continue;

    const [hash, author, timestamp, message, filesChangedStr] = parts;
    const filesChanged = parseInt(filesChangedStr, 10);

    if (hash && author && timestamp && message) {
      commits.push({
        streamId,
        commitHash: hash.trim(),
        message: message.trim(),
        author: author.trim(),
        filesChanged: isNaN(filesChanged) ? 0 : filesChanged,
        timestamp: new Date(timestamp.trim()).toISOString(),
      });
    }
  }

  return commits;
}

/**
 * Get git commits from a worktree
 */
function getWorktreeCommits(stream: Stream): Commit[] {
  try {
    // Verify worktree exists
    if (!existsSync(stream.worktreePath)) {
      return [];
    }

    // Get commits unique to this branch (not in main)
    // Use main..HEAD to only get commits that diverge from main
    // Limit to 50 commits max
    const gitLogCommand = `git log main..HEAD --pretty=format:"%H|%an|%aI|%s|" --numstat -n 50`;

    const output = execSync(gitLogCommand, {
      cwd: stream.worktreePath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
    });

    // Parse output to count files changed per commit
    const commits: Commit[] = [];
    const lines = output.trim().split('\n');
    let currentCommit: any = null;
    let filesChanged = 0;

    for (const line of lines) {
      // Commit lines contain pipe delimiters
      if (line.includes('|')) {
        // Save previous commit before starting new one
        if (currentCommit) {
          currentCommit.filesChanged = filesChanged;
          commits.push(currentCommit);
        }

        // Parse commit line: hash|author|timestamp|message|
        const parts = line.split('|');
        if (parts.length >= 4) {
          currentCommit = {
            streamId: stream.id,
            commitHash: parts[0].trim(),
            author: parts[1].trim(),
            timestamp: new Date(parts[2].trim()).toISOString(),
            message: parts[3].trim(),
            filesChanged: 0,
          };
          filesChanged = 0;
        }
      } else if (line.match(/^\d+\s+\d+\s+/) || line.match(/^-\s+-\s+/)) {
        // File change line (numstat format: additions deletions filename)
        // Also handles binary files (shown as "- -")
        filesChanged++;
      }
    }

    // Save last commit
    if (currentCommit) {
      currentCommit.filesChanged = filesChanged;
      commits.push(currentCommit);
    }

    return commits;
  } catch (error) {
    // Worktree might not have commits yet, or git might not be initialized
    return [];
  }
}

/**
 * Get recent commits from main branch
 */
function getMainBranchCommits(): Commit[] {
  try {
    // Get recent commits directly on main (last 20 or 7 days)
    const gitLogCommand = `git log main --pretty=format:"%H|%an|%aI|%s|" --numstat --since="7 days ago" -n 20`;

    const output = execSync(gitLogCommand, {
      cwd: config.PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const commits: Commit[] = [];
    const lines = output.trim().split('\n');
    let currentCommit: any = null;
    let filesChanged = 0;

    for (const line of lines) {
      if (line.includes('|')) {
        if (currentCommit) {
          currentCommit.filesChanged = filesChanged;
          commits.push(currentCommit);
        }

        const parts = line.split('|');
        if (parts.length >= 4) {
          currentCommit = {
            streamId: 'main',
            commitHash: parts[0].trim(),
            author: parts[1].trim(),
            timestamp: new Date(parts[2].trim()).toISOString(),
            message: parts[3].trim(),
            filesChanged: 0,
          };
          filesChanged = 0;
        }
      } else if (line.match(/^\d+\s+\d+\s+/) || line.match(/^-\s+-\s+/)) {
        filesChanged++;
      }
    }

    if (currentCommit) {
      currentCommit.filesChanged = filesChanged;
      commits.push(currentCommit);
    }

    return commits;
  } catch (error) {
    console.error('Failed to get main branch commits:', error);
    return [];
  }
}

/**
 * Scan all worktrees and populate commits table
 */
export async function scanAllWorktreeCommits(): Promise<{
  scanned: number;
  commitsAdded: number;
  errors: number;
}> {
  const db = getDatabase();
  const streams = getAllStreams(db);

  let scanned = 0;
  let commitsAdded = 0;
  let errors = 0;

  // First, ensure "main" exists as a special stream (for FK constraint)
  try {
    const mainExists = db.prepare('SELECT id FROM streams WHERE id = ?').get('main');
    if (!mainExists) {
      db.prepare(`
        INSERT INTO streams (id, stream_number, title, category, priority, status, progress, worktree_path, branch, created_at, updated_at)
        VALUES ('main', 'main', 'Main Branch', 'infrastructure', 'high', 'active', 100, ?, 'main', ?, ?)
      `).run(config.PROJECT_ROOT, new Date().toISOString(), new Date().toISOString());
    }
  } catch (error) {
    console.error('Failed to create main stream entry:', error);
  }

  // Scan main branch commits
  try {
    const mainCommits = getMainBranchCommits();
    for (const commit of mainCommits) {
      try {
        insertCommit(db, commit);
        commitsAdded++;
      } catch (error) {
        if (error instanceof Error && !error.message.includes('UNIQUE')) {
          errors++;
        }
      }
    }
  } catch (error) {
    console.error('Failed to scan main branch:', error);
  }

  // Then scan all stream worktrees
  for (const stream of streams) {
    try {
      scanned++;
      const commits = getWorktreeCommits(stream);

      for (const commit of commits) {
        try {
          insertCommit(db, commit);
          commitsAdded++;
        } catch (error) {
          // Commit might already exist (UNIQUE constraint on hash)
          if (error instanceof Error && !error.message.includes('UNIQUE')) {
            errors++;
            console.error(`Failed to insert commit ${commit.commitHash}:`, error);
          }
        }
      }
    } catch (error) {
      errors++;
      console.error(`Failed to scan commits for stream ${stream.id}:`, error);
    }
  }

  return { scanned, commitsAdded, errors };
}

/**
 * Scan commits for a specific stream
 */
export async function scanStreamCommits(streamId: string): Promise<number> {
  const db = getDatabase();
  const streams = getAllStreams(db);
  const stream = streams.find(s => s.id === streamId);

  if (!stream) {
    throw new Error(`Stream not found: ${streamId}`);
  }

  const commits = getWorktreeCommits(stream);
  let added = 0;

  for (const commit of commits) {
    try {
      insertCommit(db, commit);
      added++;
    } catch (error) {
      // Skip duplicates
      if (error instanceof Error && !error.message.includes('UNIQUE')) {
        throw error;
      }
    }
  }

  return added;
}

/**
 * MCP tool handler for scanning commits
 */
export async function scanCommitsTool(args?: any): Promise<any> {
  const streamId = args?.streamId;

  if (streamId) {
    // Scan specific stream
    const added = await scanStreamCommits(streamId);
    return {
      content: [
        {
          type: 'text',
          text: `✅ Scanned commits for stream ${streamId}\n\nCommits added: ${added}`,
        },
      ],
    };
  } else {
    // Scan all streams
    const result = await scanAllWorktreeCommits();
    return {
      content: [
        {
          type: 'text',
          text: `✅ Commit scan complete\n\n` +
                `Streams scanned: ${result.scanned}\n` +
                `Commits added: ${result.commitsAdded}\n` +
                `Errors: ${result.errors}`,
        },
      ],
    };
  }
}
