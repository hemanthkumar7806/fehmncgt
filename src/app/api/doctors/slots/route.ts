import { NextRequest } from 'next/server'
import { 
  handleOptions,
  validateApiRequest,
  makeHarmonyRequest,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api-utils'

export async function OPTIONS() {
  return handleOptions()
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
      return createErrorResponse(
        'Missing required parameters: provider_id, location_id, start_date, end_date',
        'MISSING_PARAMETERS',
        400
      )
    }

    // Validate request (rate limiting, config, etc.)
    const validation = await validateApiRequest(request)
    if (validation.error) {
      return validation.error
    }

    // Get appointment slots from Harmony EHR API
    const endpoint = `/devmain/ExternalAppointmentBooking/ZocDoc/available_slots/by_provider?provider_id=${providerId}&start_date=${startDate}&end_date=${endDate}&location_id=${locationId}`
    
    const { data: slotsData, error } = await makeHarmonyRequest(endpoint, { method: 'GET' })

    if (error) {
      return error
    }
    
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
    
    return createSuccessResponse({
      data: transformedSlots,
      count: transformedSlots.length,
      providerId,
      locationId,
      dateRange: { startDate, endDate }
    })

  } catch (error) {
    console.error('Slots API error:', error)
    
    return createErrorResponse(
      'Internal server error',
      'INTERNAL_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
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
