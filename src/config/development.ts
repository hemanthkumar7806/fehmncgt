// Development configuration
// This file manages development-specific settings including mock data usage

/**
 * Check if we should use mock data instead of real API calls
 * Set NEXT_PUBLIC_USE_MOCK_DATA=true in your .env.local file to enable mock mode
 */
export const shouldUseMockData = (): boolean => {
  // Check environment variable first
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return true
  }
  
  // Default to false in production, can be toggled in development
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'
}

/**
 * Get the current development mode
 */
export const getDevelopmentMode = () => {
  return {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    useMockData: shouldUseMockData(),
    environment: process.env.NODE_ENV || 'development'
  }
}

/**
 * Development utilities
 */
export const devUtils = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] ${message}`, data || '')
    }
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[DEV WARNING] ${message}`, data || '')
    }
  },
  error: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[DEV ERROR] ${message}`, data || '')
    }
  }
}
