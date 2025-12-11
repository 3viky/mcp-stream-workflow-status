/**
 * Mock data for initial development
 * Will be replaced with real data from .stream-state.json in Phase 1
 */

import type { Stream, Commit } from './types';

export const mockStreams: Stream[] = [
  {
    id: 'stream-0100-fix-pre-existing-build-issues',
    streamNumber: '0100',
    title: 'Fix Pre-Existing Build Issues',
    status: 'ready',
    category: 'refactoring',
    priority: 'medium',
    createdAt: '2025-12-11T10:00:00Z',
    updatedAt: '2025-12-11T10:00:00Z',
    recentActivity: {
      lastCommit: undefined,
      filesChanged: 0,
    },
  },
  {
    id: 'stream-0119-webmap-implementation',
    streamNumber: '0119',
    title: 'WebMap Implementation',
    status: 'in-progress',
    category: 'frontend',
    priority: 'high',
    createdAt: '2025-12-09T14:00:00Z',
    updatedAt: '2025-12-11T09:00:00Z',
    recentActivity: {
      lastCommit: 'feat(webmap): Add config generator tests',
      lastCommitTime: '2 hours ago',
      filesChanged: 23,
    },
  },
  {
    id: 'stream-0122-roadmap-update',
    streamNumber: '0122',
    title: 'Roadmap Update',
    status: 'in-progress',
    category: 'documentation',
    priority: 'medium',
    createdAt: '2025-12-10T08:00:00Z',
    updatedAt: '2025-12-11T06:00:00Z',
    recentActivity: {
      lastCommit: 'docs(roadmap): Update milestone architecture',
      lastCommitTime: '5 hours ago',
      filesChanged: 4,
    },
  },
  {
    id: 'stream-0101-status-dashboard-react-app',
    streamNumber: '0101',
    title: 'Status Dashboard React App',
    status: 'in-progress',
    category: 'frontend',
    priority: 'high',
    createdAt: '2025-12-11T11:00:00Z',
    updatedAt: '2025-12-11T12:00:00Z',
    recentActivity: {
      lastCommit: 'feat(dashboard): Initialize React scaffold',
      lastCommitTime: 'Just now',
      filesChanged: 8,
    },
  },
  {
    id: 'stream-0118-lilith-content-strategy',
    streamNumber: '0118',
    title: 'Lilith Content Strategy',
    status: 'blocked',
    category: 'documentation',
    priority: 'medium',
    createdAt: '2025-12-07T10:00:00Z',
    updatedAt: '2025-12-10T14:00:00Z',
    recentActivity: {
      lastCommit: 'docs(lilith): Add persona research',
      lastCommitTime: '1 day ago',
      filesChanged: 12,
    },
  },
];

export const mockCommits: Commit[] = [
  {
    id: '1',
    streamId: 'stream-0119-webmap-implementation',
    streamNumber: '0119',
    hash: 'fbe0995c0',
    message: 'feat(webmap): Add config generator tests',
    author: 'Claude Sonnet 4.5',
    timestamp: '2025-12-11T09:00:00Z',
    filesChanged: 23,
  },
  {
    id: '2',
    streamId: 'stream-0122-roadmap-update',
    streamNumber: '0122',
    hash: '5ed74ff16',
    message: 'docs(roadmap): Update milestone architecture',
    author: 'Claude Sonnet 4.5',
    timestamp: '2025-12-11T06:00:00Z',
    filesChanged: 4,
  },
  {
    id: '3',
    streamId: 'stream-0101-status-dashboard-react-app',
    streamNumber: '0101',
    hash: '38bdcf256',
    message: 'feat(dashboard): Initialize React scaffold',
    author: 'Claude Sonnet 4.5',
    timestamp: '2025-12-11T12:00:00Z',
    filesChanged: 8,
  },
  {
    id: '4',
    streamId: 'stream-0118-lilith-content-strategy',
    streamNumber: '0118',
    hash: '47e84ce77',
    message: 'docs(lilith): Add persona research',
    author: 'Claude Sonnet 4.5',
    timestamp: '2025-12-10T14:00:00Z',
    filesChanged: 12,
  },
];
