# Project Status Dashboard - Real-Time Development Status Tracker

**Purpose**: Interactive React dashboard for tracking active development streams across worktrees with real-time git commit activity.

**Location**: `product/apps/project-status/`

**Status**: Implementation in progress (stream-0101)

---

## Overview

The Project Status Dashboard replaces the manually-maintained `.project/STREAM_STATUS_DASHBOARD.md` file with a self-updating React application that provides real-time visibility into active development streams.

### Problems Solved

**Manual Dashboard Issues:**
- Manually edited, frequently out of sync
- Historical bloat (massive "Recently Completed" sections)
- No real-time commit tracking
- Hard to navigate (unclear "what to work on next")
- Duplicate/confusing stats

**Dashboard Solution:**
- Auto-syncs with git worktree commits
- SQLite database for historical data (`.gitignored`)
- Real-time commit stream from all active worktrees
- Clear navigation by status (Ready → In Progress → Blocked)
- Self-rebuilding from git history

### Key Features

**1. Auto-Sync**
- Reads `.project/.stream-state.json` for current stream state
- Scans `.git/worktrees/` for active worktrees
- Polls git logs from each worktree for recent commits
- Updates dashboard automatically without manual intervention

**2. Commit Stream View**
- Shows recent commits from ALL active worktrees
- Real-time activity feed across all streams
- Identifies which stream each commit belongs to
- Shows file change counts and timestamps

**3. Self-Rebuilding**
- Can reconstruct SQLite database from git history
- Resilient to data loss (database is `.gitignored`)
- `pnpm rebuild-dashboard` command recreates state

**4. Clear Navigation**
- Organized by status (Initializing, Active, Blocked, Ready, Completed)
- Filter by category (frontend, backend, infrastructure, etc.)
- Filter by priority (critical, high, medium, low)
- Search by stream title or description

**5. Minimal Quick Stats**
- Active Streams count
- In Progress count
- Blocked count
- Ready to Start count
- **No historical bloat** (points to `.project/history/`)

---

## Getting Started

### Prerequisites

```bash
# Node.js 18+ and pnpm
node --version  # v18.0.0+
pnpm --version  # 8.0.0+

# SQLite3 (for better-sqlite3)
sqlite3 --version  # 3.40.0+
```

### Installation

From the monorepo root:

```bash
# Install dependencies
pnpm install

# Navigate to dashboard
cd product/project-status
```

### Development

```bash
# Start dev server
pnpm dev

# Dashboard available at http://localhost:5173
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Database Rebuild

If the SQLite database is corrupted or deleted:

```bash
# Rebuild from git history
pnpm rebuild-dashboard
```

This scans all worktrees, reads git logs, and reconstructs the database.

---

## Architecture

### Data Flow

```
.stream-state.json → Stream Reader → SQLite Database → React UI
       ↓                                    ↑
