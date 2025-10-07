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
    const noOfDays = searchParams.get('noOfDays') || '7' // Default to 7 days

    if (!providerId) {
      return createErrorResponse(
        'Missing required parameter: provider_id',
        'MISSING_PARAMETERS',
        400
      )
    }

    // Validate request (rate limiting, config, etc.)
    const validation = await validateApiRequest(request)
    if (validation.error) {
      return validation.error
    }

    // Get available dates from Harmony EHR API
    const endpoint = `/ExternalAppointmentBooking/ZocDoc/nextAvailable_slots/by_provider?provider_id=${providerId}&noOfDays=${noOfDays}`
    
    const { data: slotsData, error } = await makeHarmonyRequest(endpoint, { method: 'GET' })

    if (error) {
      return error
    }


    // Transform the data to get unique dates with slot counts
    const dateSlotMap = new Map<string, any[]>()
    
    slotsData.forEach((slot: any) => {
      const slotDate = slot.start_time ? new Date(slot.start_time).toISOString().split('T')[0] : null
      if (slotDate) {
        if (!dateSlotMap.has(slotDate)) {
          dateSlotMap.set(slotDate, [])
        }
        dateSlotMap.get(slotDate)?.push(slot)
      }
    })

    // Transform to available dates format
    const availableDates = Array.from(dateSlotMap.entries()).map(([date, slots]) => ({
      date,
      slotsCount: slots.length,
      hasSlots: slots.length > 0,
      slots: slots.map(slot => ({
        time: formatTimeForDisplay(slot.start_time),
        startTime: slot.start_time,
        endTime: slot.end_time,
        available: true,
        type: 'consultation' as const,
        slotTypes: slot.available_slot_types?.map((type: any) => type.available_slot_type_id) || []
      }))
    })).filter(dateInfo => dateInfo.hasSlots) // Only return dates with available slots

    
    return createSuccessResponse({
      data: availableDates,
      count: availableDates.length,
      providerId,
      daysRequested: parseInt(noOfDays)
    })

  } catch (error) {
    console.error('Available dates API error:', error)
    
    return createErrorResponse(
      'Internal server error',
      'INTERNAL_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

// Helper function to format time for display (US Eastern Time)
function formatTimeForDisplay(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York' // Eastern Time for NYC area (Holy Name Medical Center)
  })
}
