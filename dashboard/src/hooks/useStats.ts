/**
 * Custom hook for fetching and managing statistics data
 */

import { useState, useEffect } from 'react';
import type { QuickStats } from '../types';

// Dynamically detect API port from current window location
const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
  : 'http://localhost:3001/api';

interface UseStatsResult {
  stats: QuickStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_STATS: QuickStats = {
  activeStreams: 0,
  inProgress: 0,
  blocked: 0,
  readyToStart: 0,
};

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<QuickStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats({
        activeStreams: data.activeStreams || 0,
        inProgress: data.inProgress || 0,
        blocked: data.blocked || 0,
        readyToStart: data.readyToStart || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Poll for updates every 20 seconds
    const interval = setInterval(fetchStats, 20000);

    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
