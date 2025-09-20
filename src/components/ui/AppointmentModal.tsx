'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { doctorsApi, type TimeSlot } from '@/services/doctorsApi'
import DateSelector from './DateSelector'
import TimeSelector from './TimeSelector'
import PatientInfoForm from './PatientInfoForm'
import AppointmentConfirmation from './AppointmentConfirmation'


interface Doctor {
  _id?: string
  name?: string
  npi?: string
  organization?: {
    organizationId?: string
    organizationName?: string
  }
}

interface PatientInfo {
  name: string
  email: string
  phone: string
  reason: string
}

interface AppointmentModalProps {
  isOpen: boolean
  selectedDoctor: Doctor | null
  onClose: () => void
}

type Step = 'select-date' | 'select-time' | 'patient-info' | 'confirmation'

export default function AppointmentModal({ isOpen, selectedDoctor, onClose }: AppointmentModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-date')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    email: '',
    phone: '',
    reason: ''
  })
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const resetModal = () => {
    setCurrentStep('select-date')
    setSelectedDate('')
    setSelectedSlot(null)
    setPatientInfo({ name: '', email: '', phone: '', reason: '' })
    setAvailableSlots([])
    setLoadingSlots(false)
    onClose()
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 12; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date)
    setCurrentStep('select-time')
    
    if (selectedDoctor?.npi && selectedDoctor?.organization?.organizationId) {
      setLoadingSlots(true)
      try {
        const slots = await doctorsApi.getSlots({
          providerId: selectedDoctor.npi,
          locationId: selectedDoctor.organization.organizationId,
          startDate: date,
          endDate: date
        })
        setAvailableSlots(slots)
      } catch (error) {
        console.error('Error fetching slots:', error)
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    } else {
      setAvailableSlots([])
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setCurrentStep('patient-info')
  }

  const handleSubmitAppointment = () => {
    console.log('Booking appointment:', {
      doctor: selectedDoctor?.name,
      date: selectedDate,
      time: selectedSlot?.time,
      patient: patientInfo
    })
    setCurrentStep('confirmation')
  }

  if (!isOpen || !selectedDoctor) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={resetModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-[#093b60] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Book Appointment</h3>
                <p className="text-blue-100 mt-1">with {selectedDoctor.name}</p>
              </div>
              <button
                onClick={resetModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 'select-date' && (
                <DateSelector
                  availableDates={getAvailableDates()}
                  onDateSelect={handleDateSelect}
                />
              )}

              {currentStep === 'select-time' && (
                <TimeSelector
                  selectedDate={selectedDate}
                  availableSlots={availableSlots}
                  loadingSlots={loadingSlots}
                  onSlotSelect={handleSlotSelect}
                  onBack={() => setCurrentStep('select-date')}
                />
              )}

              {currentStep === 'patient-info' && (
                <PatientInfoForm
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  patientInfo={patientInfo}
                  onPatientInfoChange={setPatientInfo}
                  onSubmit={handleSubmitAppointment}
                  onBack={() => setCurrentStep('select-time')}
                />
              )}

              {currentStep === 'confirmation' && (
                <AppointmentConfirmation
                  selectedDoctor={selectedDoctor}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  patientInfo={patientInfo}
                  onClose={resetModal}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
