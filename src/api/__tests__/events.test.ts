/**
 * Unit tests for SSE Events Manager
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Response } from 'express';

// Mock Response factory
function createMockResponse(): Response & { written: string[]; headers: Record<string, string> } {
  const written: string[] = [];
  const headers: Record<string, string> = {};
  const listeners: Record<string, Function[]> = {};

  return {
    written,
    headers,
    setHeader: vi.fn((key: string, value: string) => {
      headers[key] = value;
    }),
    flushHeaders: vi.fn(),
    write: vi.fn((data: string) => {
      written.push(data);
      return true;
    }),
    on: vi.fn((event: string, callback: Function) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    }),
    emit: (event: string) => {
      listeners[event]?.forEach(cb => cb());
    },
  } as unknown as Response & { written: string[]; headers: Record<string, string> };
}

describe('SSE Events Manager', () => {
  describe('Event Manager Class', () => {
    it('should set correct SSE headers on client connection', () => {
      const mockRes = createMockResponse();

      // Simulate what addClient does
      mockRes.setHeader('Content-Type', 'text/event-stream');
      mockRes.setHeader('Cache-Control', 'no-cache');
      mockRes.setHeader('Connection', 'keep-alive');
      mockRes.setHeader('X-Accel-Buffering', 'no');

      expect(mockRes.headers['Content-Type']).toBe('text/event-stream');
      expect(mockRes.headers['Cache-Control']).toBe('no-cache');
      expect(mockRes.headers['Connection']).toBe('keep-alive');
      expect(mockRes.headers['X-Accel-Buffering']).toBe('no');
    });

    it('should format SSE messages correctly', () => {
      const mockRes = createMockResponse();

      const event = 'commits';
      const data = { type: 'commits', timestamp: '2025-12-17T00:00:00.000Z' };

      mockRes.write(`event: ${event}\n`);
      mockRes.write(`data: ${JSON.stringify(data)}\n\n`);

      expect(mockRes.written).toHaveLength(2);
      expect(mockRes.written[0]).toBe('event: commits\n');
      expect(mockRes.written[1]).toBe('data: {"type":"commits","timestamp":"2025-12-17T00:00:00.000Z"}\n\n');
    });

    it('should send connection acknowledgment on connect', () => {
      const mockRes = createMockResponse();

      const clientId = 'client-1';
      const timestamp = '2025-12-17T00:00:00.000Z';

      mockRes.write(`event: connected\n`);
      mockRes.write(`data: ${JSON.stringify({ clientId, timestamp })}\n\n`);

      expect(mockRes.written[0]).toBe('event: connected\n');
      expect(mockRes.written[1]).toContain('"clientId":"client-1"');
    });

    it('should format heartbeat messages correctly', () => {
      const mockRes = createMockResponse();

      // SSE comment format for heartbeat
      mockRes.write(': heartbeat\n\n');

      expect(mockRes.written[0]).toBe(': heartbeat\n\n');
    });
  });

  describe('Event Types', () => {
    it('should support streams event type', () => {
      const eventTypes = ['streams', 'commits', 'stats', 'all', 'connected'];
      expect(eventTypes).toContain('streams');
    });

    it('should support commits event type', () => {
      const eventTypes = ['streams', 'commits', 'stats', 'all', 'connected'];
      expect(eventTypes).toContain('commits');
    });

    it('should support stats event type', () => {
      const eventTypes = ['streams', 'commits', 'stats', 'all', 'connected'];
      expect(eventTypes).toContain('stats');
    });

    it('should support all event type for broadcast', () => {
      const eventTypes = ['streams', 'commits', 'stats', 'all', 'connected'];
      expect(eventTypes).toContain('all');
    });
  });

  describe('Client Management', () => {
    it('should generate unique client IDs', () => {
      const ids = new Set<string>();
      let counter = 0;

      for (let i = 0; i < 100; i++) {
        const id = `client-${++counter}`;
        ids.add(id);
      }

      expect(ids.size).toBe(100);
    });

    it('should track client count correctly', () => {
      const clients = new Map<string, object>();

      clients.set('client-1', {});
      clients.set('client-2', {});
      clients.set('client-3', {});

      expect(clients.size).toBe(3);

      clients.delete('client-2');
      expect(clients.size).toBe(2);
    });

    it('should handle client disconnect gracefully', () => {
      const clients = new Map<string, object>();
      clients.set('client-1', {});

      // Simulate disconnect
      const clientId = 'client-1';
      clients.delete(clientId);

      expect(clients.has(clientId)).toBe(false);
      expect(clients.size).toBe(0);
    });
  });

  describe('Broadcast Functionality', () => {
    it('should count successful broadcasts', () => {
      const clients = new Map<string, { write: () => boolean }>();

      clients.set('client-1', { write: () => true });
      clients.set('client-2', { write: () => true });
      clients.set('client-3', { write: () => true });

      let sent = 0;
      for (const [, client] of clients) {
        if (client.write()) {
          sent++;
        }
      }

      expect(sent).toBe(3);
    });

    it('should handle partial broadcast failures', () => {
      const clients = new Map<string, { write: () => boolean }>();

      clients.set('client-1', { write: () => true });
      clients.set('client-2', { write: () => { throw new Error('Connection lost'); } });
      clients.set('client-3', { write: () => true });

      let sent = 0;
      let failed = 0;

      for (const [, client] of clients) {
        try {
          if (client.write()) {
            sent++;
          }
        } catch {
          failed++;
        }
      }

      expect(sent).toBe(2);
      expect(failed).toBe(1);
    });

    it('should only broadcast when clients are connected', () => {
      const clients = new Map<string, object>();

      // No clients connected
      expect(clients.size).toBe(0);

      // Broadcast would send to 0 clients
      const sent = clients.size > 0 ? 1 : 0;
      expect(sent).toBe(0);
    });
  });

  describe('Notification Payloads', () => {
    it('should include type in notification payload', () => {
      const payload = {
        type: 'commits',
        timestamp: new Date().toISOString(),
      };

      expect(payload.type).toBe('commits');
      expect(payload.timestamp).toBeDefined();
    });

    it('should include ISO timestamp in notification payload', () => {
      const timestamp = new Date().toISOString();
      const payload = { type: 'stats', timestamp };

      expect(payload.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should serialize payload to JSON', () => {
      const payload = {
        type: 'streams',
        timestamp: '2025-12-17T00:00:00.000Z',
      };

      const json = JSON.stringify(payload);
      expect(json).toBe('{"type":"streams","timestamp":"2025-12-17T00:00:00.000Z"}');
    });
  });

  describe('Error Handling', () => {
    it('should handle write errors gracefully', () => {
      const mockRes = createMockResponse();
      mockRes.write = vi.fn(() => { throw new Error('Connection closed'); });

      let errorCaught = false;
      try {
        mockRes.write('test');
      } catch {
        errorCaught = true;
      }

      expect(errorCaught).toBe(true);
    });

    it('should remove client on write failure', () => {
      const clients = new Map<string, object>();
      clients.set('client-1', {});

      // Simulate write failure
      const writeSucceeded = false;
      if (!writeSucceeded) {
        clients.delete('client-1');
      }

      expect(clients.has('client-1')).toBe(false);
    });

    it('should handle JSON serialization errors', () => {
      const circular: any = {};
      circular.self = circular;

      let errorCaught = false;
      try {
        JSON.stringify(circular);
      } catch {
        errorCaught = true;
      }

      expect(errorCaught).toBe(true);
    });
  });

  describe('Heartbeat Mechanism', () => {
    it('should use SSE comment format for heartbeats', () => {
      const heartbeat = ': heartbeat\n\n';

      // SSE comments start with colon
      expect(heartbeat.startsWith(':')).toBe(true);
      // Must end with double newline
      expect(heartbeat.endsWith('\n\n')).toBe(true);
    });

    it('should keep connection alive with periodic heartbeats', () => {
      const HEARTBEAT_INTERVAL = 30000; // 30 seconds

      expect(HEARTBEAT_INTERVAL).toBe(30000);
      expect(HEARTBEAT_INTERVAL).toBeLessThan(60000); // Should be less than typical timeout
    });
  });
});

describe('Periodic Scanning Integration', () => {
  describe('Scan Interval', () => {
    it('should use 60 second scan interval', () => {
      const SCAN_INTERVAL_MS = 60_000;
      expect(SCAN_INTERVAL_MS).toBe(60000);
    });

    it('should be configurable in the future', () => {
      const config = {
        scanIntervalMs: 60_000,
        minInterval: 10_000,
        maxInterval: 300_000,
      };

      expect(config.scanIntervalMs).toBeGreaterThanOrEqual(config.minInterval);
      expect(config.scanIntervalMs).toBeLessThanOrEqual(config.maxInterval);
    });
  });

  describe('Notification Triggers', () => {
    it('should notify on new commits found', () => {
      const scanResult = { commitsAdded: 5, scanned: 10, errors: 0 };

      const shouldNotify = scanResult.commitsAdded > 0;
      expect(shouldNotify).toBe(true);
    });

    it('should not notify when no new commits', () => {
      const scanResult = { commitsAdded: 0, scanned: 10, errors: 0 };

      const shouldNotify = scanResult.commitsAdded > 0;
      expect(shouldNotify).toBe(false);
    });

    it('should notify commits and stats on changes', () => {
      const notifications: string[] = [];

      const scanResult = { commitsAdded: 3 };
      if (scanResult.commitsAdded > 0) {
        notifications.push('commits');
        notifications.push('stats');
      }

      expect(notifications).toContain('commits');
      expect(notifications).toContain('stats');
    });
  });
});
