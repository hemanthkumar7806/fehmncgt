import { useState, useEffect, useCallback } from 'react'
import { doctorsApi, type Doctor } from '@/services/doctorsApi'

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
      const data = await doctorsApi.getDoctors()
      setDoctors(data)
      setCount(data.length)
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
      const data = await doctorsApi.getDoctors()
      const foundDoctor = data.find(d => d._id === doctorId)
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
