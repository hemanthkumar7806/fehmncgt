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
    // Validate request (rate limiting, config, etc.)
    const validation = await validateApiRequest(request)
    if (validation.error) {
      return validation.error
    }

    // Get doctors from Harmony EHR API
    const { data: doctorsData, error } = await makeHarmonyRequest(
      '/ExternalAppointmentBooking/ZocDoc/FetchProviderSpeciality/207V00000X',
      { method: 'GET' }
    )

    if (error) {
      return error
    }
    
    
    // Transform the data to match our component structure
    const transformedDoctors = doctorsData.map((doctor: any) => ({
      _id: doctor.id.toString(),
      name: `${doctor.firstName} ${doctor.lastName}`,
      title: doctor.specialities?.[0]?.name || 'Physician',
      credentials: doctor.providerCredential || 'MD',
      specialties: doctor.specialities?.map((spec: any) => spec.name) || [],
      experience: '15+ years', // Default since not provided by API
      photo: doctor.providerPhoto || null, // Will use default avatar
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

    
    
    return createSuccessResponse({
      data: transformedDoctors,
      count: transformedDoctors.length
    })

  } catch (error) {
    console.error('Doctors API error:', error)
    
    return createErrorResponse(
      'Internal server error',
      'INTERNAL_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}