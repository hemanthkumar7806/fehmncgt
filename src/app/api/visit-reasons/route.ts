import { NextRequest, NextResponse } from 'next/server'
import { validateApiRequest, makeHarmonyRequest, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

interface VisitReason {
  visit_reason_id: string
  visit_reason: string
  description?: string
}

interface HarmonyVisitReason {
  id: string
  name: string
}



export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate the API request (CORS, rate limiting, etc.)
    const validationResult = await validateApiRequest(request)
    if (validationResult.error) {
      return validationResult.error
    }

    // Make the request to Harmony EHR visit reasons API
    const { data: harmonyResponse, error } = await makeHarmonyRequest('/devmain/ExternalAppointmentBooking/ZocDoc/visit_reasons', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (error) {
      return error
    }

    // Parse the response as direct array of HarmonyVisitReason
    const harmonyReasons = harmonyResponse as HarmonyVisitReason[]

    if (!Array.isArray(harmonyReasons)) {
      return createErrorResponse(
        'Invalid response format from Harmony EHR',
        'INVALID_FORMAT',
        400
      )
    }

    // Transform the data to match our expected format
    const visitReasons: VisitReason[] = harmonyReasons.map(reason => ({
      visit_reason_id: reason.id,
      visit_reason: reason.name,
      description: undefined // API doesn't provide description
    }))

    return createSuccessResponse({
      data: visitReasons,
      count: visitReasons.length
    })

  } catch (error) {
    console.error('Error in visit reasons API:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error during visit reasons fetch',
      'INTERNAL_ERROR',
      500
    )
  }
}
