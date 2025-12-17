# Project Status Dashboard - Technical Architecture

**Purpose**: Deep-dive technical documentation for the Project Status Dashboard implementation.

**Audience**: Engineers, developers, technical contributors

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Layer](#data-layer)
3. [UI Layer](#ui-layer)
4. [Integration Points](#integration-points)
5. [Performance Considerations](#performance-considerations)
6. [Security](#security)
7. [Deployment](#deployment)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Project Status Dashboard                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │              │  │              │  │              │      │
│  │  React UI    │◄─│  SQLite DB   │◄─│ Data Scanner │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └───────┬──────┘      │
│                                               │             │
└───────────────────────────────────────────────┼─────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────┐
                    │                           ▼                   │
                    │  ┌─────────────────────────────────────┐     │
                    │  │    .stream-state.json               │     │
                    │  │    (MCP Service updates)            │     │
                    │  └─────────────────────────────────────┘     │
                    │                                               │
                    │  ┌─────────────────────────────────────┐     │
                    │  │    .git/worktrees/                  │     │
                    │  │    - stream-0100-name/              │     │
                    │  │    - stream-0119-name/              │     │
                    │  │    - stream-0122-name/              │     │
                    │  └─────────────────────────────────────┘     │
                    │                                               │
                    │  ┌─────────────────────────────────────┐     │
                    │  │    Git Logs (per worktree)          │     │
                    │  │    git log --oneline --since=...    │     │
                    │  └─────────────────────────────────────┘     │
                    │                                               │
                    └───────────────────────────────────────────────┘
                                  File System
```

### Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **React UI** | Display streams, commits, stats; handle user interactions | React 18 + TypeScript |
| **SQLite Database** | Store historical data, computed stats, cached values | better-sqlite3 |
| **Stream State Reader** | Parse `.stream-state.json`, validate schema | TypeScript |
| **Worktree Scanner** | Discover worktrees, execute `git log`, parse output | Node.js child_process |
| **Database Client** | CRUD operations, migrations, indexing | better-sqlite3 |
| **MCP Service** (optional) | Update stream state via API | Express REST API |

### Data Flow

```
User Opens Dashboard
    │
    ▼
React App Loads
    │
    ▼
useStreams Hook
    │
    ├──► Read SQLite Database ───► Display cached data
    │
    └──► Trigger background refresh
            │
            ▼
        Stream State Reader
            │
            ├──► Parse .stream-state.json
            ├──► Validate schema
            └──► Extract stream metadata
                    │
                    ▼
                Update SQLite Database
                    │
                    ▼
        Worktree Scanner
            │
            ├──► Read .git/worktrees/
            ├──► For each worktree:
            │       ├──► git log --oneline --since="7 days ago"
            │       ├──► Parse commit data
            │       └──► Extract: hash, author, timestamp, message
            │
            └──► Update SQLite commits table
                    │
                    ▼
                React UI Re-renders
                    │
                    ▼
                User sees updated data
```

---

## Data Layer

### SQLite Schema

**File**: `server/db/schema.sql`

```sql
-- Streams table (current state)
CREATE TABLE streams (
  id TEXT PRIMARY KEY,               -- e.g., "stream-0100-fix-build-issues"
  stream_number TEXT NOT NULL,       -- e.g., "0100"
  title TEXT NOT NULL,               -- e.g., "Fix Pre-Existing Build Issues"
  category TEXT NOT NULL,            -- frontend, backend, infrastructure, etc.
  priority TEXT NOT NULL,            -- critical, high, medium, low
  status TEXT NOT NULL,              -- initializing, active, blocked, ready, completed
  created_at TEXT NOT NULL,          -- ISO 8601 timestamp
  updated_at TEXT NOT NULL,          -- ISO 8601 timestamp
  completed_at TEXT NULL,            -- ISO 8601 timestamp (if completed)
  worktree_path TEXT,                -- Absolute path to worktree
  branch TEXT                        -- Git branch name
);

-- Commits table (commit history)
CREATE TABLE commits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL,           -- Foreign key to streams.id
  commit_hash TEXT NOT NULL,         -- Full git commit hash
  commit_message TEXT NOT NULL,      -- Commit message (first line)
  author TEXT NOT NULL,              -- Commit author name
  timestamp TEXT NOT NULL,           -- ISO 8601 timestamp
  files_changed INTEGER DEFAULT 0,   -- Number of files changed
  FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE
);

-- Stream history table (audit log)
CREATE TABLE stream_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL,           -- Foreign key to streams.id
  event_type TEXT NOT NULL,          -- created, status_changed, completed, etc.
  old_value TEXT NULL,               -- Previous value (for updates)
  new_value TEXT NULL,               -- New value (for updates)
  timestamp TEXT NOT NULL,           -- ISO 8601 timestamp
  FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_streams_status ON streams(status);
CREATE INDEX idx_streams_category ON streams(category);
CREATE INDEX idx_streams_priority ON streams(priority);
CREATE INDEX idx_commits_stream ON commits(stream_id);
CREATE INDEX idx_commits_timestamp ON commits(timestamp DESC);
CREATE INDEX idx_history_stream ON stream_history(stream_id);
CREATE INDEX idx_history_timestamp ON stream_history(timestamp DESC);
```

### TypeScript Interfaces

**File**: `src/data/types.ts`

```typescript
export enum StreamStatus {
  INITIALIZING = 'initializing',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  READY = 'ready',
  COMPLETED = 'completed',
}

export enum StreamCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  INFRASTRUCTURE = 'infrastructure',
  TESTING = 'testing',
  DOCUMENTATION = 'documentation',
  REFACTORING = 'refactoring',
}

export enum StreamPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface Stream {
  id: string;
  streamNumber: string;
  title: string;
  category: StreamCategory;
  priority: StreamPriority;
  status: StreamStatus;
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
  completedAt?: string;     // ISO 8601 (optional)
  worktreePath?: string;
  branch?: string;
}

export interface Commit {
  id?: number;              // Auto-increment (optional for inserts)
  streamId: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  timestamp: string;        // ISO 8601
  filesChanged: number;
}

export interface StreamHistoryEvent {
  id?: number;
  streamId: string;
  eventType: string;        // 'created', 'status_changed', 'completed', etc.
  oldValue?: string;
  newValue?: string;
  timestamp: string;        // ISO 8601
}

export interface QuickStats {
  activeStreams: number;
  inProgress: number;
  blocked: number;
  readyToStart: number;
}
```

### Database Client

**File**: `src/data/database.ts`

```typescript
import Database from 'better-sqlite3';
import { Stream, Commit, StreamHistoryEvent } from './types';

const DB_PATH = process.env.VITE_DATABASE_PATH || './streams.db';

class StreamDatabase {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.initSchema();
  }

  private initSchema() {
    // Read and execute schema.sql
    const fs = require('fs');
    const schema = fs.readFileSync('./server/db/schema.sql', 'utf-8');
    this.db.exec(schema);
  }

  // Streams
  getStreams(status?: string): Stream[] {
    const stmt = status
      ? this.db.prepare('SELECT * FROM streams WHERE status = ? ORDER BY updated_at DESC')
      : this.db.prepare('SELECT * FROM streams ORDER BY updated_at DESC');

    const rows = status ? stmt.all(status) : stmt.all();
    return rows.map(this.mapRowToStream);
  }

  getStreamById(id: string): Stream | undefined {
    const stmt = this.db.prepare('SELECT * FROM streams WHERE id = ?');
    const row = stmt.get(id);
    return row ? this.mapRowToStream(row) : undefined;
  }

  createStream(stream: Stream): void {
    const stmt = this.db.prepare(`
      INSERT INTO streams (id, stream_number, title, category, priority, status,
                          created_at, updated_at, worktree_path, branch)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      stream.id,
      stream.streamNumber,
      stream.title,
      stream.category,
      stream.priority,
      stream.status,
      stream.createdAt,
      stream.updatedAt,
      stream.worktreePath || null,
      stream.branch || null
    );
  }

  updateStream(id: string, updates: Partial<Stream>): void {
    const fields = Object.keys(updates)
      .filter(k => k !== 'id')
      .map(k => `${k} = ?`)
      .join(', ');

    const values = Object.values(updates).filter((_, i) => Object.keys(updates)[i] !== 'id');

    const stmt = this.db.prepare(`UPDATE streams SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
  }

  deleteStream(id: string): void {
    const stmt = this.db.prepare('DELETE FROM streams WHERE id = ?');
    stmt.run(id);
  }

  // Commits
  getCommitsForStream(streamId: string, limit = 50): Commit[] {
    const stmt = this.db.prepare(`
      SELECT * FROM commits
      WHERE stream_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(streamId, limit).map(this.mapRowToCommit);
  }

  getRecentCommits(limit = 50): Commit[] {
    const stmt = this.db.prepare(`
      SELECT * FROM commits
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(limit).map(this.mapRowToCommit);
  }

  createCommit(commit: Commit): void {
    const stmt = this.db.prepare(`
      INSERT INTO commits (stream_id, commit_hash, commit_message, author, timestamp, files_changed)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      commit.streamId,
      commit.commitHash,
      commit.commitMessage,
      commit.author,
      commit.timestamp,
      commit.filesChanged
    );
  }

  // Stream History
  addHistoryEvent(event: StreamHistoryEvent): void {
    const stmt = this.db.prepare(`
      INSERT INTO stream_history (stream_id, event_type, old_value, new_value, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      event.streamId,
      event.eventType,
      event.oldValue || null,
      event.newValue || null,
      event.timestamp
    );
  }

  getHistoryForStream(streamId: string): StreamHistoryEvent[] {
    const stmt = this.db.prepare(`
      SELECT * FROM stream_history
      WHERE stream_id = ?
      ORDER BY timestamp DESC
    `);
    return stmt.all(streamId).map(this.mapRowToHistory);
  }

  // Mappers
  private mapRowToStream(row: any): Stream {
    return {
      id: row.id,
      streamNumber: row.stream_number,
      title: row.title,
      category: row.category,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at || undefined,
      worktreePath: row.worktree_path || undefined,
      branch: row.branch || undefined,
    };
  }

  private mapRowToCommit(row: any): Commit {
    return {
      id: row.id,
      streamId: row.stream_id,
      commitHash: row.commit_hash,
      commitMessage: row.commit_message,
      author: row.author,
      timestamp: row.timestamp,
      filesChanged: row.files_changed,
    };
  }

  private mapRowToHistory(row: any): StreamHistoryEvent {
    return {
      id: row.id,
      streamId: row.stream_id,
      eventType: row.event_type,
      oldValue: row.old_value || undefined,
      newValue: row.new_value || undefined,
      timestamp: row.timestamp,
    };
  }

  close() {
    this.db.close();
  }
}

export const db = new StreamDatabase();
```

### Stream State Reader

**File**: `src/data/stream-reader.ts`

```typescript
import fs from 'fs';
import path from 'path';
import { Stream, StreamCategory, StreamPriority, StreamStatus } from './types';

const STREAM_STATE_PATH = process.env.VITE_STREAM_STATE_PATH ||
  '../../.project/.stream-state.json';

interface StreamStateJSON {
  streams: Array<{
    id: string;
    streamNumber: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    worktreePath?: string;
    branch?: string;
  }>;
}

export class StreamStateReader {
  private statePath: string;

  constructor(statePath = STREAM_STATE_PATH) {
    this.statePath = path.resolve(statePath);
  }

  read(): Stream[] {
    if (!fs.existsSync(this.statePath)) {
      console.warn(`Stream state file not found: ${this.statePath}`);
      return [];
    }

    try {
      const content = fs.readFileSync(this.statePath, 'utf-8');
      const data: StreamStateJSON = JSON.parse(content);

      return data.streams.map(this.mapToStream);
    } catch (error) {
      console.error('Failed to read stream state:', error);
      return [];
    }
  }

  private mapToStream(raw: any): Stream {
    return {
      id: raw.id,
      streamNumber: raw.streamNumber,
      title: raw.title,
      category: raw.category as StreamCategory,
      priority: raw.priority as StreamPriority,
      status: raw.status as StreamStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      completedAt: raw.completedAt,
      worktreePath: raw.worktreePath,
      branch: raw.branch,
    };
  }
}
```

### Worktree Scanner

**File**: `src/data/worktree-scanner.ts`

```typescript
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Commit } from './types';

const WORKTREES_PATH = process.env.VITE_WORKTREES_PATH || '../../.git/worktrees';
const DAYS_TO_SCAN = 7;

export class WorktreeScanner {
  private worktreesPath: string;

  constructor(worktreesPath = WORKTREES_PATH) {
    this.worktreesPath = path.resolve(worktreesPath);
  }

  /**
   * Discover all active worktrees
   */
  discoverWorktrees(): string[] {
    if (!fs.existsSync(this.worktreesPath)) {
      console.warn(`Worktrees directory not found: ${this.worktreesPath}`);
      return [];
    }

    const entries = fs.readdirSync(this.worktreesPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  }

  /**
   * Get recent commits for a specific worktree
   */
  getCommitsForWorktree(worktreeName: string): Commit[] {
    const worktreePath = this.resolveWorktreePath(worktreeName);

    if (!worktreePath || !fs.existsSync(worktreePath)) {
      console.warn(`Worktree path not found: ${worktreePath}`);
      return [];
    }

    try {
      const since = `${DAYS_TO_SCAN} days ago`;
      const command = `git -C "${worktreePath}" log --oneline --since="${since}" --pretty=format:"%H|%an|%at|%s"`;

      const output = execSync(command, { encoding: 'utf-8' });

      if (!output.trim()) {
        return [];
      }

      return output.split('\n').map(line => this.parseCommitLine(line, worktreeName));
    } catch (error) {
      console.error(`Failed to read commits for ${worktreeName}:`, error);
      return [];
    }
  }

  /**
   * Get commits for all worktrees
   */
  getAllCommits(): Commit[] {
    const worktrees = this.discoverWorktrees();

    return worktrees.flatMap(worktree =>
      this.getCommitsForWorktree(worktree)
    );
  }

  /**
   * Resolve worktree name to absolute path
   */
  private resolveWorktreePath(worktreeName: string): string | null {
    // Read .git/worktrees/<name>/gitdir to get actual worktree path
    const gitdirFile = path.join(this.worktreesPath, worktreeName, 'gitdir');

    if (!fs.existsSync(gitdirFile)) {
      return null;
    }

    const gitdir = fs.readFileSync(gitdirFile, 'utf-8').trim();
    // gitdir points to <worktree>/.git, so strip .git to get worktree path
    return gitdir.replace(/\/\.git$/, '');
  }

  /**
   * Parse git log line: hash|author|timestamp|message
   */
  private parseCommitLine(line: string, worktreeName: string): Commit {
    const [hash, author, timestamp, message] = line.split('|');

    return {
      streamId: worktreeName, // Worktree name is stream ID
      commitHash: hash,
      commitMessage: message,
      author,
      timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
      filesChanged: 0, // Can be enhanced with git show --stat
    };
  }
}
```

---

## UI Layer

### Component Hierarchy

```
App
├── ThemeProvider (from @transftw/theme-provider)
│   └── MainLayout
│       ├── Header
│       │   ├── Logo
│       │   └── Navigation
│       ├── PurposeTable
│       │   └── InfoRow
│       ├── FilterBar
│       │   ├── StatusFilter
│       │   ├── CategoryFilter
│       │   ├── PriorityFilter
│       │   └── SearchBar
│       ├── QuickStats
│       │   └── StatCard (×4)
│       ├── StreamTable
│       │   ├── TableHeader
│       │   └── StreamRow (×N)
│       │       └── StreamCard
│       └── ActivityTimeline
│           ├── TimelineSection (×N)
│           └── CommitCard (×N)
```

### Key Components

**1. StreamTable** (`src/components/StreamTable.tsx`)

Displays streams in a sortable, filterable table.

```typescript
interface StreamTableProps {
  streams: Stream[];
  onStreamClick: (stream: Stream) => void;
}

export const StreamTable: React.FC<StreamTableProps> = ({ streams, onStreamClick }) => {
  const [sortColumn, setSortColumn] = useState<keyof Stream>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedStreams = useMemo(() => {
    return [...streams].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [streams, sortColumn, sortDirection]);

  return (
    <Table>
      <TableHeader onSort={(col) => { /* ... */ }} />
      <TableBody>
        {sortedStreams.map(stream => (
          <StreamRow
            key={stream.id}
            stream={stream}
            onClick={() => onStreamClick(stream)}
          />
        ))}
      </TableBody>
    </Table>
  );
};
```

**2. ActivityTimeline** (`src/components/ActivityTimeline.tsx`)

Rich commit timeline with virtualization, grouping, and filtering. Replaces the legacy CommitStream.

```typescript
interface ActivityTimelineProps {
  commits: Commit[];
  streams: Stream[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function ActivityTimeline({
  commits,
  streams,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}: ActivityTimelineProps) {
  // Enrich commits with stream context (branch, worktree, status)
  const enrichedCommits = useMemo(
    () => enrichCommits(commits, streams),
    [commits, streams]
  );

  // Group commits by time/stream/author
  const groupedCommits = useMemo(
    () => groupCommits(enrichedCommits, groupBy),
    [enrichedCommits, groupBy]
  );

  // Virtualized rendering with react-window
  return (
    <VariableSizeList
      itemCount={flatItems.length}
      itemSize={getItemSize}
      onItemsRendered={handleItemsRendered}
    >
      {renderItem}
    </VariableSizeList>
  );
}
```

Features:
- **Virtualization**: react-window VariableSizeList for smooth scrolling with 1000+ commits
- **Activity Heat**: Color-coded borders (hot/warm/cold) based on commit recency
- **Temporal Grouping**: Today → Yesterday → This Week → Older
- **Expand/Collapse**: CommitCard details with dynamic height recalculation
- **Infinite Scroll**: Load more commits as user scrolls

**3. QuickStats** (`src/components/QuickStats.tsx`)

Displays minimal at-a-glance statistics.

```typescript
interface QuickStatsProps {
  stats: QuickStats;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <StatsGrid>
      <StatCard title="Active Streams" value={stats.activeStreams} />
      <StatCard title="In Progress" value={stats.inProgress} />
      <StatCard title="Blocked" value={stats.blocked} />
      <StatCard title="Ready to Start" value={stats.readyToStart} />
    </StatsGrid>
  );
};
```

### State Management

**React Query** (optional, recommended):

```typescript
// src/hooks/useStreams.ts
import { useQuery } from '@tanstack/react-query';
import { db } from '../data/database';

export function useStreams(status?: string) {
  return useQuery({
    queryKey: ['streams', status],
    queryFn: () => db.getStreams(status),
    refetchInterval: 120000, // 2 minutes
  });
}
```

**Alternative** (useState + useEffect):

```typescript
export function useStreams(status?: string) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      const data = db.getStreams(status);
      setStreams(data);
      setLoading(false);
    };

    fetchStreams();
    const interval = setInterval(fetchStreams, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [status]);

  return { streams, loading };
}
```

### Styling

**Styled Components**:

```typescript
import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    background-color: ${props => props.theme.colors.background.secondary};
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background-color: ${props => props.theme.colors.background.hover};
    }
  }
`;

export const StreamRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.background.hover};
  }
`;
```

---

## Integration Points

### MCP Service Integration

**Option 1: File-based** (Current)

MCP service updates `.stream-state.json`, dashboard polls file.

**MCP Service**:
```typescript
// Update stream status
await updateStreamState(streamId, { status: 'in_progress' });
```

**Dashboard**:
```typescript
// Poll every 2 minutes
const reader = new StreamStateReader();
setInterval(() => {
  const streams = reader.read();
  db.syncStreams(streams);
}, 120000);
```

**Option 2: API-based**

MCP service calls dashboard REST API.

**Dashboard API** (`server/api.ts`):
```typescript
import express from 'express';
import { db } from '../src/data/database';

const app = express();
app.use(express.json());

app.post('/api/streams/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.updateStream(id, { status, updatedAt: new Date().toISOString() });

  res.json({ success: true });
});

app.listen(3000);
```

**MCP Service**:
```typescript
await fetch('http://localhost:3000/api/streams/stream-0100/status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'in_progress' }),
});
```

### Git Integration

**Worktree Discovery**:
```typescript
// Read .git/worktrees/ to find all worktrees
const worktrees = fs.readdirSync('.git/worktrees/');

// For each worktree, read gitdir file
worktrees.forEach(name => {
  const gitdir = fs.readFileSync(`.git/worktrees/${name}/gitdir`, 'utf-8').trim();
  const worktreePath = gitdir.replace(/\/\.git$/, '');

  // Now can run git commands in worktreePath
});
```

**Commit Scanning**:
```bash
# Run in each worktree
git log --oneline --since="7 days ago" --pretty=format:"%H|%an|%at|%s"
```

**File Change Count** (optional enhancement):
```bash
git show --stat <commit-hash> | tail -1 | awk '{print $1}'
```

---

## Performance Considerations

### Database Indexing

**Critical indexes** (already in schema):
```sql
CREATE INDEX idx_streams_status ON streams(status);
CREATE INDEX idx_commits_timestamp ON commits(timestamp DESC);
```

**Query optimization**:
- Use `LIMIT` for large result sets
- Index all columns used in `WHERE` clauses
- Use `EXPLAIN QUERY PLAN` to analyze slow queries

### React Rendering

**Memoization**:
```typescript
const MemoizedStreamRow = React.memo(StreamRow, (prev, next) =>
  prev.stream.id === next.stream.id &&
  prev.stream.updatedAt === next.stream.updatedAt
);
```

**Virtual scrolling** (for large lists):
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={streams.length}
  itemSize={60}
>
  {({ index, style }) => (
    <div style={style}>
      <StreamRow stream={streams[index]} />
    </div>
  )}
</FixedSizeList>
```

### Git Log Parsing

**Efficiency tips**:
- Use `--since="7 days ago"` to limit output
- Parse with simple string split (avoid regex)
- Run in parallel for multiple worktrees

**Parallel scanning**:
```typescript
const worktrees = scanner.discoverWorktrees();

const commitPromises = worktrees.map(async (worktree) =>
  scanner.getCommitsForWorktree(worktree)
);

const allCommits = (await Promise.all(commitPromises)).flat();
```

### Polling vs WebSocket

**Polling** (current):
- Simple to implement
- 2-minute delay acceptable for this use case
- No server infrastructure needed

**WebSocket** (future enhancement):
- Real-time updates
- More complex setup
- Requires running server

**Recommendation**: Start with polling, upgrade to WebSocket if needed.

---

## Security

### SQL Injection Prevention

**Use parameterized queries** (better-sqlite3 handles this):

```typescript
// ✅ SAFE
const stmt = db.prepare('SELECT * FROM streams WHERE id = ?');
stmt.get(userInput);

// ❌ UNSAFE
db.exec(`SELECT * FROM streams WHERE id = '${userInput}'`);
```

### Input Validation

**Validate all user inputs**:

```typescript
function validateStreamId(id: string): boolean {
  // Must match pattern: stream-XXXX-kebab-case
  return /^stream-\d{4}-[a-z0-9-]+$/.test(id);
}

function validateStatus(status: string): status is StreamStatus {
  return Object.values(StreamStatus).includes(status as StreamStatus);
}
```

### .gitignore Strategy

**Never commit**:
- `*.db` - SQLite database files
- `*.db-journal` - SQLite journal files
- `*.db-shm`, `*.db-wal` - SQLite shared memory/WAL files
- `.env.local` - Local environment variables

**Safe to commit**:
- `.env.example` - Template for environment variables
- `schema.sql` - Database schema
- Source code, tests, documentation

---

## Deployment

### Development

```bash
pnpm dev
```

Runs Vite dev server with HMR.

### Production Build

```bash
pnpm build
```

Outputs to `dist/`:
- `index.html` - Entry point
- `assets/*.js` - Bundled JavaScript (with code splitting)
- `assets/*.css` - Bundled CSS

### Static Hosting

Deploy `dist/` to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **GitHub Pages**: Copy `dist/` to `gh-pages` branch
- **S3**: `aws s3 sync dist/ s3://bucket-name/`

### Server Mode (Optional)

If using Express API:

```bash
# Start API server
pnpm dev:server

# Build API
pnpm build:server

# Run in production
node dist/server.js
```

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod
COPY . .
RUN pnpm build
CMD ["pnpm", "preview"]
```

---

## Maintenance

### Schema Migrations

When updating schema:

1. Create migration script:
```typescript
// migrations/001_add_tags_column.ts
export function up(db: Database) {
  db.exec('ALTER TABLE streams ADD COLUMN tags TEXT NULL');
}

export function down(db: Database) {
  db.exec('ALTER TABLE streams DROP COLUMN tags');
}
```

2. Run migration:
```bash
pnpm migrate:up
```

3. Update TypeScript interfaces to match

### Database Rebuilding

If database is corrupted:

```bash
# Delete database
rm streams.db

# Rebuild from git history
pnpm rebuild-dashboard
```

**Rebuild logic**:
1. Scan all worktrees
2. Parse `.stream-state.json`
3. Run `git log` for each worktree
4. Reconstruct database tables
5. Verify integrity

---

**Last Updated**: 2025-12-11
**Version**: 1.0.0
**Stream**: stream-0101-status-dashboard-react-app
