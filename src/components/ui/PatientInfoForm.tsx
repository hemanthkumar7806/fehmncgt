'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, AlertCircle } from 'lucide-react'
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

interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  reasonId?: string
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
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
  
  // Character limits: names 50; email 128 (standard); phone 15 (E.164)
  const LIMITS = {
    firstName: 50,
    lastName: 50,
    email: 128,
    phone: 15,
  } as const

  // Validation functions
  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name.trim()) {
      return `${fieldName} is required`
    }
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters`
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    }
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return 'Phone number is required'
    }
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return 'Phone number must be at least 10 digits'
    }
    if (cleanPhone.length > 15) {
      return 'Phone number cannot exceed 15 digits'
    }
    return undefined
  }

  const validateDateOfBirth = (dob: string): string | undefined => {
    if (!dob) {
      return 'Date of birth is required'
    }
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (birthDate > today) {
      return 'Date of birth cannot be in the future'
    }
    
    // Check if person is at least 18 years old
    if (age < 18 || (age === 18 && monthDiff < 0)) {
      return 'You must be at least 18 years old'
    }
    
    // Check if person is not older than 120 years
    if (age > 120) {
      return 'Please enter a valid date of birth'
    }
    
    return undefined
  }

  const validateGender = (gender: string): string | undefined => {
    if (!gender) {
      return 'Gender is required'
    }
    return undefined
  }

  const validateReasonId = (reasonId: string): string | undefined => {
    if (!reasonId) {
      return 'Reason for visit is required'
    }
    return undefined
  }

  // Validate all fields
  const validateField = (field: keyof PatientInfo, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        return validateName(value, 'First name')
      case 'lastName':
        return validateName(value, 'Last name')
      case 'email':
        return validateEmail(value)
      case 'phone':
        return validatePhone(value)
      case 'dateOfBirth':
        return validateDateOfBirth(value)
      case 'gender':
        return validateGender(value)
      case 'reasonId':
        return validateReasonId(value)
      default:
        return undefined
    }
  }

  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    let finalValue = value
    if (field === 'phone') {
      // Allow digits only (no letters or symbols)
      finalValue = value.replace(/\D/g, '').slice(0, LIMITS.phone)
    } else {
      const limit = LIMITS[field as keyof typeof LIMITS]
      finalValue = limit != null ? value.slice(0, limit) : value
    }
    
    onPatientInfoChange({
      ...patientInfo,
      [field]: finalValue
    })

    // Validate field if it has been touched
    if (touched[field]) {
      const error = validateField(field, finalValue)
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }))
    }
  }

  const handleBlur = (field: keyof PatientInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, patientInfo[field])
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const handleReasonChange = (reasonId: string) => {
    const selectedReason = visitReasons.find(r => r.visit_reason_id === reasonId)
    onPatientInfoChange({
      ...patientInfo,
      reasonId: reasonId,
      reason: selectedReason?.visit_reason || ''
    })

    if (touched.reasonId) {
      const error = validateReasonId(reasonId)
      setValidationErrors(prev => ({
        ...prev,
        reasonId: error
      }))
    }
  }

  const handleSubmit = () => {
    // Touch all fields
    const allFields: (keyof ValidationErrors)[] = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'reasonId']
    const newTouched: Record<string, boolean> = {}
    const newErrors: ValidationErrors = {}

    allFields.forEach(field => {
      newTouched[field] = true
      const error = validateField(field as keyof PatientInfo, patientInfo[field as keyof PatientInfo])
      if (error) {
        newErrors[field] = error
      }
    })

    setTouched(newTouched)
    setValidationErrors(newErrors)

    // Only submit if there are no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit()
    }
  }

  const hasErrors = Object.values(validationErrors).some(error => error !== undefined)
  const isFormValid = patientInfo.firstName && patientInfo.lastName && patientInfo.email && patientInfo.phone && patientInfo.dateOfBirth && patientInfo.gender && patientInfo.reasonId && !hasErrors

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
              {(() => {
                const [year, month, day] = selectedDate.split('-').map(Number)
                const localDate = new Date(year, month - 1, day)
                return localDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })
              })()} at {selectedSlot?.time}
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
              onBlur={() => handleBlur('firstName')}
              maxLength={LIMITS.firstName}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                touched.firstName && validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
            {touched.firstName && validationErrors.firstName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{validationErrors.firstName}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={patientInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              maxLength={LIMITS.lastName}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                touched.lastName && validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
            {touched.lastName && validationErrors.lastName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{validationErrors.lastName}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={patientInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            maxLength={LIMITS.email}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
              touched.email && validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          {touched.email && validationErrors.email && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              <span>{validationErrors.email}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={patientInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            maxLength={LIMITS.phone}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
              touched.phone && validationErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5551234567"
            pattern="[0-9]*"
            title="Digits only"
          />
          {touched.phone && validationErrors.phone && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              <span>{validationErrors.phone}</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <input
              type="date"
              value={patientInfo.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                touched.dateOfBirth && validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {touched.dateOfBirth && validationErrors.dateOfBirth && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{validationErrors.dateOfBirth}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              value={patientInfo.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as 'M' | 'F')}
              onBlur={() => handleBlur('gender')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                touched.gender && validationErrors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="" disabled hidden>
                Select gender
              </option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            {touched.gender && validationErrors.gender && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{validationErrors.gender}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit *</label>
          {loadingReasons ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500">Loading visit reasons...</span>
              </div>
            </div>
          ) : (
            <>
              <select
                value={patientInfo.reasonId || ''}
                onChange={(e) => handleReasonChange(e.target.value)}
                onBlur={() => handleBlur('reasonId')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  touched.reasonId && validationErrors.reasonId ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="" disabled hidden>
                  Select reason for visit
                </option>
                {visitReasons.map((reason) => (
                  <option key={reason.visit_reason_id} value={reason.visit_reason_id}>
                    {reason.visit_reason}
                    {reason.description && ` - ${reason.description}`}
                  </option>
                ))}
              </select>
              {touched.reasonId && validationErrors.reasonId && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  <span>{validationErrors.reasonId}</span>
                </div>
              )}
            </>
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
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
