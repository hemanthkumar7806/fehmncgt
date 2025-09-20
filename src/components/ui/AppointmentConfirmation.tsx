'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
  type: 'consultation' | 'follow-up'
}

interface Doctor {
  name?: string
}

interface PatientInfo {
  email: string
}

interface AppointmentConfirmationProps {
  selectedDoctor: Doctor
  selectedDate: string
  selectedSlot: TimeSlot | null
  patientInfo: PatientInfo
  onClose: () => void
}

export default function AppointmentConfirmation({
  selectedDoctor,
  selectedDate,
  selectedSlot,
  patientInfo,
  onClose
}: AppointmentConfirmationProps) {
  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={32} className="text-green-600" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">Appointment Scheduled!</h4>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{selectedDoctor.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{selectedSlot?.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{selectedSlot?.type}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        A confirmation email has been sent to {patientInfo.email}. 
        Please arrive 15 minutes early for your appointment.
      </p>
      
      <button
        onClick={onClose}
        className="w-full bg-[#01a69c] hover:bg-[#01a69c]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        Done
      </button>
    </motion.div>
  )
}
