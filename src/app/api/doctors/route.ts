import { NextRequest } from 'next/server'
import { 
  handleOptions,
  validateApiRequest,
  makeHarmonyRequest,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api-utils'
import { client } from '@/lib/sanity'

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(_request: NextRequest) {
  try {
    // Validate request (rate limiting, config, etc.)
    const validation = await validateApiRequest(_request)
    if (validation.error) {
      return validation.error
    }

    // 1) Get specialityCode from Sanity Fibroid Page → Doctor section
    // 2) Fallback to environment variable SPECIALITY_CODE
    // 3) Final fallback to hardcoded 'HNMPDL'
    const sanityCode = await client.fetch<string | null>(
      `*[_type == "homePage"][0].doctorsSpeciality.specialityCode`
    )
    const specialityCode =
      (sanityCode && sanityCode.trim() !== '' ? sanityCode : null) ||
      process.env.SPECIALITY_CODE ||
      'HNMPDL'

    console.log(`[Doctors API] Using specialityCode: ${specialityCode} (from Sanity: ${sanityCode ?? 'none'})`)

    // Get doctors from Harmony EHR API
    console.log(`[Doctors API] Fetching doctors from Harmony EHR with specialityCode: ${specialityCode}`)
    const { data: doctorsData, error } = await makeHarmonyRequest(
      `/ExternalAppointmentBooking/ZocDoc/FetchProviderByOrganization/${specialityCode}`,
      { method: 'GET' }
    )

    if (error) {
      console.error('[Doctors API] Harmony API returned error:', error)
      return error
    }
    
    if (!doctorsData || !Array.isArray(doctorsData) || doctorsData.length === 0) {
      console.warn('[Doctors API] No doctors found for specialityCode:', specialityCode)
      return createSuccessResponse({
        data: [],
        count: 0,
        message: `No doctors found for specialty code: ${specialityCode}`
      })
    }
    
    console.log(`[Doctors API] Successfully fetched ${doctorsData.length} doctors`)
    console.log('[Doctors API] First doctor data:', JSON.stringify(doctorsData[0], null, 2))
    // Transform the data to match our component structure
    const transformedDoctors = doctorsData.map((doctor: any) => ({
      _id: doctor.id.toString(),
      name: `${doctor.firstName} ${doctor.lastName}`,
      title: doctor.specialities?.[0]?.name || '',
      credentials: doctor.providerCredential || '',
      specialties: doctor.specialities?.map((spec: any) => spec.name) || [],
      experience: doctor.experience || '',
      // Fallback for description if not provided by API
      description: doctor.description || doctor.bio || 
        "Board-certified specialist in advanced hysteroscopic fibroid resection, helping women preserve fertility while achieving symptom relief.",
      photo: doctor.providerPhoto || null,
      profileLink: doctor.profileLink || null,
      slug: {
        current: `${doctor.firstName?.toLowerCase()}-${doctor.lastName?.toLowerCase()}`
      },
      // Additional data from API
      npi: doctor.npi,
      education: {
        medicalSchool: doctor.education?.medicalSchool || doctor.medicalSchool || 'New York College of Osteopathic Medicine',
        internship: doctor.education?.internship || doctor.internship || 'Saint Barnabas Medical Center',
        residency: doctor.education?.residency || doctor.residency || 'Saint Barnabas Medical Center',
        fellowship: doctor.education?.fellowship || doctor.fellowship || 'Montefiore Medical Center'
      },
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