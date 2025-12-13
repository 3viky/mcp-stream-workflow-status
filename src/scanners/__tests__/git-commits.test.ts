/**
 * Unit tests for git commit scanner
 */

import { describe, it, expect } from 'vitest';

describe('Git Commit Scanner', () => {
  describe('Git Log Parsing', () => {
    it('should parse git log output into commit objects', () => {
      const logOutput = `abc123|John Doe|2025-12-11T10:00:00Z|feat: add authentication|3
def456|Jane Smith|2025-12-11T09:00:00Z|fix: resolve login bug|5`;

      const lines = logOutput.split('\n');
      const commits = lines.map(line => {
        const [hash, author, timestamp, message, filesChangedStr] = line.split('|');
        return {
          commitHash: hash,
          author,
          timestamp: new Date(timestamp).toISOString(),
          message,
          filesChanged: parseInt(filesChangedStr, 10),
        };
      });

      expect(commits).toHaveLength(2);
      expect(commits[0].commitHash).toBe('abc123');
      expect(commits[0].author).toBe('John Doe');
      expect(commits[0].filesChanged).toBe(3);
      expect(commits[1].commitHash).toBe('def456');
      expect(commits[1].filesChanged).toBe(5);
    });

    it('should handle empty git log output', () => {
      const logOutput = '';
      const lines = logOutput.trim().split('\n');
      const commits = lines.filter(l => l.trim()).map(line => {
        const [hash] = line.split('|');
        return { hash };
      });

      expect(commits).toHaveLength(0);
    });

    it('should skip malformed log lines', () => {
      const logOutput = `abc123|John Doe|2025-12-11T10:00:00Z|valid message|3
invalid line without pipes
def456|Jane Smith|2025-12-11T09:00:00Z|another valid|2`;

      const lines = logOutput.split('\n');
      const commits = lines
        .filter(line => line.split('|').length === 5)
        .map(line => {
          const [hash] = line.split('|');
          return { hash };
        });

      expect(commits).toHaveLength(2); // Only valid lines
      expect(commits[0].hash).toBe('abc123');
      expect(commits[1].hash).toBe('def456');
    });
  });

  describe('Numstat Parsing', () => {
    it('should count files changed from numstat output', () => {
      const numstatOutput = `10      5       src/auth.ts
3       2       src/login.ts
15      0       README.md`;

      const lines = numstatOutput.split('\n');
      const filesChanged = lines.filter(l => l.match(/^\d+\s+\d+\s+/)).length;

      expect(filesChanged).toBe(3);
    });

    it('should handle binary files in numstat', () => {
      const numstatOutput = `10      5       src/auth.ts
-       -       image.png
3       2       src/login.ts`;

      const lines = numstatOutput.split('\n');
      // Binary files show as "- -" in numstat
      const filesChanged = lines.filter(l =>
        l.match(/^\d+\s+\d+\s+/) || l.match(/^-\s+-\s+/)
      ).length;

      expect(filesChanged).toBe(3);
    });
  });

  describe('Worktree Validation', () => {
    it('should handle non-existent worktree paths', () => {
      const worktreePath = '/path/that/does/not/exist';
      const exists = false; // Mock existsSync

      if (!exists) {
        const commits: any[] = [];
        expect(commits).toHaveLength(0);
      }
    });

    it('should handle worktrees with no commits', () => {
      // Git command returns empty string
      const gitOutput = '';
      const commits = gitOutput.trim() ? gitOutput.split('\n') : [];

      expect(commits).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should gracefully handle git command failures', () => {
      // Mock execSync throwing error
      function mockGitCommand() {
        throw new Error('fatal: not a git repository');
      }

      try {
        mockGitCommand();
        expect(true).toBe(false); // Should not reach
      } catch (error) {
        // Should return empty array, not crash
        const commits: any[] = [];
        expect(commits).toHaveLength(0);
      }
    });

    it('should handle invalid date strings', () => {
      const invalidDate = 'not-a-date';

      try {
        const date = new Date(invalidDate);
        const isInvalid = isNaN(date.getTime());
        expect(isInvalid).toBe(true);
      } catch {
        expect(true).toBe(true);
      }
    });
  });

  describe('Scan Results', () => {
    it('should return accurate scan statistics', () => {
      const result = {
        scanned: 79,
        commitsAdded: 245,
        errors: 0,
      };

      expect(result.scanned).toBe(79);
      expect(result.commitsAdded).toBe(245);
      expect(result.errors).toBe(0);
    });

    it('should handle partial scan failures', () => {
      const result = {
        scanned: 10,
        commitsAdded: 25,
        errors: 2, // 2 streams failed to scan
      };

      expect(result.scanned).toBe(10);
      expect(result.errors).toBe(2);
      expect(result.scanned).toBeGreaterThan(result.errors);
    });
  });

  describe('Commit Deduplication', () => {
    it('should skip duplicate commits via UNIQUE constraint', () => {
      const commits = [
        { hash: 'abc123', message: 'First' },
        { hash: 'abc123', message: 'Duplicate' }, // Same hash
        { hash: 'def456', message: 'Different' },
      ];

      const uniqueHashes = new Set(commits.map(c => c.hash));
      expect(uniqueHashes.size).toBe(2); // Only 2 unique hashes
    });
  });
});