Worktrees (git logs) → Worktree Scanner ──────┘
```

**1. Data Sources:**
- `.project/.stream-state.json` - Current stream state (managed by MCP service)
- `.project/plan/streams/*/` - Stream documentation (HANDOFF.md, README.md)
- `.git/worktrees/` - Active worktree discovery
- Git logs from each worktree - Recent commit activity

**2. Data Layer:**
- SQLite database (`.gitignored`) - Historical data, computed stats
- Stream state reader - Parses `.stream-state.json`
- Worktree scanner - Discovers worktrees, reads git logs
- Database client - CRUD operations with better-sqlite3

**3. UI Layer:**
- React 18 + TypeScript
- Vite build tool
- `@transftw/egirl-ui` components
- Optional: React Query for data fetching

### Directory Structure

```
product/apps/project-status/
├── src/
│   ├── components/          # React components
│   │   ├── StreamTable.tsx      # Main table (Active/Ready/Blocked)
│   │   ├── ActivityTimeline.tsx  # Rich commit timeline with virtualization
│   │   ├── QuickStats.tsx       # At-a-glance counters
│   │   ├── FilterBar.tsx        # Filter controls
│   │   ├── SearchBar.tsx        # Search input
│   │   └── StreamCard.tsx       # Individual stream display
│   ├── data/                # Data layer
│   │   ├── database.ts          # SQLite client (better-sqlite3)
│   │   ├── stream-reader.ts     # .stream-state.json parser
│   │   ├── worktree-scanner.ts  # Worktree discovery + git logs
│   │   └── types.ts             # TypeScript interfaces
│   ├── hooks/               # Custom React hooks
│   │   ├── useStreams.ts        # Load stream data
│   │   ├── useCommits.ts        # Load commit history
│   │   └── useStats.ts          # Compute quick stats
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── server/                  # Optional: API for MCP service
│   ├── api.ts               # Express API
│   ├── routes/
│   │   ├── streams.ts       # CRUD for streams
│   │   └── commits.ts       # Commit tracking
│   └── db/
│       └── schema.sql       # SQLite schema
├── scripts/                 # Automation scripts
│   └── rebuild-database.ts  # Database reconstruction
├── public/                  # Static assets
├── README.md                # This file
├── ARCHITECTURE.md          # Technical deep-dive
├── .gitignore
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript 5** | Type safety |
| **Vite** | Build tool (fast HMR, optimized builds) |
| **better-sqlite3** | SQLite driver (synchronous, fast) |
| **@transftw/egirl-ui** | UI components (theme-aware) |
| **@transftw/theme-provider** | Theming system |
| **styled-components** | CSS-in-JS styling |
| **lucide-react** | Icons |
| **Express** (optional) | API server for MCP integration |
| **React Query** (optional) | Data fetching and caching |

---

## Data Sources

### 1. `.project/.stream-state.json`

**Managed by**: MCP `stream-workflow` service

**Purpose**: Current stream state (status, category, priority, timestamps)

**Example**:
```json
{
  "streams": [
    {
      "id": "stream-0100-fix-build-issues",
      "streamNumber": "0100",
      "title": "Fix Pre-Existing Build Issues",
      "category": "refactoring",
      "priority": "medium",
      "status": "ready",
      "createdAt": "2025-12-11T10:00:00Z",
      "updatedAt": "2025-12-11T10:00:00Z",
      "worktreePath": "/path/to/worktrees/stream-0100-fix-build-issues",
      "branch": "stream-0100-fix-build-issues"
    }
  ]
}
```

**Update frequency**: MCP service updates on stream status changes

### 2. `.project/plan/streams/*/`

**Purpose**: Stream documentation (handoff specs, planning docs)

**Files**:
- `HANDOFF.md` - Implementation specification
- `README.md` - Stream overview
- Other docs (design notes, planning)

**Usage**: Dashboard can link to these docs for detailed stream info

### 3. `.git/worktrees/`

**Purpose**: Discover all active worktrees

**Discovery mechanism**:
```bash
# List all worktrees
ls .git/worktrees/

# Example output:
# stream-0100-fix-build-issues
# stream-119-webmap
# stream-122-roadmap-update
```

**Usage**: Scanner iterates through worktrees to find active streams

### 4. Git Logs (per worktree)

**Purpose**: Recent commit activity for each stream

**Command**:
```bash
cd /path/to/worktree/stream-XX-name
git log --oneline --since="7 days ago" --pretty=format:"%H|%an|%at|%s"
```

**Example output**:
```
abc123|Claude Sonnet|1702345678|feat(dashboard): Add commit stream view
def456|Claude Sonnet|1702345600|fix(dashboard): Handle missing worktrees
```

**Usage**: Parsed to populate commit stream and recent activity indicators

### 5. SQLite Database (`.gitignored`)

**Purpose**: Historical data, computed stats, caching

**Location**: `product/apps/project-status/streams.db`

**Schema**: See ARCHITECTURE.md for full schema

**Rebuild**: `pnpm rebuild-dashboard` reconstructs from git history

---

## Dashboard Views

### Overview (Default View)

**Purpose Table** (top of page):

| What is this? | Data Source | Last Sync |
|---------------|-------------|-----------|
| Real-time stream status dashboard | `.stream-state.json` + worktree git logs | 2 minutes ago |

**Active Streams Table**:

| Stream | Title | Status | Category | Priority | Recent Activity |
|--------|-------|--------|----------|----------|-----------------|
| 0100 | Fix Pre-Existing Build Issues | Ready | refactoring | medium | No commits yet |
| 119 | WebMap Implementation | In Progress | frontend | high | 3 commits (2 hours ago) |
| 122 | Roadmap Update | In Progress | documentation | medium | 1 commit (5 hours ago) |

**Features**:
- Sortable columns (click headers)
- Filter by status, category, priority
- Search by title
- Click row to see stream details

### Commit Stream View

Shows recent commits from ALL active worktrees:

```
[0119] feat(webmap): Add config generator tests
       └─ 23 files changed | 2 hours ago | Claude Sonnet

[0122] docs(roadmap): Update milestone architecture
       └─ 4 files changed | 5 hours ago | Claude Sonnet

[0100] Created worktree
       └─ 0 files changed | 1 hour ago | MCP Service
