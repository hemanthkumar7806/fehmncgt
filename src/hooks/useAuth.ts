import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/lib/auth'

interface UseAuthReturn {
  token: string | null
  isLoading: boolean
  error: string | null
  getToken: (forceRefresh?: boolean) => Promise<string | null>
  clearToken: () => void
  hasValidToken: boolean
  tokenInfo: {
    hasToken: boolean
    expiresAt?: number
    timeUntilExpiry?: number
  }
}

/**
 * React hook for managing Harmony EHR authentication
 * Provides token management, loading states, and error handling
 */
export function useAuth(): UseAuthReturn {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get token info for debugging
  const tokenInfo = authService.getTokenInfo()

  // Check if we have a valid token
  const hasValidToken = authService.hasValidToken()

  // Get access token
  const getToken = useCallback(async (forceRefresh: boolean = false): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const accessToken = await authService.getAccessToken(forceRefresh)
      setToken(accessToken)
      return accessToken
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get access token'
      setError(errorMessage)
      console.error('useAuth getToken error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Clear token
  const clearToken = useCallback(() => {
    authService.clearToken()
    setToken(null)
    setError(null)
  }, [])

  // Auto-fetch token on mount if we don't have one
  useEffect(() => {
    if (!hasValidToken && !isLoading) {
      getToken()
    }
  }, [hasValidToken, isLoading, getToken])

  // Update token state when auth service state changes
  useEffect(() => {
    if (hasValidToken && tokenInfo.hasToken) {
      // We have a valid token, but we need to get it from the service
      authService.getAccessToken().then((t) => {
        if (t) setToken(t)
      }).catch((err) => {
        console.error('Error getting cached token:', err)
      })
    } else if (!hasValidToken) {
      setToken(null)
    }
  }, [hasValidToken, tokenInfo.hasToken])

  return {
    token,
    isLoading,
    error,
    getToken,
    clearToken,
    hasValidToken,
    tokenInfo,
  }
}

/**
 * Hook for making authenticated requests to Harmony EHR
 * Automatically handles token refresh on 401 errors
 */
export function useAuthenticatedRequest() {
  const { getToken, clearToken } = useAuth()

  const makeRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('No valid token available')
      }

      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      // If token is invalid, try once more with a fresh token
      if (response.status === 401) {
        console.log('Token expired, refreshing...')
        const freshToken = await getToken(true)
        
        if (!freshToken) {
          throw new Error('Failed to refresh token')
        }

        return fetch(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
          },
        })
      }

      return response
    } catch (error) {
      console.error('Authenticated request error:', error)
      throw error
    }
  }, [getToken])

  return { makeRequest, clearToken }
}
