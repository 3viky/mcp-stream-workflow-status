/**
 * Reconciliation API routes
 *
 * Provides endpoints for worktree/database reconciliation
 */

import { Router, type Router as RouterType } from 'express';
import {
  reconcileWorktrees,
  getWorktreeList,
  getMergedBranches,
  type ReconciliationResult,
} from '../../scanners/worktree-reconciliation.js';

export const reconciliationRouter: RouterType = Router();

/**
 * GET /api/reconciliation/status - Get reconciliation status (dry run)
 *
 * Returns current state comparison between database and git worktrees
 * without making any changes.
 */
reconciliationRouter.get('/status', async (req, res) => {
  try {
    const result = await reconcileWorktrees({ dryRun: true });

    res.json({
      timestamp: new Date().toISOString(),
      dryRun: true,
      ...result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to get reconciliation status', details: errorMessage });
  }
});

/**
 * POST /api/reconciliation/run - Execute reconciliation
 *
 * Body:
 * - dryRun: If true, only report differences (default: true)
 * - autoArchiveStale: If true, automatically archive stale streams (default: false)
 */
reconciliationRouter.post('/run', async (req, res) => {
  try {
    const { dryRun = true, autoArchiveStale = false } = req.body;

    const result = await reconcileWorktrees({
      dryRun,
      autoArchiveStale,
      autoAddOrphaned: false, // Never auto-add
    });

    res.json({
      timestamp: new Date().toISOString(),
      dryRun,
      autoArchiveStale,
      ...result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to run reconciliation', details: errorMessage });
  }
});

/**
 * GET /api/reconciliation/worktrees - Get raw worktree list
 *
 * Returns the current git worktree list without database comparison
 */
reconciliationRouter.get('/worktrees', (req, res) => {
  try {
    const worktrees = getWorktreeList();
    const worktreeArray = Array.from(worktrees.entries()).map(([id, info]) => ({
      id,
      ...info,
    }));

    res.json({
      timestamp: new Date().toISOString(),
      total: worktreeArray.length,
      worktrees: worktreeArray,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to get worktree list', details: errorMessage });
  }
});

/**
 * GET /api/reconciliation/merged - Get merged branches
 *
 * Returns branches that have been merged to main
 */
reconciliationRouter.get('/merged', (req, res) => {
  try {
    const merged = getMergedBranches();
    const mergedArray = Array.from(merged);

    res.json({
      timestamp: new Date().toISOString(),
      total: mergedArray.length,
      branches: mergedArray,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to get merged branches', details: errorMessage });
  }
});
