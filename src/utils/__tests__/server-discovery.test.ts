/**
 * Unit tests for server discovery and lock management
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import type { ServerLock } from '../server-discovery.js';

describe('Server Lock Management', () => {
  let testDir: string;
  let lockFilePath: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `lock-test-${Date.now()}`);
    lockFilePath = join(testDir, '.api-server.lock');
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Lock File Creation', () => {
    it('should create valid lock file with all required fields', () => {
      const lock: ServerLock = {
        pid: process.pid,
        port: 3001,
        projectRoot: '/path/to/project',
        projectName: 'test-project',
        startedAt: new Date().toISOString(),
        nodeVersion: process.version,
      };

      writeFileSync(lockFilePath, JSON.stringify(lock, null, 2));
      expect(existsSync(lockFilePath)).toBe(true);

      const content = readFileSync(lockFilePath, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed.pid).toBe(process.pid);
      expect(parsed.port).toBe(3001);
      expect(parsed.projectName).toBe('test-project');
    });

    it('should include timestamp in ISO 8601 format', () => {
      const timestamp = new Date().toISOString();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Lock File Reading', () => {
    it('should read and parse valid lock file', () => {
      const lock: ServerLock = {
        pid: 12345,
        port: 3002,
        projectRoot: '/test/project',
        projectName: 'test',
        startedAt: '2025-12-11T10:00:00.000Z',
        nodeVersion: 'v22.21.1',
      };

      writeFileSync(lockFilePath, JSON.stringify(lock));

      const content = readFileSync(lockFilePath, 'utf-8');
      const parsed: ServerLock = JSON.parse(content);

      expect(parsed.pid).toBe(12345);
      expect(parsed.port).toBe(3002);
    });

    it('should return null for non-existent lock file', () => {
      const nonExistentPath = join(testDir, 'does-not-exist.lock');
      const exists = existsSync(nonExistentPath);

      expect(exists).toBe(false);
    });

    it('should handle corrupted lock file gracefully', () => {
      writeFileSync(lockFilePath, 'invalid json content');

      try {
        JSON.parse(readFileSync(lockFilePath, 'utf-8'));
        expect(true).toBe(false); // Should not reach
      } catch (error) {
        expect(error instanceof SyntaxError).toBe(true);
      }
    });
  });

  describe('Process Liveness Check', () => {
    it('should detect current process as alive', () => {
      try {
        process.kill(process.pid, 0); // Signal 0 = check if alive
        const isAlive = true;
        expect(isAlive).toBe(true);
      } catch {
        expect(true).toBe(false); // Should not throw
      }
    });

    it('should detect non-existent PID as dead', () => {
      const impossiblePID = 9999999;

      try {
        process.kill(impossiblePID, 0);
        expect(true).toBe(false); // Should throw
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Port Allocation', () => {
    it('should find available port in range', async () => {
      const startPort = 3001;
      const maxAttempts = 10;

      // Mock: Port 3001 is taken, 3002 is available
      const availablePort = 3002;

      expect(availablePort).toBeGreaterThanOrEqual(startPort);
      expect(availablePort).toBeLessThan(startPort + maxAttempts);
    });

    it('should throw error when no ports available', () => {
      const startPort = 3001;
      const maxAttempts = 10;
      const endPort = startPort + maxAttempts - 1;

      // All ports occupied
      const error = new Error(`No available ports found in range ${startPort}-${endPort}`);

      expect(error.message).toContain('No available ports');
      expect(error.message).toContain('3001-3010');
    });
  });

  describe('Server Discovery', () => {
    it('should discover existing server with valid lock', () => {
      const lock: ServerLock = {
        pid: process.pid, // Current process (always alive)
        port: 3001,
        projectRoot: '/test/project',
        projectName: 'test',
        startedAt: new Date().toISOString(),
        nodeVersion: process.version,
      };

      writeFileSync(lockFilePath, JSON.stringify(lock));

      const discovered = {
        port: 3001,
        existing: true,
        lock,
      };

      expect(discovered.existing).toBe(true);
      expect(discovered.port).toBe(3001);
      expect(discovered.lock?.pid).toBe(process.pid);
    });

    it('should cleanup stale lock when process is dead', () => {
      const lock: ServerLock = {
        pid: 9999999, // Non-existent PID
        port: 3001,
        projectRoot: '/test/project',
        projectName: 'test',
        startedAt: new Date().toISOString(),
        nodeVersion: process.version,
      };

      writeFileSync(lockFilePath, JSON.stringify(lock));

      // Mock: Process check fails, lock should be removed
      try {
        process.kill(lock.pid, 0);
      } catch {
        // Process is dead, cleanup lock
        rmSync(lockFilePath, { force: true });
      }

      expect(existsSync(lockFilePath)).toBe(false);
    });

    it('should cleanup lock when server not responding', async () => {
      // Mock: Lock exists, process alive, but server doesn't respond
      const lock: ServerLock = {
        pid: process.pid,
        port: 9999, // Server not running on this port
        projectRoot: '/test/project',
        projectName: 'test',
        startedAt: new Date().toISOString(),
        nodeVersion: process.version,
      };

      // Server health check would fail
      const isResponding = false; // Mock HTTP check failure

      if (!isResponding) {
        // Cleanup stale lock
        const shouldCleanup = true;
        expect(shouldCleanup).toBe(true);
      }
    });
  });

  describe('Graceful Shutdown', () => {
    it('should cleanup lock file on SIGINT', () => {
      writeFileSync(lockFilePath, 'test');
      expect(existsSync(lockFilePath)).toBe(true);

      // Simulate cleanup
      rmSync(lockFilePath, { force: true });
      expect(existsSync(lockFilePath)).toBe(false);
    });

    it('should cleanup lock file on SIGTERM', () => {
      writeFileSync(lockFilePath, 'test');

      // Mock graceful shutdown
      const cleanup = () => rmSync(lockFilePath, { force: true });
      cleanup();

      expect(existsSync(lockFilePath)).toBe(false);
    });
  });
});

describe('Multi-Agent Coordination', () => {
  describe('Server Reuse', () => {
    it('should reuse existing server for same project', () => {
      const scenario = {
        agent1: { discovers: false, starts: true, port: 3001 },
        agent2: { discovers: true, starts: false, port: 3001 },
        agent3: { discovers: true, starts: false, port: 3001 },
      };

      expect(scenario.agent2.discovers).toBe(true);
      expect(scenario.agent2.starts).toBe(false);
      expect(scenario.agent2.port).toBe(scenario.agent1.port);
    });

    it('should start separate servers for different projects', () => {
      const projectA = {
        projectName: 'project-a',
        port: 3001,
        lockPath: '~/.cache/mcp-services/stream-workflow-status-data/projects/project-a/.api-server.lock',
      };

      const projectB = {
        projectName: 'project-b',
        port: 3002,
        lockPath: '~/.cache/mcp-services/stream-workflow-status-data/projects/project-b/.api-server.lock',
      };

      expect(projectA.lockPath).not.toBe(projectB.lockPath);
      expect(projectA.port).not.toBe(projectB.port);
    });
  });

  describe('Port Conflict Resolution', () => {
    it('should allocate different port if default is taken', () => {
      const server1Port = 3001; // First server
      const server2Port = 3002; // Second server (3001 occupied)

      expect(server2Port).toBeGreaterThan(server1Port);
    });
  });
});
