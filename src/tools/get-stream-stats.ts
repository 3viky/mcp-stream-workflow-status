/**
 * Get stream stats MCP tool
 */

import type { QuickStats } from '../types.js';
import { getDatabase } from '../database/client.js';
import { getQuickStats } from '../database/queries/stats.js';

/**
 * Get quick dashboard statistics
 *
 * @returns MCP tool response with QuickStats
 */
export async function getStreamStatsTool() {
  try {
    const db = getDatabase();
    const stats: QuickStats = getQuickStats(db);

    // Format stats for display
    const statsText = `
📊 Stream Workflow Dashboard

Active Streams: ${stats.activeStreams}
In Progress: ${stats.inProgress}
Blocked: ${stats.blocked}
Ready to Start: ${stats.readyToStart}

✅ Completed Today: ${stats.completedToday}

💾 Total Commits: ${stats.totalCommits}
📝 Commits Today: ${stats.commitsToday}
`.trim();

    return {
      content: [
        {
          type: 'text',
          text: statsText,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to get stream stats: ${error instanceof Error ? error.message : String(error)}`);
  }
}
