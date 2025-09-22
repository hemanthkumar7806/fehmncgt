import { useState, useEffect, useCallback } from 'react'
import { doctorsApi, type Doctor } from '@/services/doctorsApi'
import { devUtils, getDevelopmentMode } from '@/config/development'

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
    const devMode = getDevelopmentMode()
    devUtils.log('Fetching doctors', { useMockData: devMode.useMockData })
    
    setIsLoading(true)
    setError(null)

    try {
      const data = await doctorsApi.getDoctors()
      setDoctors(data)
      setCount(data.length)
      
      devUtils.log(`Successfully loaded ${data.length} doctors`, { 
        mockMode: devMode.useMockData,
        count: data.length 
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctors'
      setError(errorMessage)
      devUtils.error('useDoctors error:', err)
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

    const devMode = getDevelopmentMode()
    devUtils.log('Fetching single doctor', { doctorId, useMockData: devMode.useMockData })

    setIsLoading(true)
    setError(null)

    try {
      const data = await doctorsApi.getDoctors()
      const foundDoctor = data.find(d => d._id === doctorId)
      setDoctor(foundDoctor || null)
      
      devUtils.log('Doctor fetch result', { 
        doctorId, 
        found: !!foundDoctor, 
        mockMode: devMode.useMockData 
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch doctor'
      setError(errorMessage)
      devUtils.error('useDoctor error:', err)
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
