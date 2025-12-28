# Multi-Agent Architecture Implementation Plan

## Status: IN PROGRESS

### Phase 1: Foundation ✅ COMPLETE
- [x] Rename directory to `mcp-stream-workflow-status`
- [x] Update package name to `@3viky/mcp-stream-workflow-status`
- [x] Add `@3viky/mcp-common` dependency
- [x] Create `src/utils/server-discovery.ts` with lock management
- [x] Document architecture in `ARCHITECTURE.md`

### Phase 2: Config Refactoring 🔄 IN PROGRESS
- [ ] Update `src/config.ts` to use `getMCPServiceSubdir()`
- [ ] Change `DATABASE_PATH` to use `~/.cache/mcp-services/stream-workflow-status/projects/{project}/streams.db`
- [ ] Add `LOCK_FILE_PATH` configuration
- [ ] Remove hardcoded paths, make everything project-aware

### Phase 3: Server Startup 🔜 NEXT
- [ ] Update `src/api/server.ts` to use server discovery
- [ ] Implement lock file creation on startup
- [ ] Add graceful shutdown to cleanup locks
- [ ] Test server reuse across multiple MCP instances

### Phase 4: Dashboard Launch 📋 TODO
- [ ] Update `scripts/launch-dashboard.js` to discover existing servers
- [ ] Add logic to read lock file and connect to existing port
- [ ] Only start new server if no existing server found
- [ ] Test with multiple agents on same project

### Phase 5: MCP Tool Integration 🔧 TODO
- [ ] Add API client utility to `src/utils/api-client.ts`
- [ ] Update all tools to use API client (not direct database)
- [ ] Tools should discover API server via lock file
- [ ] Fallback to direct database if API not available

### Phase 6: Testing & Validation ✓ TODO
- [ ] Test: Single agent, single project
- [ ] Test: Multiple agents, same project (should share server)
- [ ] Test: Multiple agents, different projects (separate servers)
- [ ] Test: Stale lock cleanup when server dies
- [ ] Test: Port allocation when default port busy

## Critical Path Dependencies

```
Config Refactoring
    ↓
Server Startup Changes
    ↓
Dashboard Launch Updates
    ↓
MCP Tool Integration
    ↓
Testing
```

## Breaking Changes

⚠️ **Database Location Changes**
- Old: `{package-dir}/data/streams.db`
- New: `~/.cache/mcp-services/stream-workflow-status/projects/{project}/streams.db`

⚠️ **Environment Variables**
- `DATABASE_PATH` - Now optional, auto-calculated from PROJECT_ROOT
- `API_PORT` - Now optional, auto-discovered from lock file
- `PROJECT_ROOT` - **Required** for multi-project support

## Migration Strategy

1. **Backwards Compatibility**: Keep old DATABASE_PATH env var working for now
2. **Auto-Migration**: Move existing `data/streams.db` to new location on first run
3. **Documentation**: Update README with new architecture

## Next Immediate Action

**Update `src/config.ts`** to use centralized storage pattern from `mcp-stream-workflow`.
