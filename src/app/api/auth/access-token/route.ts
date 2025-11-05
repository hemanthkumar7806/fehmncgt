import { NextRequest, NextResponse } from 'next/server'
import { authConfig, validateAuthConfig } from '@/config/auth'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? authConfig.security.allowedOrigins.join(',') 
      : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
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
function getClientIP(request: NextRequest): string {
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429, 
          headers: corsHeaders() 
        }
      )
    }

    // Validate environment variables
    const { isValid, errors } = validateAuthConfig()
    if (!isValid) {
      console.error('Environment validation failed:', errors)
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          code: 'CONFIG_ERROR',
          details: process.env.NODE_ENV === 'development' ? errors.join(', ') : undefined
        },
        { 
          status: 500, 
          headers: corsHeaders() 
        }
      )
    }

    // Prepare the authorization header
    const credentials = Buffer.from(`${authConfig.harmony.clientId}:${authConfig.harmony.clientKey}`).toString('base64')
    
    // Make request to Harmony EHR API
    const response = await fetch(`${authConfig.harmony.baseUrl}/Account/oauth2/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client_id': authConfig.harmony.clientId!,
        'client_key': authConfig.harmony.clientKey!,
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({}), // Required for content-length
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Harmony API error: ${response.status} - ${errorText}`)
      
      return NextResponse.json(
        { 
          error: 'Failed to obtain access token',
          code: 'AUTH_FAILED',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { 
          status: response.status, 
          headers: corsHeaders() 
        }
      )
    }

    const tokenData = await response.json()
    
    // Log successful authentication (without sensitive data)
    console.log(`Access token obtained successfully for IP: ${clientIP}`)
    
    // Return the token data
    return NextResponse.json(
      { 
        success: true,
        data: tokenData 
      },
      { 
        status: 200, 
        headers: corsHeaders() 
      }
    )

  } catch (error) {
    console.error('Access token API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { 
        status: 500, 
        headers: corsHeaders() 
      }
    )
  }
}
