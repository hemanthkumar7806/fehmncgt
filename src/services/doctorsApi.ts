// Centralized API service for doctors-related endpoints
import { shouldUseMockData, devUtils } from '@/config/development'
import { mockDoctors, mockTimeSlots } from '@/data/mockDoctors'

export interface Doctor {
  _id?: string
  name?: string
  title?: string
  credentials?: string
  specialties?: string[]
  experience?: string
  photo?: any
  npi?: string
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

export interface SlotResponse extends ApiResponse<TimeSlot[]> {
  providerId?: string
  locationId?: string
  dateRange?: {
    startDate: string
    endDate: string
  }
}

class DoctorsApiService {
  private baseUrl = '/api/doctors'

  async getDoctors(): Promise<Doctor[]> {
    // Check if we should use mock data
    if (shouldUseMockData()) {
      devUtils.log('Using mock doctors data')
      // Simulate API delay in development
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockDoctors
    }

    try {
      devUtils.log('Fetching doctors from API')
      const response = await fetch(this.baseUrl)
      
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

  async getSlots(params: {
    providerId: string
    locationId: string
    startDate: string
    endDate: string
  }): Promise<TimeSlot[]> {
    // Check if we should use mock data
    if (shouldUseMockData()) {
      devUtils.log('Using mock time slots data', params)
      // Simulate API delay in development
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockTimeSlots
    }

    try {
      devUtils.log('Fetching slots from API', params)
      const { providerId, locationId, startDate, endDate } = params
      const url = `${this.baseUrl}/slots?provider_id=${providerId}&location_id=${locationId}&start_date=${startDate}&end_date=${endDate}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.status}`)
      }

      const data: SlotResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch slots')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching slots:', error)
      throw error
    }
  }

  // Future method for booking appointments
  async bookAppointment(appointmentData: {
    doctorId: string
    providerId: string
    locationId: string
    date: string
    time: string
    patientInfo: {
      name: string
      email: string
      phone: string
      reason?: string
    }
  }): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
    try {
      if (shouldUseMockData()) {
        devUtils.log('Mock booking appointment:', appointmentData)
        // Simulate API call with mock success
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return {
          success: true,
          appointmentId: 'MOCK-APT-' + Date.now()
        }
      }

      devUtils.log('Booking appointment via API:', appointmentData)
      // This would be implemented when the booking endpoint is ready
      console.log('Booking appointment:', appointmentData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        success: true,
        appointmentId: 'APT-' + Date.now()
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
