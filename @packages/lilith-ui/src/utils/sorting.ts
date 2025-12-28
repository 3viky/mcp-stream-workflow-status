/**
 * Sorting Utilities for DataTable components
 *
 * Provides reusable sort functions that can be composed together
 * using the sortBy prop on DataTable/StickyDataTable.
 */

import type { SortFn } from '../components/data/StickyDataTable'

/**
 * Create a sort function that sorts by a specific property
 */
export function sortByProperty<T, K extends keyof T>(
  property: K,
  order: 'asc' | 'desc' = 'asc'
): SortFn<T> {
  return (a, b) => {
    const aVal = a[property]
    const bVal = b[property]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  }
}

/**
 * Create a sort function using a custom comparator
 */
export function sortByComparator<T>(
  comparator: (item: T) => number | string
): SortFn<T> {
  return (a, b) => {
    const aVal = comparator(a)
    const bVal = comparator(b)

    if (aVal < bVal) return -1
    if (aVal > bVal) return 1
    return 0
  }
}

/**
 * Create a sort function with custom logic
 */
export function sortByFn<T>(fn: (a: T, b: T) => number): SortFn<T> {
  return fn
}

/**
 * Reverse the order of a sort function
 */
export function reverse<T>(sortFn: SortFn<T>): SortFn<T> {
  return (a, b) => -sortFn(a, b)
}

/**
 * Combine multiple sort functions (applies in order until one returns non-zero)
 */
export function combineSort<T>(...sortFns: SortFn<T>[]): SortFn<T> {
  return (a, b) => {
    for (const sortFn of sortFns) {
      const result = sortFn(a, b)
      if (result !== 0) return result
    }
    return 0
  }
}
