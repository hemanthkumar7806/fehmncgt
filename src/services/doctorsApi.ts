// Centralized API service for doctors-related endpoints
import { shouldUseMockData, devUtils } from '@/config/development'
import { mockDoctors, mockAvailableDates } from '@/data/mockDoctors'

export interface Doctor {
  _id?: string
  name?: string
  title?: string
  credentials?: string
  specialties?: string[]
  experience?: string
  photo?: any
  profileLink?: string | null
  npi?: string
  description?: string
  about?: string
  education?: {
    medicalSchool?: string
    internship?: string
    residency?: string
    fellowship?: string
  }
  contactInfo?: {
    phone?: string
    email?: string
    addressLine1?: string
    city?: string
    state?: string
  }
  organization?: {
    organizationId?: string
    organizationName?: string
  }
}

export interface TimeSlot {
  time: string
  available: boolean
  type: 'consultation' | 'follow-up'
  startTime?: string
  endTime?: string
  slotTypes?: string[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
  code?: string
}


export interface AvailableDate {
  date: string
  slotsCount: number
  hasSlots: boolean
  slots?: TimeSlot[]
}

export interface PatientSearchRequest {
  first_name: string
  last_name: string
  date_of_birth: string  // Format: MM-DD-YYYY for search
  email_address?: string
  phone_number?: string
  gender: 'M' | 'F'
  provider_id?: string
  patient_id?: string
}

export interface PatientCreateRequest {
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

export interface Patient {
  patient_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  email_address: string
  phone_number: string
  gender: string
}

export interface VisitReason {
  visit_reason_id: string
  visit_reason: string
  description?: string
}

class DoctorsApiService {
  private baseUrl = '/api/doctors'

  async getDoctors(specialityCode?: string): Promise<Doctor[]> {
    // Check if we should use mock data
    if (shouldUseMockData()) {
      devUtils.log('Using mock doctors data', { specialityCode })
      // Simulate API delay in development
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockDoctors
    }

    try {
      devUtils.log('Fetching doctors from API', { specialityCode })
      const url = specialityCode 
        ? `${this.baseUrl}?specialityCode=${encodeURIComponent(specialityCode)}`
        : this.baseUrl
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors: ${response.status}`)
      }

      const data: ApiResponse<Doctor[]> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch doctors')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching doctors:', error)
      throw error
    }
  }


  async getAvailableDates(params: {
    providerId: string
    noOfDays?: number
  }): Promise<AvailableDate[]> {
    // Check if we should use mock data
    if (shouldUseMockData()) {
      devUtils.log('Using mock available dates data', params)
      // Simulate API delay in development
      await new Promise(resolve => setTimeout(resolve, 800))
      return mockAvailableDates
    }

    try {
      devUtils.log('Fetching available dates from API', params)
      const { providerId, noOfDays = 7 } = params
      const url = `${this.baseUrl}/available-dates?provider_id=${providerId}&noOfDays=${noOfDays}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch available dates: ${response.status}`)
      }

      const data: ApiResponse<AvailableDate[]> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch available dates')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching available dates:', error)
      throw error
    }
  }

  async searchPatient(searchData: PatientSearchRequest): Promise<Patient[]> {
    try {
      const response = await fetch('/api/patients/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to search patient: ${response.status}`)
      }

      const data: ApiResponse<Patient[]> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to search patient')
      }

      return data.data
    } catch (error) {
      console.error('Error searching patient:', error)
      throw error
    }
  }

  async createPatient(patientData: PatientCreateRequest): Promise<Patient> {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create patient: ${response.status}`)
      }

      const data: ApiResponse<Patient> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create patient')
      }

      return data.data
    } catch (error) {
      console.error('Error creating patient:', error)
      throw error
    }
  }

  async getVisitReasons(): Promise<VisitReason[]> {
    try {
      const response = await fetch('/api/visit-reasons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch visit reasons: ${response.status}`)
      }

      const data: ApiResponse<VisitReason[]> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch visit reasons')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching visit reasons:', error)
      throw error
    }
  }

  // Future method for booking appointments
  async bookAppointment(appointmentData: {
    doctorId: string
    providerId: string
    locationId: string
    startTime: string
    duration?: string
    patientInfo: {
      name: string
      email: string
      phone: string
      reason?: string
    }
    patientId?: string
    visitReasonId?: string
    insuranceInfo?: {
      carrier?: string
      plan?: string
      memberId?: string
    }
    patientAddress?: {
      address1?: string
      address2?: string
      city?: string
      state?: string
      zip?: string
    }
  }): Promise<{ success: boolean; appointmentId?: string; error?: string; details?: any }> {
    try {
      const url = `${this.baseUrl}/appointments`
      
      // Convert time to the format expected by the Harmony API
      const formatTimeForBooking = (timeString: string): string => {
        // Parse the UTC time
        const date = new Date(timeString)
        
        // Check if it's a valid date
        if (isNaN(date.getTime())) {
          console.error('Invalid date string:', timeString)
          return timeString // Return original if invalid
        }
        
        // Get the date in Eastern Time
        const easternDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}))
        
        // Format as YYYY-MM-DDTHH:MM:SS (no timezone offset)
        const year = easternDate.getFullYear()
        const month = String(easternDate.getMonth() + 1).padStart(2, '0')
        const day = String(easternDate.getDate()).padStart(2, '0')
        const hours = String(easternDate.getHours()).padStart(2, '0')
        const minutes = String(easternDate.getMinutes()).padStart(2, '0')
        const seconds = String(easternDate.getSeconds()).padStart(2, '0')
        
        const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
        
        return formattedTime
      }

      // Prepare booking payload
      const bookingPayload = {
        patient_id: appointmentData.patientId || "000004279647", // Default patient ID for demo
        start_time: formatTimeForBooking(appointmentData.startTime),
        duration: appointmentData.duration || "30",
        provider_id: appointmentData.providerId,
        visit_reason_id: appointmentData.visitReasonId || "PMNP",
        location_id: appointmentData.locationId,
        schedulable_resource_id: "",
        insurance_carrier: appointmentData.insuranceInfo?.carrier || "",
        insurance_plan: appointmentData.insuranceInfo?.plan || "",
        insurance_member_id: appointmentData.insuranceInfo?.memberId || "",
        patient_address1: appointmentData.patientAddress?.address1 || "",
        patient_address2: appointmentData.patientAddress?.address2 || "",
        patient_city: appointmentData.patientAddress?.city || "",
        patient_state: appointmentData.patientAddress?.state || "",
        patient_zip: appointmentData.patientAddress?.zip || "",
        notes: appointmentData.patientInfo.reason || "",
        external_system: "Website"
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to book appointment: ${response.status}`)
      }

      const data: ApiResponse<any> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      return {
        success: true,
        appointmentId: data.data?.appointmentId,
        details: data.data?.details
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const doctorsApi = new DoctorsApiService()
