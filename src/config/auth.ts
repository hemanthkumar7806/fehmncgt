// Authentication configuration
export const authConfig = {
  // Harmony EHR API Configuration
  harmony: {
    clientId: process.env.HARMONY_CLIENT_ID,
    clientKey: process.env.HARMONY_CLIENT_KEY ,
    baseUrl: process.env.HARMONY_BASE_URL,
  },
  
  // Security Configuration
  security: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
    rateLimit: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 requests per minute per IP
    },
  },
  
  // Token Configuration
  token: {
    refreshBuffer: 300, // Refresh token 5 minutes before expiry
  },
}

// Validation function
export function validateAuthConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Use default values if environment variables are not set
  const clientId = process.env.HARMONY_CLIENT_ID
  const clientKey = process.env.HARMONY_CLIENT_KEY
  
  if (!clientId) {
    errors.push('HARMONY_CLIENT_ID is required')
  }
  
  if (!clientKey) {
    errors.push('HARMONY_CLIENT_KEY is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
