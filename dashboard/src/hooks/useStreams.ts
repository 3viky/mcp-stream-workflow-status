/**
 * Custom hook for fetching and managing stream data
 */

import { useState, useEffect, useCallback } from 'react';
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
  archiveStream: (streamId: string) => Promise<boolean>;
  archiveStreams: (streamIds: string[]) => Promise<{ success: boolean; results: any[] }>;
  updateStreamStatus: (streamId: string, status: string) => Promise<boolean>;
}

export function useStreams(): UseStreamsResult {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
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
  }, []);

  const archiveStream = useCallback(async (streamId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/streams/${encodeURIComponent(streamId)}/archive`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Update local state
      setStreams(prev => prev.map(s =>
        s.id === streamId ? { ...s, status: 'archived' as Stream['status'] } : s
      ));

      return true;
    } catch (err) {
      console.error('Error archiving stream:', err);
      return false;
    }
  }, []);

  const archiveStreams = useCallback(async (streamIds: string[]): Promise<{ success: boolean; results: any[] }> => {
    try {
      const response = await fetch(`${API_BASE}/streams/archive-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Update local state for successfully archived streams
      const archivedIds = new Set(
        data.results
          .filter((r: any) => r.success)
          .map((r: any) => r.streamId)
      );

      setStreams(prev => prev.map(s =>
        archivedIds.has(s.id) ? { ...s, status: 'archived' as Stream['status'] } : s
      ));

      return data;
    } catch (err) {
      console.error('Error archiving streams:', err);
      return { success: false, results: [] };
    }
  }, []);

  const updateStreamStatus = useCallback(async (streamId: string, status: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/streams/${encodeURIComponent(streamId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Update local state
      setStreams(prev => prev.map(s =>
        s.id === streamId ? { ...s, status: status as Stream['status'] } : s
      ));

      return true;
    } catch (err) {
      console.error('Error updating stream status:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchStreams();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStreams, 30000);

    return () => clearInterval(interval);
  }, [fetchStreams]);

  return {
    streams,
    loading,
    error,
    refetch: fetchStreams,
    archiveStream,
    archiveStreams,
    updateStreamStatus,
  };
}
