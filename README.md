# Stream Workflow Status MCP Server

Real-time stream status tracking and dashboard for development workflows.

**Version**: 0.1.0
**Status**: Development

---

## Overview

Stream Workflow Status is an MCP server addon for `@3viky/mcp-stream-workflow` that provides:

- **Real-time status tracking** via SQLite database
- **Commit activity monitoring** across all worktrees
- **Interactive React dashboard** with live updates
- **REST API** for external integrations
- **MCP tools** for workflow automation

---

## Architecture

```
@3viky/mcp-stream-workflow-status
├── MCP Server (Node.js + TypeScript)
│   ├── Tools: add_stream, update_stream, add_commit, etc.
│   ├── Database: SQLite (streams, commits, history)
│   └── API: Express server (REST endpoints)
│
└── Dashboard (React + Vite)
    ├── StreamTable (sortable, filterable)
    ├── CommitStream (recent activity feed)
    └── QuickStats (metrics overview)
```

**Integration**: Works as addon to `@3viky/mcp-stream-workflow`

---

## Installation

### Prerequisites

- Node.js 18+
- pnpm
- SQLite 3

### Setup

```bash
# Install dependencies
pnpm install

# Build MCP server
pnpm build

# Build dashboard
pnpm build:dashboard

# Or build both
pnpm build:all
```

### MCP Configuration

Add to `.claude/mcp-servers.json`:

```json
{
  "mcp-stream-workflow-status": {
    "command": "node",
    "args": ["~/Code/packages/src/@mcp/mcp-stream-workflow-status/dist/server.js"],
    "env": {
      "PROJECT_ROOT": "/path/to/your/project",
      "WORKTREE_ROOT": "/path/to/worktrees",
      "DATABASE_PATH": "~/Code/packages/src/@mcp/mcp-stream-workflow-status/data/streams.db",
      "API_PORT": "3001",
      "API_ENABLED": "true"
    }
  }
}
```

---

## Dashboard Launcher (Systemd Integration)

**NEW**: Dashboard runs as a persistent systemd user service that survives agent session termination.

### Quick Start

```bash
# Launch dashboard (auto-installs service if needed)
node scripts/launch-dashboard.js

# Or use the management script
./scripts/manage-service.sh start
```

### How It Works

1. **First run**: Installs systemd service to `~/.config/systemd/user/stream-dashboard.service`
2. **Enables linger**: Auto-enables `loginctl enable-linger` so service persists beyond sessions
3. **Standalone entry point**: Uses `api-server-standalone.js` (no stdio dependency, unlike MCP server)
4. **Service management**: Uses `systemctl --user` commands to start/stop/restart
5. **True persistence**: Service continues running after Claude Code exits, session ends, or logout
6. **Browser launch**: Opens dashboard URL automatically
7. **Multi-project**: Lock file tracks which project the server is running for

> **Technical Note**: The service runs `dist/api-server-standalone.js` which provides ONLY the Express API server without MCP stdio transport. This ensures the process doesn't terminate when Claude Code closes. The main MCP server (`dist/server.js`) is used only when running via `.claude/mcp-servers.json`.

### Service Management Commands

```bash
# Manual control via systemctl
systemctl --user status stream-dashboard   # Check status
systemctl --user stop stream-dashboard     # Stop service
systemctl --user restart stream-dashboard  # Restart service
systemctl --user enable stream-dashboard   # Auto-start on login

# Or use the helper script
./scripts/manage-service.sh status
./scripts/manage-service.sh logs          # Follow logs
./scripts/manage-service.sh install       # Reinstall service
./scripts/manage-service.sh uninstall     # Remove service
```

### Benefits Over Direct Launch

| Feature | Direct Launch | Systemd Service |
|---------|--------------|-----------------|
| **Survives agent exit** | ❌ No | ✅ Yes |
| **Auto-restart on crash** | ❌ No | ✅ Yes |
| **Journal logging** | ❌ No | ✅ Yes |
| **Standard management** | ❌ Custom | ✅ systemctl |
| **Auto-start on login** | ❌ No | ✅ Optional |

### Troubleshooting

**Service won't start:**
```bash
# Check logs
journalctl --user -u stream-dashboard -n 50

# Check status
systemctl --user status stream-dashboard

# Restart daemon
systemctl --user daemon-reload
./scripts/manage-service.sh restart
```

**Port conflict:**
```bash
# Server auto-discovers available port
# Check lock file for actual port:
cat ~/.local/share/claude/mcp/data/stream-workflow-status/projects/*/. api-server.lock
```

---

## MCP Tools

| Tool | Description |
|------|-------------|
| `add_stream` | Register new stream in database |
| `update_stream` | Update stream status/progress |
| `add_commit` | Track worktree commits |
| `remove_stream` | Archive completed stream |
| `get_stream_stats` | Get quick statistics |

### Example Usage

```typescript
// Called from @3viky/mcp-stream-workflow
await mcp.tools.call('add_stream', {
  streamId: 'stream-0101-status-dashboard',
  streamNumber: '0101',
  title: 'Status Dashboard React App',
  category: 'frontend',
  priority: 'high',
  worktreePath: '/path/to/worktree',
  branch: 'stream-0101-status-dashboard'
});
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/streams` | GET | List all streams (supports filtering) |
| `/api/commits` | GET | Recent commits across worktrees |
| `/api/stats` | GET | Quick statistics |

### Example Response

```bash
# Get all active streams
curl http://localhost:3001/api/streams

# Get recent commits
curl http://localhost:3001/api/commits?limit=20

# Get statistics
curl http://localhost:3001/api/stats
```

---

## Dashboard

Interactive React dashboard served at `http://localhost:3001/`

**Features**:
- Real-time stream status table
- Commit activity feed
- Quick stats overview
- Filtering by status/category/priority
- Search functionality
- Auto-refresh (30s polling)

**Development**:
```bash
cd dashboard
pnpm dev  # Starts Vite dev server on port 5174
```

**Production**:
```bash
pnpm build:dashboard  # Builds to dashboard/dist
# Express serves static files from dashboard/dist
```

---

## Database Schema

### streams
```sql
CREATE TABLE streams (
  id TEXT PRIMARY KEY,
  stream_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'initializing',
  progress INTEGER DEFAULT 0,
  current_phase INTEGER,
  worktree_path TEXT,
  branch TEXT NOT NULL,
  blocked_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);
```

### commits
```sql
CREATE TABLE commits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL REFERENCES streams(id),
  commit_hash TEXT NOT NULL,
  message TEXT NOT NULL,
  author TEXT,
  files_changed INTEGER DEFAULT 0,
  timestamp TEXT NOT NULL
);
```

### stream_history
```sql
CREATE TABLE stream_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL REFERENCES streams(id),
  event_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  timestamp TEXT NOT NULL
);
```

---

## Development

```bash
# Watch TypeScript compilation
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## License

MIT
