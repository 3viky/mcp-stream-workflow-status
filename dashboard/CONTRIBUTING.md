# Contributing to Project Status Dashboard

Thank you for contributing to the Project Status Dashboard! This document provides guidelines for contributing to the project.

---

## Code of Conduct

We expect all contributors to follow the egirl-platform code standards and maintain a collaborative, professional environment.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- Familiarity with React, TypeScript, and SQLite

### Setup

1. Clone the repository and navigate to the worktree:
   ```bash
   cd /path/to/egirl-platform-worktrees/stream-0101-status-dashboard-react-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start development server:
   ```bash
   cd product/project-status
   pnpm dev
   ```

---

## Code Style Guidelines

### TypeScript

**Strict mode**: Always enabled. No `any` types.

**Good**:
```typescript
interface StreamProps {
  stream: Stream;
  onClick: (id: string) => void;
}

export const StreamRow: React.FC<StreamProps> = ({ stream, onClick }) => {
  // ...
};
```

**Bad**:
```typescript
// ❌ Missing type annotations
export const StreamRow = ({ stream, onClick }) => {
  // ...
};

// ❌ Using 'any'
function processData(data: any) {
  // ...
}
```

### React Components

**File naming**: `kebab-case.tsx` for files, `PascalCase` for components

**Component structure**:
```typescript
// 1. Imports
import React from 'react';
import { Stream } from '../data/types';

// 2. Interface
interface StreamCardProps {
  stream: Stream;
  onSelect?: (id: string) => void;
}

// 3. Component
export const StreamCard: React.FC<StreamCardProps> = ({ stream, onSelect }) => {
  // 4. Hooks
  const [expanded, setExpanded] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    setExpanded(!expanded);
    onSelect?.(stream.id);
  };

  // 6. Render
  return (
    <Card onClick={handleClick}>
      {/* ... */}
    </Card>
  );
};
```

**Use functional components** (not class components):
```typescript
// ✅ Good
export const MyComponent: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};

// ❌ Bad
export class MyComponent extends React.Component<Props> {
  render() {
    return <div>{this.props.prop}</div>;
  }
}
```

### Styling

**Use styled-components** (not inline styles):

```typescript
// ✅ Good
const Container = styled.div`
  display: flex;
  padding: 16px;
  background-color: ${props => props.theme.colors.background.primary};
`;

// ❌ Bad
<div style={{ display: 'flex', padding: '16px' }}>
```

**Theme-aware styles**:
```typescript
const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
`;
```

### Imports

**Use workspace aliases**:
```typescript
// ✅ Good
import { Button } from '@transftw/egirl-ui';
import { ThemeProvider } from '@transftw/theme-provider';

// ❌ Bad
import { Button } from '../../../packages/egirl-ui/src/components/Button';
```

**Order imports**:
1. React imports
2. Third-party libraries
3. Workspace packages
4. Local components
5. Types
6. Styles

```typescript
import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from '@transftw/egirl-ui';
import { ThemeProvider } from '@transftw/theme-provider';

import { StreamCard } from './StreamCard';
import { CommitCard } from './CommitCard';

import { Stream, Commit } from '../data/types';
```

---

## Testing Requirements

### Unit Tests

**Test all business logic**:
```typescript
// src/data/stream-reader.test.ts
import { describe, it, expect } from 'vitest';
import { StreamStateReader } from './stream-reader';

describe('StreamStateReader', () => {
  it('should parse valid stream state JSON', () => {
    const reader = new StreamStateReader('./fixtures/valid-state.json');
    const streams = reader.read();

    expect(streams).toHaveLength(3);
    expect(streams[0].id).toBe('stream-0100-fix-build-issues');
  });

  it('should handle missing file gracefully', () => {
    const reader = new StreamStateReader('./non-existent.json');
    const streams = reader.read();

    expect(streams).toEqual([]);
  });
});
```

**Test coverage**: Aim for 80%+ coverage on:
- Data layer (database, readers, scanners)
- Business logic (filtering, sorting, searching)
- Utility functions

**Run tests**:
```bash
pnpm test
pnpm test:coverage
```

### Integration Tests

**Test data flow**:
```typescript
// src/data/worktree-scanner.test.ts
describe('WorktreeScanner', () => {
  it('should discover all worktrees', () => {
    const scanner = new WorktreeScanner('./fixtures/worktrees');
    const worktrees = scanner.discoverWorktrees();

    expect(worktrees).toContain('stream-0100-name');
    expect(worktrees).toContain('stream-0119-name');
  });

  it('should parse git log output correctly', () => {
    const scanner = new WorktreeScanner('./fixtures/worktrees');
    const commits = scanner.getCommitsForWorktree('stream-0100-name');

    expect(commits[0].commitHash).toMatch(/^[a-f0-9]{40}$/);
    expect(commits[0].author).toBe('Claude Sonnet');
  });
});
```

### E2E Tests (Playwright)

**Test user workflows**:
```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('should display active streams', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.getByText('Active Streams')).toBeVisible();
  await expect(page.getByText('stream-0100')).toBeVisible();
});

test('should filter by status', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.getByRole('combobox', { name: 'Status' }).selectOption('in_progress');

  await expect(page.getByText('stream-0119')).toBeVisible();
  await expect(page.getByText('stream-0100')).not.toBeVisible();
});
```