```

**Features**:
- Shows last 50 commits across all streams
- Color-coded by stream
- Links to stream detail view
- Real-time updates (polls every 2 minutes)

### Quick Stats (Minimal)

| Metric | Count |
|--------|-------|
| Active Streams | 62 |
| In Progress | 3 |
| Blocked | 2 |
| Ready to Start | 18 |

**Note**: No historical data. For completed streams, see `.project/history/`.

---

## Configuration

### Environment Variables

**Optional** (defaults work for standard setup):

```bash
# .env.local
VITE_STREAM_STATE_PATH=../../.project/.stream-state.json
VITE_WORKTREES_PATH=../../.git/worktrees
VITE_REFRESH_INTERVAL=120000  # 2 minutes in ms
VITE_DATABASE_PATH=./streams.db
```

### Database Location

**Default**: `product/apps/project-status/streams.db`

**Custom location**:
```typescript
// src/data/database.ts
const dbPath = process.env.VITE_DATABASE_PATH || './streams.db';
```

### Polling Interval

**Default**: Auto-refresh every 2 minutes

**Custom interval**:
```typescript
// src/hooks/useStreams.ts
const REFRESH_INTERVAL = 120000; // milliseconds
```

---

## Development

### Project Structure

```
src/
├── components/       # React components (UI)
├── data/            # Data layer (SQLite, readers, scanners)
├── hooks/           # Custom hooks (data fetching, state)
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

### Adding New Components

**Example**: Add a `StreamDetailPanel` component:

1. Create component file:
```typescript
// src/components/StreamDetailPanel.tsx
import React from 'react';
import { Stream } from '../data/types';

interface StreamDetailPanelProps {
  stream: Stream;
}

export const StreamDetailPanel: React.FC<StreamDetailPanelProps> = ({ stream }) => {
  return (
    <div>
      <h2>{stream.title}</h2>
      <p>Status: {stream.status}</p>
      {/* ... */}
    </div>
  );
};
```

2. Import and use in parent component:
```typescript
import { StreamDetailPanel } from './components/StreamDetailPanel';
```

3. Follow conventions:
- PascalCase for component names
- Use TypeScript interfaces for props
- Use styled-components (not inline styles)
- Import UI components from `@transftw/egirl-ui`

### Modifying SQLite Schema

**Steps**:

1. Update schema in `server/db/schema.sql`
2. Create migration script (if needed)
3. Update TypeScript interfaces in `src/data/types.ts`
4. Rebuild database: `pnpm rebuild-dashboard`

**Example**: Add `tags` column to streams table:

```sql
-- server/db/schema.sql
ALTER TABLE streams ADD COLUMN tags TEXT NULL;
```

```typescript
// src/data/types.ts
export interface Stream {
  id: string;
  streamNumber: string;
  title: string;
  // ... existing fields
  tags?: string[]; // New field
}
```

```typescript
// src/data/database.ts
function mapRowToStream(row: any): Stream {
  return {
    // ... existing mapping
    tags: row.tags ? JSON.parse(row.tags) : undefined,
  };
}
```

### Testing Approach

**Unit Tests** (Vitest):
```bash
pnpm test

# Run specific test file
pnpm test src/data/stream-reader.test.ts
```

**Integration Tests**:
- Test data layer (database operations)
- Test worktree scanner (mock git commands)
- Test stream reader (mock .stream-state.json)

**E2E Tests** (Playwright):
```bash
pnpm test:e2e

# Test dashboard UI interactions
# Test filtering, searching, sorting
```

**Coverage**:
```bash
pnpm test:coverage
```

---

## Troubleshooting

### Common Issues

**Issue**: Dashboard not updating with recent commits

**Solution**:
1. Check `.stream-state.json` exists and is valid JSON
2. Verify worktrees exist in `.git/worktrees/`
3. Check polling interval (default 2 minutes)
4. Inspect browser console for errors

**Issue**: Database corrupted or missing

**Solution**:
```bash
# Rebuild from git history
pnpm rebuild-dashboard

# This scans all worktrees and reconstructs database
```

**Issue**: TypeScript errors after schema changes

**Solution**:
1. Update `src/data/types.ts` to match new schema
2. Update database mapping functions
3. Run type check: `pnpm type-check`

**Issue**: Build fails with SQLite errors

**Solution**:
```bash
# Reinstall better-sqlite3 (native module)
pnpm rebuild better-sqlite3

# Or reinstall all dependencies
rm -rf node_modules
pnpm install
```

**Issue**: Commits not showing in commit stream

**Solution**:
1. Verify worktree paths are correct
2. Check git log command works manually:
   ```bash
   cd /path/to/worktree
   git log --oneline --since="7 days ago"
   ```
3. Check worktree scanner logs for errors

### Performance Tips

