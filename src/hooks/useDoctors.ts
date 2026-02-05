'use client'

import { useState, useEffect } from 'react'
import { doctorsApi, Doctor } from '@/services/doctorsApi'
import { mockDoctors } from '@/data/mockDoctors'

export function useDoctors(specialityCode?: string) {
  // Start with mock data immediately (no loading state)
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [isApiResolved, setIsApiResolved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDoctors = async () => {
    try {
      setError(null)
      
      console.log('[useDoctors] Starting fetchDoctors with specialityCode:', specialityCode)
      console.log('[useDoctors] Environment:', {
        NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
        NODE_ENV: process.env.NODE_ENV,
      })
      
      // Always use the API service which handles mock data logic internally
      // The API service will respect NEXT_PUBLIC_USE_MOCK_DATA environment variable
      const data = await doctorsApi.getDoctors(specialityCode)
      console.log('[useDoctors] Received data:', { count: data.length, isMock: data.length > 0 && data[0]?._id === mockDoctors[0]?._id })
      
      // Only update if we got real data from API (not mock)
      if (data.length > 0 && data[0]?._id !== mockDoctors[0]?._id) {
        setDoctors(data)
        setIsApiResolved(true)
      } else {
        // If API returned mock data or empty, keep showing mock but don't enable booking
        setIsApiResolved(false)
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors')
      setIsApiResolved(false)
      // Keep showing mock data on error
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [specialityCode])

  const refetch = () => {
    fetchDoctors()
  }

  return {
    doctors,
    isApiResolved, // New: indicates if real API data is loaded
    error,
    refetch
  }
}