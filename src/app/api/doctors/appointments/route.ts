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

export async function POST(request: NextRequest) {
  try {
    // Validate request (rate limiting, config, etc.)
    const validation = await validateApiRequest(request)
    if (validation.error) {
      return validation.error
    }

    // Parse request body
    const appointmentData = await request.json()

    // Validate required fields
    const requiredFields = [
      'patient_id',
      'start_time', 
      'duration',
      'provider_id',
      'visit_reason_id',
      'location_id'
    ]

    const missingFields = requiredFields.filter(field => !appointmentData[field])
    
    if (missingFields.length > 0) {
      return createErrorResponse(
        `Missing required fields: ${missingFields.join(', ')}`,
        'MISSING_REQUIRED_FIELDS',
        400
      )
    }

    // Prepare booking payload with defaults
    const bookingPayload = {
      patient_id: appointmentData.patient_id,
      start_time: appointmentData.start_time,
      duration: appointmentData.duration || "30",
      provider_id: appointmentData.provider_id,
      visit_reason_id: appointmentData.visit_reason_id || "PMNP", // Default visit reason
      location_id: appointmentData.location_id,
      schedulable_resource_id: appointmentData.schedulable_resource_id || "",
      insurance_carrier: appointmentData.insurance_carrier || "",
      insurance_plan: appointmentData.insurance_plan || "",
      insurance_member_id: appointmentData.insurance_member_id || "",
      patient_address1: appointmentData.patient_address1 || "",
      patient_address2: appointmentData.patient_address2 || "",
      patient_city: appointmentData.patient_city || "",
      patient_state: appointmentData.patient_state || "",
      patient_zip: appointmentData.patient_zip || "",
      notes: appointmentData.notes || "",
      external_system: "Website"
    }

    // Book appointment via Harmony EHR API
    const { data: bookingResponse, error } = await makeHarmonyRequest(
      '/ExternalAppointmentBooking/ZocDoc/appointments',
      { 
        method: 'POST',
        body: JSON.stringify(bookingPayload)
      }
    )

    if (error) {
      return error
    }

    
    return createSuccessResponse({
      appointmentId: bookingResponse.appointment_id || bookingResponse.id,
      status: 'confirmed',
      message: 'Appointment successfully booked',
      details: {
        patient_id: appointmentData.patient_id,
        provider_id: appointmentData.provider_id,
        start_time: appointmentData.start_time,
        duration: appointmentData.duration,
        location_id: appointmentData.location_id
      }
    })

  } catch (error) {
    console.error('Appointment booking error:', error)
    
    return createErrorResponse(
      'Failed to book appointment',
      'BOOKING_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
