/**
 * FilterBar Component
 *
 * Filter controls for status, category, priority, and search
 */

import styled from 'styled-components';
import { Select, Input } from '@transftw/lilith-ui';
import { Search } from 'lucide-react';
import type { FilterOptions, StreamStatus, StreamCategory, StreamPriority } from '../types';

const FilterContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 2;
  min-width: 250px;

  svg {
    position: absolute;
    left: ${props => props.theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textSecondary};
    pointer-events: none;
  }

  input {
    padding-left: 2.5rem;
  }
`;

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'ready', label: 'Ready' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'completed', label: 'Completed' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'refactoring', label: 'Refactoring' },
  { value: 'testing', label: 'Testing' },
  { value: 'design', label: 'Design' },
  { value: 'deployment', label: 'Deployment' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <FilterContainer>
      <FilterGroup>
        <FilterLabel>Status:</FilterLabel>
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as StreamStatus | 'all' })}
          options={statusOptions}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Category:</FilterLabel>
        <Select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value as StreamCategory | 'all' })}
          options={categoryOptions}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Priority:</FilterLabel>
        <Select
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as StreamPriority | 'all' })}
          options={priorityOptions}
        />
      </FilterGroup>

      <SearchWrapper>
        <Search size={18} />
        <Input
          type="text"
          placeholder="Search streams by title..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </SearchWrapper>
    </FilterContainer>
  );
}
