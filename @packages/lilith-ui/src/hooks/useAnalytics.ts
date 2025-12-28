import { useState, useEffect, useCallback } from 'react'

export interface ListingPerformance {
  impressions: number
  clicks: number
  ctr: number
  avgPosition: number
  topPositionCount: number
  trends: {
    impressionsTrend: number
    ctrTrend: number
    positionTrend: number
  }
}

export interface RankingInsights {
  currentRank: number | null
  percentile: number | null
  totalScore: number
  platformAverage: number
  breakdown: {
    rating: { value: number; weight: number; contribution: number }
    ctr: { value: number; weight: number; contribution: number }
    activity: { value: number; weight: number; contribution: number }
    randomness: { value: number; weight: number; contribution: number }
    newness: { value: number; weight: number; contribution: number }
  }
  trends: {
    scoreTrend: number
    rankTrend: number
  }
  suggestions: Array<{
    factor: string
    tip: string
    potentialImprovement: number
    priority: 'high' | 'medium' | 'low'
  }>
  historicalScores: Array<{
    date: string
    score: number
    rank: number | null
  }>
}

export interface ReviewInsights {
  providerReviews: {
    averageRating: number
    totalReviews: number
    verifiedReviews: number
    ratingDistribution: { [rating: number]: number }
    recentTrend: 'up' | 'down' | 'stable'
    topKeywords: string[]
  }
  customerReviews?: {
    averageRating: number
    totalReviews: number
    wouldWorkAgainRate: number
  }
}

export interface ClientDashboard {
  profileViews: number
  searchAppearances: number
  messagesReceived: number
  bookingRequests: number
  responseRate: number
  profileCompleteness: number
  trends: {
    viewsTrend: number
    messagesTrend: number
  }
  suggestions: Array<{
    type: string
    message: string
    priority: 'high' | 'medium' | 'low'
  }>
}

interface ApiResponse<T = unknown> {
  data: T
}

export interface ApiClient {
  get: <T = unknown>(url: string) => Promise<ApiResponse<T>>
  post: <T = unknown>(url: string, data?: unknown) => Promise<ApiResponse<T>>
}

export interface UseAnalyticsOptions {
  listingId?: string
  apiClient: ApiClient
  autoRefresh?: boolean
  refreshInterval?: number
}

export interface UseAnalyticsResult {
  listingPerformance: ListingPerformance | null
  rankingInsights: RankingInsights | null
  reviewInsights: ReviewInsights | null
  clientDashboard: ClientDashboard | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  trackImpression: (position: number) => Promise<void>
  trackClick: () => Promise<void>
}

export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsResult {
  const { listingId, apiClient, autoRefresh = false, refreshInterval = 300000 } = options

  const [listingPerformance, setListingPerformance] = useState<ListingPerformance | null>(null)
  const [rankingInsights, setRankingInsights] = useState<RankingInsights | null>(null)
  const [reviewInsights, setReviewInsights] = useState<ReviewInsights | null>(null)
  const [clientDashboard, setClientDashboard] = useState<ClientDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const promises: Promise<ApiResponse<unknown>>[] = []

      if (listingId) {
        promises.push(
          apiClient.get(`/analytics/listing-performance/${listingId}`),
          apiClient.get(`/analytics/ranking-insights/${listingId}`),
        )
      }

      promises.push(
        apiClient.get('/analytics/review-insights'),
        apiClient.get('/analytics/client-dashboard'),
      )

      const results = await Promise.allSettled(promises)

      if (listingId) {
        if (results[0].status === 'fulfilled') {
          setListingPerformance(results[0].value.data as ListingPerformance)
        }
        if (results[1].status === 'fulfilled') {
          setRankingInsights(results[1].value.data as RankingInsights)
        }
        if (results[2].status === 'fulfilled') {
          setReviewInsights(results[2].value.data as ReviewInsights)
        }
        if (results[3].status === 'fulfilled') {
          setClientDashboard(results[3].value.data as ClientDashboard)
        }
      } else {
        if (results[0].status === 'fulfilled') {
          setReviewInsights(results[0].value.data as ReviewInsights)
        }
        if (results[1].status === 'fulfilled') {
          setClientDashboard(results[1].value.data as ClientDashboard)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
    } finally {
      setIsLoading(false)
    }
  }, [listingId, apiClient])

  const trackImpression = useCallback(
    async (position: number) => {
      if (!listingId) return

      try {
        await apiClient.post('/analytics/track/impression', {
          listingId,
          position,
        })
      } catch (err) {
        console.error('Failed to track impression:', err)
      }
    },
    [listingId, apiClient],
  )

  const trackClick = useCallback(async () => {
    if (!listingId) return

    try {
      await apiClient.post('/analytics/track/click', { listingId })
    } catch (err) {
      console.error('Failed to track click:', err)
    }
  }, [listingId, apiClient])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchAnalytics, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchAnalytics])

  return {
    listingPerformance,
    rankingInsights,
    reviewInsights,
    clientDashboard,
    isLoading,
    error,
    refetch: fetchAnalytics,
    trackImpression,
    trackClick,
  }
}

