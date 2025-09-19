// Types for Harmony EHR authentication
export interface AccessTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthApiResponse {
  success: boolean
  data?: AccessTokenResponse
  error?: string
  code?: string
  details?: string
}

export interface AuthError extends Error {
  code?: string
  status?: number
}

// Auth service class
export class AuthService {
  private static instance: AuthService
  private tokenCache: { token: string; expiresAt: number } | null = null

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Get access token from Harmony EHR API
   * Handles caching and automatic refresh
   */
  async getAccessToken(forceRefresh: boolean = false): Promise<string> {
    // Check if we have a valid cached token
    if (!forceRefresh && this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token
    }

    try {
      const response = await fetch('/api/auth/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData: AuthApiResponse = await response.json()
        throw new Error(errorData.error || 'Failed to get access token')
      }

      const data: AuthApiResponse = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Invalid response from auth service')
      }

      // Cache the token with 5-minute buffer before expiry
      const expiresAt = Date.now() + (data.data.expires_in - 300) * 1000
      this.tokenCache = {
        token: data.data.access_token,
        expiresAt
      }

      return data.data.access_token

    } catch (error) {
      console.error('Auth service error:', error)
      throw error
    }
  }

  /**
   * Clear cached token (useful for logout or when token is invalid)
   */
  clearToken(): void {
    this.tokenCache = null
  }

  /**
   * Check if we have a valid cached token
   */
  hasValidToken(): boolean {
    return this.tokenCache !== null && Date.now() < this.tokenCache.expiresAt
  }

  /**
   * Get token info for debugging
   */
  getTokenInfo(): { hasToken: boolean; expiresAt?: number; timeUntilExpiry?: number } {
    if (!this.tokenCache) {
      return { hasToken: false }
    }

    const timeUntilExpiry = this.tokenCache.expiresAt - Date.now()
    return {
      hasToken: true,
      expiresAt: this.tokenCache.expiresAt,
      timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : 0
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()

// Utility function for making authenticated requests to Harmony EHR
export async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await authService.getAccessToken()
  
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
    const freshToken = await authService.getAccessToken(true)
    
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
}
