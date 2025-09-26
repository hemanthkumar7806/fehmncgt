import { NextRequest, NextResponse } from 'next/server'
import { validateApiRequest, makeHarmonyRequest, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

interface PatientSearchRequest {
  first_name: string
  last_name: string
  date_of_birth: string  // Format: MM-DD-YYYY
  email_address?: string
  phone_number?: string
  gender: 'M' | 'F'
  provider_id?: string
  patient_id?: string
}

interface HarmonyPatient {
  patient_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  email_address: string
  phone_number: string
  gender: string
  provider_id: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate the API request (CORS, rate limiting, etc.)
    const validationResult = await validateApiRequest(request)
    if (validationResult.error) {
      return validationResult.error
    }

    const requestBody: PatientSearchRequest = await request.json()

    // Validate required fields
    if (!requestBody.first_name || !requestBody.last_name || !requestBody.date_of_birth || !requestBody.gender) {
      return createErrorResponse('Missing required fields: first_name, last_name, date_of_birth, gender', 'VALIDATION_ERROR', 400)
    }

    // Make the request to Harmony EHR patient search API
    const { data: harmonyResponse, error } = await makeHarmonyRequest('/devmain/ExternalAppointmentBooking/ZocDoc/patients/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (error) {
      return error
    }

    // Parse the response as direct array of HarmonyPatient
    const harmonyPatients = harmonyResponse as HarmonyPatient[]

    if (!Array.isArray(harmonyPatients)) {
      return createErrorResponse(
        'Invalid response format from Harmony EHR patient search',
        'INVALID_FORMAT',
        400
      )
    }

    return createSuccessResponse({
      data: harmonyPatients,
      count: harmonyPatients.length
    })

  } catch (error) {
    console.error('Error in patient search API:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error during patient search',
      'INTERNAL_ERROR',
      500
    )
  }
}
