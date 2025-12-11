/**
 * CommitStream Component
 *
 * Shows recent commits from all active worktrees
 */

import styled from 'styled-components';
import { Card, Heading } from '@transftw/lilith-ui';
import { GitCommit } from 'lucide-react';
import type { Commit } from '../types';

const CommitContainer = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const CommitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CommitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const CommitItem = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.borderRadius.sm};
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const CommitIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  color: ${props => props.theme.colors.surface};
`;

const CommitContent = styled.div`
  flex: 1;
`;

const CommitFirstLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StreamNumber = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
`;

const CommitMessage = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const CommitMeta = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  padding-left: ${props => props.theme.spacing.md};
  border-left: 2px solid ${props => props.theme.colors.border};
  margin-top: ${props => props.theme.spacing.xs};
`;

const NoCommits = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

interface CommitStreamProps {
  commits: Commit[];
  limit?: number;
}

export function CommitStream({ commits, limit = 20 }: CommitStreamProps) {
  const displayCommits = commits.slice(0, limit);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours === 0) return 'Just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <CommitContainer>
      <CommitHeader>
        <GitCommit size={20} />
        <Heading level={3}>Recent Commits</Heading>
      </CommitHeader>

      {displayCommits.length === 0 ? (
        <NoCommits>No recent commits</NoCommits>
      ) : (
        <CommitList>
          {displayCommits.map((commit) => (
            <CommitItem key={commit.id}>
              <CommitIcon>
                <GitCommit size={16} />
              </CommitIcon>
              <CommitContent>
                <CommitFirstLine>
                  <StreamNumber>[{commit.streamNumber}]</StreamNumber>
                  <CommitMessage>{commit.message}</CommitMessage>
                </CommitFirstLine>
                <CommitMeta>
                  {commit.filesChanged} file{commit.filesChanged !== 1 ? 's' : ''} changed • {formatTimestamp(commit.timestamp)}
                </CommitMeta>
              </CommitContent>
            </CommitItem>
          ))}
        </CommitList>
      )}
    </CommitContainer>
  );
}
