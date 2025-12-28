/**
 * egirl-ui Hooks
 *
 * Custom React hooks for animations and interactions.
 * These hooks are theme-agnostic and work with any theme.
 */

export { useScrollTrigger } from './useScrollTrigger.js';
export type { UseScrollTriggerOptions } from './useScrollTrigger.js';

export { useParallax } from './useParallax.js';
export type { UseParallaxOptions } from './useParallax.js';

export { useSmoothScroll } from './useSmoothScroll.js';
export type { UseSmoothScrollOptions } from './useSmoothScroll.js';

export { useRanking, useRankingMock } from './useRanking';
export type { UseRankingOptions, UseRankingResult } from './useRanking';

export { useAnalytics, useAnalyticsMock } from './useAnalytics';
export type {
  UseAnalyticsOptions,
  UseAnalyticsResult,
  ListingPerformance,
  RankingInsights,
  ReviewInsights,
  ClientDashboard,
} from './useAnalytics';
