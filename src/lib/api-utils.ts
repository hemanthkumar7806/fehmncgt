import { NextRequest, NextResponse } from 'next/server'
import { authConfig, validateAuthConfig } from '@/config/auth'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// CORS headers
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? authConfig.security.allowedOrigins.join(',') 
      : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

// Standard OPTIONS handler
export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

// Rate limiting function
export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `rate_limit_${ip}`
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { 
      count: 1, 
      resetTime: now + authConfig.security.rateLimit.windowMs 
    })
    return true
  }
  
  if (current.count >= authConfig.security.rateLimit.maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Standard error response helper
export function createErrorResponse(
  error: string,
  code: string,
  status: number,
  details?: string
) {
  return NextResponse.json(
    { 
      error,
      code,
      details: process.env.NODE_ENV === 'development' ? details : undefined
    },
    { 
      status, 
      headers: corsHeaders() 
    }
  )
}

// Standard success response helper
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    { 
      success: true,
      ...data
    },
    { 
      status, 
      headers: corsHeaders() 
    }
  )
}

// Middleware for common API validations
export async function validateApiRequest(request: NextRequest) {
  // Get client IP for rate limiting
  const clientIP = getClientIP(request)
  
  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`)
    return {
      error: createErrorResponse(
        'Rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        429
      ),
      clientIP
    }
  }

  // Validate environment variables
  const { isValid, errors } = validateAuthConfig()
  if (!isValid) {
    console.error('Environment validation failed:', errors)
    return {
      error: createErrorResponse(
        'Server configuration error',
        'CONFIG_ERROR',
        500,
        errors.join(', ')
      ),
      clientIP
    }
  }

  return { clientIP }
}

// Get access token (centralized authentication)
export async function getAccessToken(): Promise<{ token?: string; error?: NextResponse }> {
  try {
    const credentials = Buffer.from(`${authConfig.harmony.clientId}:${authConfig.harmony.clientKey}`).toString('base64')
    
    const tokenResponse = await fetch(`${authConfig.harmony.baseUrl}/Account/oauth2/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client_id': authConfig.harmony.clientId,
        'client_key': authConfig.harmony.clientKey,
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({}),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(`Token API error: ${tokenResponse.status} - ${errorText}`)
      
      return {
        error: createErrorResponse(
          'Failed to obtain access token',
          'AUTH_FAILED',
          tokenResponse.status,
          errorText
        )
      }
    }

    const tokenData = await tokenResponse.json()
    return { token: tokenData.access_token }

  } catch (error) {
    console.error('Access token error:', error)
    return {
      error: createErrorResponse(
        'Internal server error during authentication',
        'INTERNAL_AUTH_ERROR',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
}

// Make authenticated request to Harmony API
export async function makeHarmonyRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: any; error?: NextResponse }> {
  const { token, error } = await getAccessToken()
  
  if (error) {
    return { error }
  }

  try {
    const response = await fetch(`${authConfig.harmony.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Harmony API error: ${response.status} - ${errorText}`)
      
      return {
        error: createErrorResponse(
          'Failed to fetch data from Harmony API',
          'HARMONY_API_ERROR',
          response.status,
          errorText
        )
      }
    }

    const data = await response.json()
    return { data }

  } catch (error) {
    console.error('Harmony request error:', error)
    return {
      error: createErrorResponse(
        'Internal server error during API request',
        'INTERNAL_REQUEST_ERROR',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
}
