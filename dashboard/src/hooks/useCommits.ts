/**
 * Custom hook for fetching and managing commit data
 */

import { useState, useEffect } from 'react';
import type { Commit } from '../types';

// Dynamically detect API port from current window location
const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
  : 'http://localhost:3001/api';

interface UseCommitsResult {
  commits: Commit[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCommits(limit?: number): UseCommitsResult {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommits = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = limit ? `${API_BASE}/commits?limit=${limit}` : `${API_BASE}/commits`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCommits(data.commits || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch commits');
      console.error('Error fetching commits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();

    // Poll for updates every 15 seconds (commits change more frequently)
    const interval = setInterval(fetchCommits, 15000);

    return () => clearInterval(interval);
  }, [limit]);

  return { commits, loading, error, refetch: fetchCommits };
}
