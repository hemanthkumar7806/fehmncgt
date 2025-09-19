import { NextRequest, NextResponse } from 'next/server'
import { authConfig, validateAuthConfig } from '@/config/auth'

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? authConfig.security.allowedOrigins.join(',') 
      : '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

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

export async function GET(request: NextRequest) {
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

    // Get access token
    const credentials = Buffer.from(`${authConfig.harmony.clientId}:${authConfig.harmony.clientKey}`).toString('base64')
    
    const tokenResponse = await fetch(`${authConfig.harmony.baseUrl}/devmain/Account/oauth2/access_token`, {
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
      
      return NextResponse.json(
        { 
          error: 'Failed to obtain access token',
          code: 'AUTH_FAILED',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { 
          status: tokenResponse.status, 
          headers: corsHeaders() 
        }
      )
    }

    const tokenData = await tokenResponse.json()
    
    // Get doctors from Harmony EHR API
    const doctorsResponse = await fetch(`${authConfig.harmony.baseUrl}/devmain/ExternalAppointmentBooking/ZocDoc/FetchProviderSpeciality/207V00000X`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!doctorsResponse.ok) {
      const errorText = await doctorsResponse.text()
      console.error(`Doctors API error: ${doctorsResponse.status} - ${errorText}`)
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch doctors',
          code: 'DOCTORS_FETCH_FAILED',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { 
          status: doctorsResponse.status, 
          headers: corsHeaders() 
        }
      )
    }

    const doctorsData = await doctorsResponse.json()
    
    // Transform the data to match our component structure
    const transformedDoctors = doctorsData.map((doctor: any) => ({
      _id: doctor.id.toString(),
      name: `${doctor.firstName} ${doctor.lastName}`,
      title: doctor.specialities?.[0]?.name || 'Physician',
      credentials: doctor.providerCredential || 'MD',
      specialties: doctor.specialities?.map((spec: any) => spec.name) || [],
      experience: '15+ years', // Default since not provided by API
      photo: null, // Will use default avatar
      slug: {
        current: `${doctor.firstName.toLowerCase()}-${doctor.lastName.toLowerCase()}`
      },
      // Additional data from API
      npi: doctor.npi,
      contactInfo: doctor.providerContacts?.[0] ? {
        phone: doctor.providerContacts[0].phone,
        email: doctor.providerContacts[0].email,
        addressLine1: doctor.providerContacts[0].addressLine1,
        city: doctor.providerContacts[0].city,
        state: doctor.providerContacts[0].state
      } : null,
      organization: doctor.organizations?.[0] || null
    }))

    console.log(`Successfully fetched ${transformedDoctors.length} doctors for IP: ${clientIP}`)
    
    return NextResponse.json(
      { 
        success: true,
        data: transformedDoctors,
        count: transformedDoctors.length
      },
      { 
        status: 200, 
        headers: corsHeaders() 
      }
    )

  } catch (error) {
    console.error('Doctors API error:', error)
    
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