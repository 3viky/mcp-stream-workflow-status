import { useState, useCallback, useEffect } from 'react'

import type { RankingExplanation, RankingTip } from '../components/ranking'

export interface UseRankingOptions {
  listingId: string
  apiClient?: {
    get: <T>(url: string) => Promise<{ data: T }>
  }
  autoFetch?: boolean
}

export interface UseRankingResult {
  explanation: RankingExplanation | null
  tips: RankingTip[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRanking({
  listingId,
  apiClient,
  autoFetch = true,
}: UseRankingOptions): UseRankingResult {
  const [explanation, setExplanation] = useState<RankingExplanation | null>(null)
  const [tips, setTips] = useState<RankingTip[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRankingData = useCallback(async () => {
    if (!listingId || !apiClient) {
      setError('Missing listing ID or API client')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch both endpoints in parallel
      const [explanationResponse, tipsResponse] = await Promise.all([
        apiClient.get<RankingExplanation>(`/search/ranking/${listingId}`),
        apiClient.get<{ listingId: string; tips: RankingTip[]; generatedAt: string }>(
          `/search/ranking/${listingId}/tips`,
        ),
      ])

      setExplanation(explanationResponse.data)
      setTips(tipsResponse.data.tips)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch ranking data'
      setError(message)
      setExplanation(null)
      setTips([])
    } finally {
      setIsLoading(false)
    }
  }, [listingId, apiClient])

  useEffect(() => {
    if (autoFetch && listingId && apiClient) {
      fetchRankingData()
    }
  }, [autoFetch, listingId, apiClient, fetchRankingData])

  return {
    explanation,
    tips,
    isLoading,
    error,
    refetch: fetchRankingData,
  }
}

/**
 * Mock hook for testing/storybook without an API
 */
export function useRankingMock(): UseRankingResult {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return {
    explanation: {
      searchScore: 0.72,
      breakdown: {
        rating: { value: 0.85, weight: 0.4, contribution: 0.34 },
        ctr: { value: 0.45, weight: 0.25, contribution: 0.1125 },
        activity: { value: 0.7, weight: 0.15, contribution: 0.105 },
        randomness: { value: 0.5, weight: 0.15, contribution: 0.075 },
        newness: { value: 0.2, weight: 0.05, contribution: 0.01 },
      },
      reviewStats: {
        totalReviews: 42,
        averageRating: 4.25,
      },
    },
    tips: [
      {
        factor: 'ctr',
        priority: 'high',
        tip: 'Your profile needs more appeal. First impressions matter.',
        actionItems: [
          'Update your profile photo to a high-quality, recent image',
          'Rewrite your headline to be more engaging and specific',
          'Add more photos showing different aspects of your services',
        ],
        potentialImprovement: 0.14,
        currentValue: 0.45,
        targetValue: 0.8,
      },
      {
        factor: 'activity',
        priority: 'medium',
        tip: 'Increase your responsiveness to rank higher in search results.',
        actionItems: [
          'Aim to respond to inquiries within 15-30 minutes',
          'Set up auto-responses for when you are unavailable',
          'Check messages multiple times per day',
        ],
        potentialImprovement: 0.045,
        currentValue: 0.7,
        targetValue: 0.8,
      },
    ],
    isLoading,
    error: null,
    refetch: async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    },
  }
}
