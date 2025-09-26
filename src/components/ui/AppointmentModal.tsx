'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { doctorsApi, type TimeSlot, type AvailableDate } from '@/services/doctorsApi'
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
  firstName: string
  lastName: string
  email: string
  phone: string
  reason: string
  reasonId: string
  dateOfBirth: string
  gender: 'M' | 'F'
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    reasonId: '',
    dateOfBirth: '',
    gender: 'M'
  })
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [bookingAppointment, setBookingAppointment] = useState(false)
  const [appointmentId, setAppointmentId] = useState<string | undefined>()
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [datesError, setDatesError] = useState<string | null>(null)

  const resetModal = () => {
    setCurrentStep('select-date')
    setSelectedDate('')
    setSelectedSlot(null)
    setPatientInfo({ firstName: '', lastName: '', email: '', phone: '', reason: '', reasonId: '', dateOfBirth: '', gender: 'M' })
    setAvailableSlots([])
    setAvailableDates([])
    setLoadingDates(false)
    setBookingAppointment(false)
    setAppointmentId(undefined)
    setBookingError(null)
    setDatesError(null)
    onClose()
  }

  // Load available dates when modal opens and doctor is selected
  useEffect(() => {
    if (isOpen && selectedDoctor?.npi && currentStep === 'select-date') {
      setLoadingDates(true)
      setAvailableDates([])
      
      doctorsApi.getAvailableDates({
        providerId: selectedDoctor.npi,
        noOfDays: 7
      })
      .then(dates => {
        setAvailableDates(dates)
      })
      .catch(error => {
        console.error('Error fetching available dates:', error)
        setAvailableDates([])
        setDatesError('Failed to load available dates. Please try again.')
      })
      .finally(() => {
        setLoadingDates(false)
      })
    }
  }, [isOpen, selectedDoctor?.npi, currentStep])


  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setCurrentStep('select-time')
    
    // Find the selected date in our available dates and use its pre-loaded slots
    const selectedDateInfo = availableDates.find(d => d.date === date)
    if (selectedDateInfo && selectedDateInfo.slots) {
      setAvailableSlots(selectedDateInfo.slots)
    } else {
      setAvailableSlots([])
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setCurrentStep('patient-info')
  }

  const handleSubmitAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || bookingAppointment) return

    setBookingAppointment(true)
    setBookingError(null)
    
    try {
      // Step 1: Validate first and last name
      const firstName = patientInfo.firstName.trim()
      const lastName = patientInfo.lastName.trim()

      if (!firstName || !lastName) {
        setBookingError('Please enter both first and last name.')
        return
      }

      // Step 2: Convert date format for patient search (YYYY-MM-DD -> MM-DD-YYYY)
      const dateOfBirth = patientInfo.dateOfBirth
      const [year, month, day] = dateOfBirth.split('-')
      const searchDateFormat = `${month}-${day}-${year}`

      // Step 3: Search for existing patient
      const searchData = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: searchDateFormat,
        email_address: patientInfo.email,
        phone_number: patientInfo.phone,
        gender: patientInfo.gender,
        provider_id: selectedDoctor.npi || '',
        patient_id: ''
      }

      let patientId: string = ''
      
      try {
        const existingPatients = await doctorsApi.searchPatient(searchData)
        
        if (existingPatients.length > 0) {
          // Patient found, use existing patient ID
          patientId = existingPatients[0].patient_id
        } else {
          // Patient not found, create new patient
          const createData = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth, // Use YYYY-MM-DD format for creation
            email_address: patientInfo.email,
            phone_number: patientInfo.phone,
            gender: patientInfo.gender
          }

          const newPatient = await doctorsApi.createPatient(createData)
          patientId = newPatient.patient_id
        }
      } catch (patientError) {
        console.error('Error with patient search/create:', patientError)
        setBookingError('Failed to process patient information. Please try again.')
        return
      }

      // Step 4: Book appointment with patient ID
      const bookingData = {
        doctorId: selectedDoctor._id || '',
        providerId: selectedDoctor.npi || '',
        locationId: selectedDoctor.organization?.organizationId || '',
        startTime: selectedSlot.startTime || '',
        duration: "30",
        patientId: patientId,
        visitReasonId: patientInfo.reasonId || 'PMNP', // Default to consultation if not selected
        patientInfo: {
          name: `${patientInfo.firstName} ${patientInfo.lastName}`,
          email: patientInfo.email,
          phone: patientInfo.phone,
          reason: patientInfo.reason
        }
      }

      const result = await doctorsApi.bookAppointment(bookingData)
      
      if (result.success) {
        setAppointmentId(result.appointmentId)
        setCurrentStep('confirmation')
      } else {
        console.error('Booking failed:', result.error)
        setBookingError(result.error || 'Failed to book appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error during booking:', error)
      setBookingError('An error occurred while booking the appointment. Please check your connection and try again.')
    } finally {
      setBookingAppointment(false)
    }
  }

  const retryLoadDates = () => {
    setDatesError(null)
    setLoadingDates(true)
    setAvailableDates([])
    
    doctorsApi.getAvailableDates({
      providerId: selectedDoctor?.npi || '',
      noOfDays: 7
    })
    .then(dates => {
      setAvailableDates(dates)
    })
    .catch(error => {
      console.error('Error fetching available dates:', error)
      setAvailableDates([])
      setDatesError('Failed to load available dates. Please try again.')
    })
    .finally(() => {
      setLoadingDates(false)
    })
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
          className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-[#093b60] text-white p-6 flex-shrink-0">
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

          {/* Modal Content - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1">
            <AnimatePresence mode="wait">
              {currentStep === 'select-date' && (
                <DateSelector
                  availableDates={availableDates}
                  onDateSelect={handleDateSelect}
                  loading={loadingDates}
                  error={datesError}
                  onRetry={retryLoadDates}
                />
              )}

              {currentStep === 'select-time' && (
                <TimeSelector
                  selectedDate={selectedDate}
                  availableSlots={availableSlots}
                  loadingSlots={false}
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
                  isSubmitting={bookingAppointment}
                  error={bookingError}
                  onClearError={() => setBookingError(null)}
                />
              )}

              {currentStep === 'confirmation' && (
                <AppointmentConfirmation
                  selectedDoctor={selectedDoctor}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  patientInfo={patientInfo}
                  appointmentId={appointmentId}
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
