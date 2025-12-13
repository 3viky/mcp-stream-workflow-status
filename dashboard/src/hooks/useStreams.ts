/**
 * Custom hook for fetching and managing stream data
 */

import { useState, useEffect } from 'react';
import type { Stream } from '../types';

// Dynamically detect API port from current window location
const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
  : 'http://localhost:3001/api';

interface UseStreamsResult {
  streams: Stream[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStreams(): UseStreamsResult {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/streams`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStreams(data.streams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch streams');
      console.error('Error fetching streams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStreams, 30000);

    return () => clearInterval(interval);
  }, []);

  return { streams, loading, error, refetch: fetchStreams };
}