export function useAnalyticsMock(): UseAnalyticsResult {
  return {
    listingPerformance: {
      impressions: 1250,
      clicks: 87,
      ctr: 0.0696,
      avgPosition: 4.2,
      topPositionCount: 15,
      trends: {
        impressionsTrend: 12.5,
        ctrTrend: 5.2,
        positionTrend: -8.3,
      },
    },
    rankingInsights: {
      currentRank: 12,
      percentile: 85,
      totalScore: 0.72,
      platformAverage: 0.58,
      breakdown: {
        rating: { value: 0.88, weight: 0.4, contribution: 0.352 },
        ctr: { value: 0.07, weight: 0.25, contribution: 0.0175 },
        activity: { value: 0.85, weight: 0.15, contribution: 0.1275 },
        randomness: { value: 0.5, weight: 0.15, contribution: 0.075 },
        newness: { value: 0.3, weight: 0.05, contribution: 0.015 },
      },
      trends: { scoreTrend: 8.5, rankTrend: 15.2 },
      suggestions: [
        {
          factor: 'ctr',
          tip: 'Optimize your profile headline and photos',
          potentialImprovement: 0.03,
          priority: 'high',
        },
        {
          factor: 'activity',
          tip: 'Log in more frequently',
          potentialImprovement: 0.02,
          priority: 'medium',
        },
      ],
      historicalScores: [
        { date: '2025-12-01', score: 0.68, rank: 15 },
        { date: '2025-12-02', score: 0.69, rank: 14 },
        { date: '2025-12-03', score: 0.70, rank: 13 },
        { date: '2025-12-04', score: 0.71, rank: 12 },
        { date: '2025-12-05', score: 0.72, rank: 12 },
      ],
    },
    reviewInsights: {
      providerReviews: {
        averageRating: 4.4,
        totalReviews: 47,
        verifiedReviews: 38,
        ratingDistribution: { 5: 25, 4: 15, 3: 5, 2: 1, 1: 1 },
        recentTrend: 'up',
        topKeywords: ['professional', 'friendly', 'punctual'],
      },
      customerReviews: {
        averageRating: 4.6,
        totalReviews: 23,
        wouldWorkAgainRate: 0.91,
      },
    },
    clientDashboard: {
      profileViews: 342,
      searchAppearances: 1250,
      messagesReceived: 28,
      bookingRequests: 12,
      responseRate: 0.85,
      profileCompleteness: 0.75,
      trends: { viewsTrend: 15.3, messagesTrend: 8.7 },
      suggestions: [
        {
          type: 'profile',
          message: 'Complete your profile to increase visibility',
          priority: 'high',
        },
      ],
    },
    isLoading: false,
    error: null,
    refetch: async () => {},
    trackImpression: async () => {},
    trackClick: async () => {},
  }
}
