# Multi-Agent, Per-Project Architecture

## Problem Statement

Multiple AI agents may be working on the same project simultaneously, each running their own instance of `@mcp/mcp-stream-workflow-status`. We need:
1. **Single server per project** - All agents connect to the same API server
2. **Centralized storage** - Per-project databases in `~/.cache/mcp-services/`
3. **Server discovery** - Detect existing servers before starting new ones
4. **Lock coordination** - Prevent port conflicts and duplicate servers

## Storage Architecture

### Directory Structure
```
~/.cache/mcp-services/stream-workflow-status/
├── projects/
│   ├── egirl-platform/              # Project name from PROJECT_ROOT
│   │   ├── streams.db               # SQLite database
│   │   ├── .api-server.lock         # Lock file
│   │   └── config.json              # Per-project config
│   └── another-project/
│       └── ...
└── logs/
    └── api-server-{project}.log     # Server logs per project
```

### Lock File Format (`.api-server.lock`)
```json
{
  "pid": 12345,
  "port": 3001,
  "projectRoot": "/path/to/project",
  "startedAt": "2025-12-11T14:00:00Z",
  "nodeVersion": "22.21.1"
}
```

## Server Lifecycle

### 1. MCP Instance Starts
```typescript
const projectRoot = process.env.PROJECT_ROOT;
const projectName = basename(projectRoot);
const dataDir = getMCPServiceSubdir('stream-workflow-status', 'projects', projectName);
```

### 2. Check for Existing Server
```typescript
const lockFile = join(dataDir, '.api-server.lock');

if (existsSync(lockFile)) {
  const lock = JSON.parse(readFileSync(lockFile, 'utf-8'));

  // Verify server is still running
  if (isProcessAlive(lock.pid)) {
    // Test if server responds
    const isResponding = await testServer(`http://localhost:${lock.port}/api/stats`);

    if (isResponding) {
      // Use existing server
      return { port: lock.port, existing: true };
    }
  }

  // Server died, clean up stale lock
  unlinkSync(lockFile);
}
```

### 3. Start New Server (if needed)
```typescript
// Find available port
const port = await findAvailablePort(3001);

// Write lock file BEFORE starting server
writeFileSync(lockFile, JSON.stringify({
  pid: process.pid,
  port,
  projectRoot,
  startedAt: new Date().toISOString(),
  nodeVersion: process.version,
}));

// Start Express server
startApiServer(port, dataDir);
```

### 4. Graceful Shutdown
```typescript
process.on('SIGINT', () => {
  // Remove lock file
  if (existsSync(lockFile)) {
    unlinkSync(lockFile);
  }
  process.exit(0);
});
```

## MCP Tool Integration

### Tools Connect to Discovered API
```typescript
// In each MCP tool (add_stream, update_stream, etc.)
async function callTool(params) {
  // Discover API server for this project
  const apiPort = await discoverApiServer(config.PROJECT_ROOT);

  // Make API call
  const response = await fetch(`http://localhost:${apiPort}/api/streams`, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return response.json();
}
```

## Dashboard Launch

### Project-Aware Dashboard
```bash
# User runs from any agent working on project
$ pnpm run project-dashboard

# Script:
# 1. Detect PROJECT_ROOT from environment
# 2. Check for existing server via lock file
# 3. If server exists: Open browser to that port
# 4. If no server: Start server, write lock, open browser
```

### Multi-Project Support
```bash
# Different agents, same project → Same dashboard
Agent A (stream-01): http://localhost:3001  # egirl-platform
Agent B (stream-02): http://localhost:3001  # egirl-platform (reuses)

# Different projects → Different dashboards
Agent C (other-proj): http://localhost:3002  # other-project
```

## Benefits

1. **Resource Efficiency** - One server per project instead of per-agent
2. **Consistent Data** - All agents see same stream status
3. **No Port Conflicts** - Lock mechanism prevents duplicate servers
4. **Clean Lifecycle** - Proper startup/shutdown with lock cleanup
5. **Multi-Project Support** - Different projects can coexist

## Implementation Checklist

- [ ] Rename directory to `mcp-stream-workflow-status`
- [ ] Add `@3viky/mcp-common` dependency for `getMCPServiceSubdir`
- [ ] Update config to use centralized storage paths
- [ ] Implement server discovery logic
- [ ] Implement lock file management
- [ ] Add graceful shutdown handlers
- [ ] Update MCP tools to discover/connect to API
- [ ] Update dashboard launch script for discovery
- [ ] Test multi-agent scenarios
- [ ] Document port allocation strategy

## Port Allocation Strategy

**Default**: Try ports 3001-3010 in sequence
**Lock file**: Records which port was allocated
**Discovery**: Read lock file to find port
**Cleanup**: Release port when server exits (via lock removal)

This prevents port conflicts when multiple projects are active simultaneously.
