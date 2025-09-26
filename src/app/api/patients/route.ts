import { NextRequest, NextResponse } from 'next/server'
import { validateApiRequest, makeHarmonyRequest, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

interface PatientCreateRequest {
  first_name: string
  last_name: string
  date_of_birth: string  // Format: YYYY-MM-DD for creation
  email_address: string
  phone_number: string
  gender: 'M' | 'F'
  insurance_carrier?: string
  insurance_plan?: string
  insurance_member_id?: string
}

interface HarmonyPatientCreateResponse {
  patient_id: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate the API request (CORS, rate limiting, etc.)
    const validationResult = await validateApiRequest(request)
    if (validationResult.error) {
      return validationResult.error
    }

    const requestBody: PatientCreateRequest = await request.json()

    // Validate required fields
    if (!requestBody.first_name || !requestBody.last_name || !requestBody.date_of_birth || 
        !requestBody.email_address || !requestBody.phone_number || !requestBody.gender) {
      return createErrorResponse(
        'Missing required fields: first_name, last_name, date_of_birth, email_address, phone_number, gender', 
        'VALIDATION_ERROR',
        400
      )
    }

    // Make the request to Harmony EHR patient creation API
    const { data: harmonyResponse, error } = await makeHarmonyRequest('/devmain/ExternalAppointmentBooking/ZocDoc/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (error) {
      return error
    }

    // Parse the response as direct object
    const patientResponse = harmonyResponse as HarmonyPatientCreateResponse

    if (!patientResponse.patient_id) {
      return createErrorResponse(
        'Invalid response from Harmony EHR - no patient_id returned',
        'INVALID_RESPONSE',
        400
      )
    }

    return createSuccessResponse({
      data: patientResponse,
      patient_id: patientResponse.patient_id
    })

  } catch (error) {
    console.error('Error in patient creation API:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error during patient creation',
      'INTERNAL_ERROR',
      500
    )
  }
}
