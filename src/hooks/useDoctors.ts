import { useState, useEffect, useCallback } from 'react'

// Types for doctor data
export interface Doctor {
  _id: string
  name: string
  title: string
  credentials: string
  specialties: string[]
  experience: string
  photo?: any
  npi?: string
  contactInfo?: {
    phone?: string
    email?: string
    addressLine1?: string
    city?: string
    state?: string
  }
  slug?: {
    current: string
  }
}


export interface DoctorsApiResponse {
  success: boolean
  data?: Doctor[]
  count?: number
  error?: string
  code?: string
  details?: string
}

export interface UseDoctorsReturn {
  doctors: Doctor[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  count: number
}

/**
 * React hook for fetching doctors data from Harmony EHR API
 */
export function useDoctors(): UseDoctorsReturn {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/doctors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData: DoctorsApiResponse = await response.json()
        throw new Error(errorData.error || 'Failed to fetch doctors')
      }

      const data: DoctorsApiResponse = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Invalid response from doctors API')
      }

      setDoctors(data.data)
      setCount(data.count || data.data.length)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctors'
      setError(errorMessage)
      console.error('useDoctors error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-fetch on mount
  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  return {
    doctors,
    isLoading,
    error,
    refetch: fetchDoctors,
    count,
  }
}

/**
 * Hook for fetching a single doctor by ID
 */
export function useDoctor(doctorId: string): {
  doctor: Doctor | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
} {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDoctor = useCallback(async () => {
    if (!doctorId) return

    setIsLoading(true)
    setError(null)

    try {
      // First get all doctors, then find the specific one
      const response = await fetch('/api/doctors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData: DoctorsApiResponse = await response.json()
        throw new Error(errorData.error || 'Failed to fetch doctors')
      }

      const data: DoctorsApiResponse = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Invalid response from doctors API')
      }

      const foundDoctor = data.data.find(d => d._id === doctorId)
      setDoctor(foundDoctor || null)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor'
      setError(errorMessage)
      console.error('useDoctor error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [doctorId])

  useEffect(() => {
    fetchDoctor()
  }, [fetchDoctor])

  return {
    doctor,
    isLoading,
    error,
    refetch: fetchDoctor,
  }
}