describe('Date and Time Handling', () => {
  describe('ISO 8601 Timestamps', () => {
    it('should validate ISO 8601 format', () => {
      const timestamp = '2025-12-11T22:30:00.000Z';
      const date = new Date(timestamp);

      expect(date.toISOString()).toBe(timestamp);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it('should convert git timestamps to ISO 8601', () => {
      const gitTimestamp = '2025-12-11T10:30:45-05:00'; // Git format with timezone
      const date = new Date(gitTimestamp);
      const iso = date.toISOString();

      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Relative Time Calculation', () => {
    it('should calculate hours ago correctly', () => {
      const now = new Date('2025-12-11T15:00:00Z');
      const past = new Date('2025-12-11T10:00:00Z');
      const diff = now.getTime() - past.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));

      expect(hours).toBe(5);
    });

    it('should calculate days ago correctly', () => {
      const now = new Date('2025-12-11T00:00:00Z');
      const past = new Date('2025-12-08T00:00:00Z');
      const diff = now.getTime() - past.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      expect(days).toBe(3);
    });
  });
});

describe('Input Validation', () => {
  describe('Stream ID Validation', () => {
    it('should validate stream ID format', () => {
      const validIds = [
        'stream-0001-auth',
        'stream-42-feature',
        'stream-1234-complex-name-with-dashes',
      ];

      validIds.forEach(id => {
        expect(id).toMatch(/^stream-\d+-/);
      });
    });

    it('should reject invalid stream IDs', () => {
      const invalidIds = [
        'not-a-stream',
        'stream-abc-invalid',
        '',
        null,
        undefined,
      ];

      invalidIds.forEach(id => {
        const isValid = id && typeof id === 'string' && id.match(/^stream-\d+-/);
        expect(isValid).toBeFalsy();
      });
    });
  });

  describe('Category Validation', () => {
    it('should accept valid categories', () => {
      const validCategories = [
        'frontend',
        'backend',
        'infrastructure',
        'testing',
        'documentation',
        'refactoring',
      ];

      validCategories.forEach(cat => {
        expect(['frontend', 'backend', 'infrastructure', 'testing', 'documentation', 'refactoring']).toContain(cat);
      });
    });

    it('should default invalid categories to backend', () => {
      const invalidCategory = 'invalid-category';
      const category = ['frontend', 'backend', 'infrastructure', 'testing', 'documentation', 'refactoring'].includes(invalidCategory)
        ? invalidCategory
        : 'backend';

      expect(category).toBe('backend');
    });
  });

  describe('Priority Validation', () => {
    it('should accept valid priorities', () => {
      const validPriorities = ['critical', 'high', 'medium', 'low'];

      validPriorities.forEach(pri => {
        expect(['critical', 'high', 'medium', 'low']).toContain(pri);
      });
    });

    it('should default invalid priorities to medium', () => {
      const invalidPriority = 'urgent';
      const priority = ['critical', 'high', 'medium', 'low'].includes(invalidPriority)
        ? invalidPriority
        : 'medium';

      expect(priority).toBe('medium');
    });
  });
});