**Run E2E tests**:
```bash
pnpm test:e2e
```

---

## Pull Request Process

### Before Submitting

1. **Run all checks**:
   ```bash
   pnpm type-check
   pnpm lint
   pnpm test
   pnpm build
   ```

2. **Verify functionality**:
   - Test in development mode (`pnpm dev`)
   - Test production build (`pnpm preview`)
   - Test database rebuild (`pnpm rebuild-dashboard`)

3. **Update documentation** if needed:
   - README.md (user-facing changes)
   - ARCHITECTURE.md (technical changes)
   - Code comments (complex logic)

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <description>

<body>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build process, dependencies

**Examples**:
```bash
feat(dashboard): Add real-time commit stream view

Implements WebSocket connection for live commit updates.
Replaces 2-minute polling with instant updates.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```bash
fix(scanner): Handle missing worktree gracefully

Previously crashed when worktree directory was deleted.
Now logs warning and continues scanning.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### PR Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript strict mode passes
- [ ] All tests pass
- [ ] Added tests for new features
- [ ] Documentation updated
- [ ] Build succeeds
- [ ] No console errors/warnings
- [ ] Tested in both dev and production modes

### Review Process

1. Create PR to stream branch (`stream-0101-status-dashboard-react-app`)
2. Request review from maintainer
3. Address review feedback
4. Merge when approved

---

## Adding New Features

### Example: Add Filtering by Stream Number

**Step 1**: Update types
```typescript
// src/data/types.ts
export interface StreamFilter {
  status?: StreamStatus;
  category?: StreamCategory;
  priority?: StreamPriority;
  streamNumber?: string; // New filter
}
```

**Step 2**: Update UI component
```typescript
// src/components/FilterBar.tsx
export const FilterBar: React.FC<Props> = ({ onFilterChange }) => {
  const [streamNumber, setStreamNumber] = useState('');

  return (
    <FilterContainer>
      {/* ... existing filters */}
      <Input
        placeholder="Stream Number (e.g., 0100)"
        value={streamNumber}
        onChange={e => {
          setStreamNumber(e.target.value);
          onFilterChange({ streamNumber: e.target.value });
        }}
      />
    </FilterContainer>
  );
};
```

**Step 3**: Update filtering logic
```typescript
// src/hooks/useStreams.ts
export function useStreams(filter: StreamFilter) {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    let filtered = db.getStreams(filter.status);

    if (filter.streamNumber) {
      filtered = filtered.filter(s =>
        s.streamNumber.includes(filter.streamNumber)
      );
    }

    setStreams(filtered);
  }, [filter]);

  return { streams };
}
```

**Step 4**: Add tests
```typescript
// src/hooks/useStreams.test.ts
it('should filter by stream number', () => {
  const { result } = renderHook(() =>
    useStreams({ streamNumber: '0100' })
  );

  expect(result.current.streams).toHaveLength(1);
  expect(result.current.streams[0].streamNumber).toBe('0100');
});
```

**Step 5**: Update documentation
```markdown
<!-- README.md -->
### Filtering

Filter streams by:
- Status (Ready, In Progress, Blocked, etc.)
- Category (frontend, backend, infrastructure, etc.)
- Priority (critical, high, medium, low)
- **Stream Number** (e.g., "0100", "0119")
```

**Step 6**: Submit PR
```bash
git add .
git commit -m "feat(filters): Add stream number filtering

Allows users to filter by stream number.
Supports partial matches (e.g., '01' matches '0100').

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Common Tasks

### Updating SQLite Schema

1. Modify `server/db/schema.sql`
2. Update TypeScript interfaces in `src/data/types.ts`
3. Update database client in `src/data/database.ts`
4. Create migration script (if needed)
5. Test rebuild: `pnpm rebuild-dashboard`

### Adding UI Component

1. Create component file: `src/components/MyComponent.tsx`
2. Define props interface
3. Use styled-components for styling
4. Import from `@transftw/egirl-ui` where possible
5. Add unit tests: `src/components/MyComponent.test.tsx`

### Optimizing Performance

1. Identify bottleneck (React DevTools Profiler)
2. Add memoization: `React.memo`, `useMemo`, `useCallback`
3. Optimize database queries (indexes, LIMIT)
4. Consider virtual scrolling for large lists
5. Measure improvement (Lighthouse, Profiler)

---

## Resources

**Internal**:
- [Platform Code Standards](../../.claude/instructions/code-style.md)
- [Testing Standards](../../.claude/instructions/testing-standards.md)
- [Roadmap Matrix](../roadmap_matrix/) (reference implementation)

**External**:
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/wiki/API)
- [Vite Guide](https://vitejs.dev/guide/)
- [Styled Components Docs](https://styled-components.com/docs)

---

## Questions?

For questions or issues:

1. Check existing documentation (README.md, ARCHITECTURE.md)
2. Review similar implementations (roadmap_matrix)
3. Ask in project chat/forum
4. Open GitHub issue for bugs

---

**Last Updated**: 2025-12-11
**Stream**: stream-0101-status-dashboard-react-app
