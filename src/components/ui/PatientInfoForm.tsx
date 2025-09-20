'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
  type: 'consultation' | 'follow-up'
}

interface PatientInfo {
  name: string
  email: string
  phone: string
  reason: string
}

interface PatientInfoFormProps {
  selectedDate: string
  selectedSlot: TimeSlot | null
  patientInfo: PatientInfo
  onPatientInfoChange: (info: PatientInfo) => void
  onSubmit: () => void
  onBack: () => void
}

export default function PatientInfoForm({
  selectedDate,
  selectedSlot,
  patientInfo,
  onPatientInfoChange,
  onSubmit,
  onBack
}: PatientInfoFormProps) {
  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    onPatientInfoChange({
      ...patientInfo,
      [field]: value
    })
  }

  const isFormValid = patientInfo.name && patientInfo.email && patientInfo.phone

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
              day: 'numeric' 
            })} at {selectedSlot?.time}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={patientInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
            placeholder="Enter your full name"
          />
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
          <textarea
            value={patientInfo.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent resize-none"
            placeholder="Brief description of your concerns..."
          />
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className="flex-1 px-4 py-2 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Appointment
        </button>
      </div>
    </motion.div>
  )
}
