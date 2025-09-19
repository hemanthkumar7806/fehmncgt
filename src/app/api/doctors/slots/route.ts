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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('provider_id')
    const locationId = searchParams.get('location_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!providerId || !locationId || !startDate || !endDate) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters: provider_id, location_id, start_date, end_date',
          code: 'MISSING_PARAMETERS'
        },
        { 
          status: 400, 
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
    
    // Get appointment slots from Harmony EHR API
    const slotsUrl = `${authConfig.harmony.baseUrl}/devmain/ExternalAppointmentBooking/ZocDoc/available_slots/by_provider?provider_id=${providerId}&start_date=${startDate}&end_date=${endDate}&location_id=${locationId}`
    
    const slotsResponse = await fetch(slotsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!slotsResponse.ok) {
      const errorText = await slotsResponse.text()
      console.error(`Slots API error: ${slotsResponse.status} - ${errorText}`)
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch appointment slots',
          code: 'SLOTS_FETCH_FAILED',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { 
          status: slotsResponse.status, 
          headers: corsHeaders() 
        }
      )
    }

    const slotsData = await slotsResponse.json()
    
    // Transform the slots data to a more usable format
    const transformedSlots = slotsData.map((slot: any) => ({
      time: formatTimeForDisplay(slot.start_time),
      type: 'consultation' as const,
      available: true,
      startTime: slot.start_time,
      endTime: slot.end_time,
      slotTypes: slot.available_slot_types?.map((type: any) => type.available_slot_type_id) || []
    }))

    console.log(`Successfully fetched ${transformedSlots.length} appointment slots for provider ${providerId}`)
    
    return NextResponse.json(
      { 
        success: true,
        data: transformedSlots,
        count: transformedSlots.length,
        providerId,
        locationId,
        dateRange: { startDate, endDate }
      },
      { 
        status: 200, 
        headers: corsHeaders() 
      }
    )

  } catch (error) {
    console.error('Slots API error:', error)
    
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

// Helper function to format time for display
function formatTimeForDisplay(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
