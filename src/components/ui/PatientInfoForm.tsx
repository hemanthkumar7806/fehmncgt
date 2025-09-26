'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { doctorsApi, type VisitReason } from '@/services/doctorsApi'

interface TimeSlot {
  time: string
  available: boolean
  type: 'consultation' | 'follow-up'
}

interface PatientInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  reason: string
  reasonId: string
  dateOfBirth: string
  gender: 'M' | 'F'
}

interface PatientInfoFormProps {
  selectedDate: string
  selectedSlot: TimeSlot | null
  patientInfo: PatientInfo
  onPatientInfoChange: (info: PatientInfo) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
  error?: string | null
  onClearError?: () => void
}

export default function PatientInfoForm({
  selectedDate,
  selectedSlot,
  patientInfo,
  onPatientInfoChange,
  onSubmit,
  onBack,
  isSubmitting = false,
  error = null,
  onClearError
}: PatientInfoFormProps) {
  const [visitReasons, setVisitReasons] = useState<VisitReason[]>([])
  const [loadingReasons, setLoadingReasons] = useState(true)
  
  // Fetch visit reasons on component mount
  useEffect(() => {
    const fetchVisitReasons = async () => {
      try {
        setLoadingReasons(true)
        const reasons = await doctorsApi.getVisitReasons()
        setVisitReasons(reasons)
      } catch (error) {
        console.error('Error fetching visit reasons:', error)
        // Fallback to basic reasons if API fails (using actual API IDs)
        setVisitReasons([
          { visit_reason_id: 'PMNP', visit_reason: 'New Patient Visit' },
          { visit_reason_id: 'PMEP', visit_reason: 'Follow Up Visit' },
          { visit_reason_id: 'CONSULT', visit_reason: 'Consults' },
          { visit_reason_id: 'PMSV', visit_reason: 'Sick visit' }
        ])
      } finally {
        setLoadingReasons(false)
      }
    }
    
    fetchVisitReasons()
  }, [])
  
  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    onPatientInfoChange({
      ...patientInfo,
      [field]: value
    })
  }

  const handleReasonChange = (reasonId: string) => {
    const selectedReason = visitReasons.find(r => r.visit_reason_id === reasonId)
    onPatientInfoChange({
      ...patientInfo,
      reasonId: reasonId,
      reason: selectedReason?.visit_reason || ''
    })
  }

  const isFormValid = patientInfo.firstName && patientInfo.lastName && patientInfo.email && patientInfo.phone && patientInfo.dateOfBirth && patientInfo.gender && patientInfo.reasonId

  return (
    <motion.div
      key="patient-info"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-3 p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Your Information</h4>
          <p className="text-sm text-gray-600">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                timeZone: 'America/New_York'
              })} at {selectedSlot?.time}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={patientInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={patientInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={patientInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={patientInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <input
              type="date"
              value={patientInfo.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              value={patientInfo.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as 'M' | 'F')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit *</label>
          {loadingReasons ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#01a69c] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500">Loading visit reasons...</span>
              </div>
            </div>
          ) : (
            <select
              value={patientInfo.reasonId || ''}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
            >
              <option value="">Select reason for visit</option>
              {visitReasons.map((reason) => (
                <option key={reason.visit_reason_id} value={reason.visit_reason_id}>
                  {reason.visit_reason}
                  {reason.description && ` - ${reason.description}`}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {onClearError && (
                <button
                  onClick={onClearError}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3 mt-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="flex-1 px-4 py-2 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </motion.div>
  )
}
