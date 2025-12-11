# Stream Workflow Status API

REST API for accessing stream workflow status and commit data.

## Server Configuration

The API server is configured via environment variables:

```bash
API_ENABLED=true    # Enable/disable API server
API_PORT=3001       # Port to listen on (default: 3001)
```

## Starting the Server

The API server starts automatically when the MCP server starts if `API_ENABLED=true`:

```bash
# Start the server
pnpm build
node dist/server.js

# Or for development
pnpm dev
```

Server will be available at: `http://localhost:3001`

## Endpoints

### GET /api/stats

Get quick dashboard statistics.

**Response:**
```json
{
  "activeStreams": 3,
  "inProgress": 5,
  "blocked": 1,
  "readyToStart": 2,
  "completedToday": 4,
  "totalCommits": 142,
  "commitsToday": 8
}
```

**Example:**
```bash
curl http://localhost:3001/api/stats
```

---

### GET /api/streams

List all streams with optional filters.

**Query Parameters:**
- `status` (optional): Filter by stream status
  - Values: `initializing`, `active`, `blocked`, `paused`, `completed`, `archived`
- `category` (optional): Filter by stream category
  - Values: `frontend`, `backend`, `infrastructure`, `testing`, `documentation`, `refactoring`
- `priority` (optional): Filter by priority
  - Values: `critical`, `high`, `medium`, `low`

**Response:**
```json
{
  "streams": [
    {
      "id": "stream-0100",
      "streamNumber": "0100",
      "title": "Fix pre-existing build issues",
      "category": "infrastructure",
      "priority": "critical",
      "status": "active",
      "progress": 45,
      "currentPhase": 2,
      "worktreePath": "/path/to/worktree",
      "branch": "stream-0100-fix-issues",
      "createdAt": "2025-12-11T10:00:00Z",
      "updatedAt": "2025-12-11T12:30:00Z",
      "phases": ["Phase 1", "Phase 2", "Phase 3"]
    }
  ],
  "total": 1
}
```

**Examples:**
```bash
# Get all streams
curl http://localhost:3001/api/streams

# Get active streams only
curl http://localhost:3001/api/streams?status=active

# Get high priority backend streams
curl http://localhost:3001/api/streams?category=backend&priority=high
```

---

### GET /api/streams/:id

Get a single stream by ID.

**Path Parameters:**
- `id`: Stream identifier (e.g., `stream-0100`)

**Response:**
```json
{
  "id": "stream-0100",
  "streamNumber": "0100",
  "title": "Fix pre-existing build issues",
  "category": "infrastructure",
  "priority": "critical",
  "status": "active",
  "progress": 45,
  "currentPhase": 2,
  "worktreePath": "/path/to/worktree",
  "branch": "stream-0100-fix-issues",
  "createdAt": "2025-12-11T10:00:00Z",
  "updatedAt": "2025-12-11T12:30:00Z",
  "phases": ["Phase 1", "Phase 2", "Phase 3"]
}
```

**Example:**
```bash
curl http://localhost:3001/api/streams/stream-0100
```

---

### GET /api/commits

Get recent commits with optional filtering.

**Query Parameters:**
- `limit` (optional): Maximum number of commits to return (default: 20)
- `streamId` (optional): Filter commits by stream ID

**Response:**
```json
{
  "commits": [
    {
      "id": 1,
      "streamId": "stream-0100",
      "commitHash": "abc123def456",
      "message": "feat(api): Implement Express REST API server",
      "author": "Developer <dev@example.com>",
      "filesChanged": 8,
      "timestamp": "2025-12-11T12:30:00Z"
    }
  ],
  "total": 1
}
```

**Examples:**
```bash
# Get 20 most recent commits
curl http://localhost:3001/api/commits

# Get 5 most recent commits
curl http://localhost:3001/api/commits?limit=5

# Get commits for specific stream
curl http://localhost:3001/api/commits?streamId=stream-0100

# Get 10 commits for specific stream
curl http://localhost:3001/api/commits?streamId=stream-0100&limit=10
```

---

## Error Responses

All endpoints return standard error responses on failure:

```json
{
  "error": "Failed to fetch streams",
  "details": "Database connection failed"
}
```

**HTTP Status Codes:**
- `200` - Success
- `404` - Resource not found (streams/:id only)
- `500` - Server error

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

## Dashboard

The API server also serves the React dashboard as static files:

```
http://localhost:3001/
```

All non-API routes fall back to serving the dashboard SPA (Single Page Application).

---

## Testing

Test the API using the provided test script:

```bash
./test-api.sh
```

Or manually with curl:

```bash
# Health check via stats
curl http://localhost:3001/api/stats | jq '.'

# List all streams
curl http://localhost:3001/api/streams | jq '.streams | length'

# Get recent commits
curl http://localhost:3001/api/commits?limit=10 | jq '.commits[0]'
```