**Slow initial load**:
- Add database indexes (see `schema.sql`)
- Limit commit history to last 7 days
- Implement pagination for large stream lists

**High memory usage**:
- Reduce polling frequency
- Limit number of commits in memory
- Use React.memo for expensive components

**Slow filtering/searching**:
- Add debouncing to search input (300ms)
- Index database columns used in WHERE clauses
- Use virtual scrolling for large lists

---

## MCP Integration (Optional)

The dashboard can integrate with the MCP `stream-workflow` service for real-time updates.

### Option 1: Polling (Current)

Dashboard polls `.stream-state.json` every 2 minutes. MCP service updates this file.

**Pros**: Simple, no server needed
**Cons**: 2-minute delay for updates

### Option 2: API Server

Dashboard runs Express API server. MCP service calls API endpoints.

**Setup**:
```bash
# Start API server
pnpm dev:server

# API available at http://localhost:3000
```

**Endpoints**:
```
POST /api/streams/:id/status
PUT  /api/streams/:id
GET  /api/streams
GET  /api/commits
```

**MCP Integration**:
```typescript
// MCP service calls API instead of updating .stream-state.json
await fetch('http://localhost:3000/api/streams/stream-0100/status', {
  method: 'POST',
  body: JSON.stringify({ status: 'in_progress' }),
});
```

**Pros**: Real-time updates, no polling
**Cons**: Requires running server

### Option 3: WebSocket

Real-time bidirectional communication.

**Pros**: Instant updates
**Cons**: More complex setup

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm test:coverage` | Generate test coverage report |
| `pnpm type-check` | Check TypeScript types |
| `pnpm lint` | Run ESLint |
| `pnpm rebuild-dashboard` | Rebuild database from git history |
| `pnpm dev:server` | Start API server (optional) |

---

## Migration from Markdown

The previous `.project/STREAM_STATUS_DASHBOARD.md` has been **superseded** by this React application.

### Migration Plan

1. **Build new dashboard** in `product/apps/project-status/`
2. **Run in parallel** with old `.md` file (verify accuracy)
3. **Use new dashboard for 1 week** alongside old one
4. **Update MCP service** to use new dashboard API (optional)
5. **Deprecate old `.md` file** (keep as backup initially)
6. **Final switchover** after confidence established

### Key Improvements

| Feature | Old (Markdown) | New (Dashboard) |
|---------|---------------|----------------|
| **Updates** | Manual editing | Auto-sync from git |
| **Real-time** | No | Yes (2-minute polling) |
| **Commit tracking** | No | Yes (all worktrees) |
| **Historical bloat** | Massive "Recently Completed" | Points to `.project/history/` |
| **Navigation** | Linear text file | Filtered tables, search |
| **Stats** | Confusing/duplicate | Minimal, accurate |
| **Self-healing** | No | Rebuild from git history |

### Preserved Features

- ✅ Shows all active streams
- ✅ Status indicators (Ready, In Progress, Blocked)
- ✅ Category and priority info
- ✅ Last updated timestamps
- ✅ Stream documentation links

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 15+, Chrome Android

---

## Resources

**Internal Documentation:**
- **Technical Architecture**: See `ARCHITECTURE.md`
- **Stream Planning**: See `.project/plan/streams/stream-0101-status-dashboard-react-app/`
- **MCP Service**: See `.claude/mcp-servers/stream-workflow-manager/`
- **Platform Standards**: See `.claude/instructions/code-style.md`

**Reference Implementations:**
- **Roadmap Matrix**: `product/roadmap_matrix/` (similar React app architecture)
- **egirl-ui Docs**: See `packages/egirl-ui/README.md`

**External Resources:**
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [Vite Documentation](https://vitejs.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## Contributing

### Adding Features

1. Create feature branch from stream worktree
2. Follow platform code standards
3. Add unit tests for new logic
4. Update this README if needed
5. Test thoroughly (dev + build)
6. Submit PR to stream branch

### Updating Stream Data

**DO NOT** manually edit the database. Use:

1. **MCP service** to update `.stream-state.json`
2. **Git commits** in worktrees (auto-detected by scanner)
3. **Rebuild command** if database is corrupted

### Code Standards

- **File naming**: `kebab-case.ts`
- **Components**: PascalCase
- **Styling**: styled-components (not inline styles)
- **TypeScript**: Strict mode, no `any` types
- **Imports**: Workspace aliases (`@transftw/egirl-ui`)

---

**Last Updated**: 2025-12-11
**Stream**: stream-0101-status-dashboard-react-app
**Status**: Documentation complete, implementation in progress
**Next Steps**: Implement Phase 1 (Data Layer)
