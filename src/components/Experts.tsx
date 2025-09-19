'use client'

import { useState } from 'react'
import { Calendar, Star, Clock, ChevronLeft, ChevronRight, Check, X, RefreshCw} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { useDoctors } from '@/hooks/useDoctors';

import "swiper/css";
import "swiper/css/navigation";

interface TimeSlot {
  time: string
  available: boolean
  type: 'consultation' | 'follow-up'
}

interface Doctor {
  _id?: string
  name?: string
  title?: string
  credentials?: string
  specialties?: string[]
  experience?: string
  photo?: any
  npi?: string
  contactInfo?: {
    phone?: string
    email?: string
    addressLine1?: string
    city?: string
    state?: string
  }
  organization?: {
    organizationId?: string
    organizationName?: string
  }
}

interface ExpertsProps {
  doctors?: Doctor[]
  title?: string
  subtitle?: string
}

// Default doctors data (fallback)
const defaultDoctors: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Eric Liberman',
    title: 'Gynecologist & Fibroid Specialist',
    credentials: 'D.O.',
    specialties: ['Fibroid Treatment', 'Minimally Invasive Surgery', 'Women\'s Health'],
    experience: '15+ years',
    npi: '1780818146',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'dr.liberman@hnmc.com',
      addressLine1: '3332 ROCHAMBEAU AVE',
      city: 'Bronx',
      state: 'New York'
    }
  }
]

export default function Experts({ doctors: propDoctors, title = 'Meet Our Experts', subtitle = 'Our team of specialized physicians is dedicated to providing the highest quality fibroid care' }: ExpertsProps) {
  // Use API data or fallback to props/default
  const { doctors: apiDoctors, isLoading, error, refetch } = useDoctors()
  const doctors = apiDoctors.length > 0 ? apiDoctors : (propDoctors || defaultDoctors)
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [currentStep, setCurrentStep] = useState<'select-date' | 'select-time' | 'patient-info' | 'confirmation'>('select-date')
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  })
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleBookAppointment = (doctor: Doctor) => {
    console.log('Selected doctor:', doctor)
    setSelectedDoctor(doctor)
    setShowAppointmentModal(true)
    setCurrentStep('select-date')
    setSelectedDate('')
    setSelectedSlot(null)
  }

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date)
    setCurrentStep('select-time')
    
    // Fetch real slots for the selected date
    if (selectedDoctor?.npi && selectedDoctor?.organization?.organizationId) {
      setLoadingSlots(true)
      try {
        console.log('Fetching slots for:', {
          provider_id: selectedDoctor.npi,
          location_id: selectedDoctor.organization.organizationId,
          date
        })
        const response = await fetch(`/api/doctors/slots?provider_id=${selectedDoctor.npi}&location_id=${selectedDoctor.organization.organizationId}&start_date=${date}&end_date=${date}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Slots API response:', data)
          if (data.success && data.data && data.data.length > 0) {
            setAvailableSlots(data.data)
          } else {
            console.log('No slots available for this date')
            setAvailableSlots([])
          }
        } else {
          console.log('Slots API error')
          setAvailableSlots([])
        }
      } catch (error) {
        console.error('Error fetching slots:', error)
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    } else {
      console.log('Missing doctor data:', {
        npi: selectedDoctor?.npi,
        organization: selectedDoctor?.organization
      })
      setAvailableSlots([])
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setCurrentStep('patient-info')
  }

  const handleSubmitAppointment = () => {
    // Here you would integrate with your appointment booking API
    console.log('Booking appointment:', {
      doctor: selectedDoctor?.name,
      date: selectedDate,
      time: selectedSlot?.time,
      patient: patientInfo
    })
    setCurrentStep('confirmation')
  }

  const resetModal = () => {
    setShowAppointmentModal(false)
    setCurrentStep('select-date')
    setSelectedDate('')
    setSelectedSlot(null)
    setPatientInfo({ name: '', email: '', phone: '', reason: '' })
    setAvailableSlots([])
  }


  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  return (
    <section id="experts" className="py-10">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">{title}</h2>
            {isLoading && (
              <RefreshCw className="w-8 h-8 text-[#01a69c] animate-spin" />
            )}
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
          
          {/* Error State */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-800 font-medium">Failed to load doctors</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => swiper?.slidePrev()}
              disabled={isBeginning}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isBeginning
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#093b60] text-[#093b60] hover:bg-[#093b60] hover:text-white hover:shadow-lg'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              disabled={isEnd}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isEnd
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#093b60] text-[#093b60] hover:bg-[#093b60] hover:text-white hover:shadow-lg'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctors Slider */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-32"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              onSwiper={setSwiper}
              onSlideChange={handleSlideChange}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="doctors-swiper"
            >
              {doctors.map((doctor, index) => (
                <SwiperSlide key={doctor._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      {/* Doctor Header */}
                      <div className="relative bg-[#093b60] p-4">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-4 border-white mx-auto mb-3 overflow-hidden shadow-lg">
                            {index === 0 ? (
                              <Image
                                src="/dr_eric_liberman.webp"
                                alt={doctor.name || 'Dr. Eric Liberman'}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover object-top rounded-full"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-white">
                                {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{doctor.name || 'Doctor'}</h3>
                          <p className="text-white/90 text-sm mb-1">{doctor.title || 'Specialist'}</p>
                          <p className="text-white/80 text-xs">{doctor.credentials || 'MD'}</p>
                        </div>
                      </div>

                      {/* Doctor Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        {/* Specialties */}
                        {doctor.specialties && doctor.specialties.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                              <div className="w-1.5 h-1.5 bg-[#093b60] rounded-full mr-2"></div>
                              Specialties
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {doctor.specialties.slice(0, 2).map((specialty, index) => (
                                <span key={index} className="px-2 py-1 bg-[#01a69c]/10 text-[#01a69c] rounded-full text-xs font-medium border border-[#01a69c]/20">
                                  {specialty}
                                </span>
                              ))}
                              {doctor.specialties.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                  +{doctor.specialties.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-[#093b60] rounded-full mr-2"></span>
                            <span>{doctor.experience}</span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        {doctor.contactInfo && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                              <div className="w-1.5 h-1.5 bg-[#093b60] rounded-full mr-2"></div>
                              Contact
                            </h4>
                            <div className="text-xs text-gray-600 space-y-1">
                              {doctor.contactInfo.phone && (
                                <p>📞 {doctor.contactInfo.phone}</p>
                              )}
                              {doctor.contactInfo.email && (
                                <p>✉️ {doctor.contactInfo.email}</p>
                              )}
                              {doctor.contactInfo.addressLine1 && (
                                <p>📍 {doctor.contactInfo.addressLine1}, {doctor.contactInfo.city}, {doctor.contactInfo.state}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Book Appointment Button */}
                        <div className="mt-auto">
                          <button
                            onClick={() => handleBookAppointment(doctor)}
                            className="w-full bg-[#01a69c] hover:bg-[#01a69c]/90 text-white py-2.5 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                          >
                            <Calendar size={16} />
                            <span>Book Appointment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Professional Appointment Modal */}
        <AnimatePresence>
          {showAppointmentModal && selectedDoctor && (
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
                      <motion.div
                        key="select-date"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Date</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {getAvailableDates().map(date => (
                            <button
                              key={date}
                              onClick={() => handleDateSelect(date)}
                              className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#01a69c] hover:bg-[#01a69c]/5 transition-all text-left group"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-gray-900 group-hover:text-[#01a69c]">
                                    {new Date(date).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Available slots
                                  </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#01a69c]" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 'select-time' && (
                      <motion.div
                        key="select-time"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="flex items-center mb-4">
                          <button
                            onClick={() => setCurrentStep('select-date')}
                            className="mr-3 p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronLeft size={20} className="text-gray-600" />
                          </button>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Select Time</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {loadingSlots ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-[#01a69c]" />
                            <span className="ml-2 text-gray-600">Loading available slots...</span>
                          </div>
                        ) : availableSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                            {availableSlots.map(slot => (
                              <button
                                key={slot.time}
                                onClick={() => slot.available && handleSlotSelect(slot)}
                                disabled={!slot.available}
                                className={`p-3 border rounded-lg text-center transition-all ${
                                  slot.available
                                    ? 'border-gray-200 hover:border-[#01a69c] hover:bg-[#01a69c] hover:text-white'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <div className="font-semibold text-sm">{slot.time}</div>
                                <div className="text-xs opacity-75 capitalize">{slot.type}</div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Slots Available</h4>
                            <p className="text-gray-600 text-sm mb-4">
                              There are no available appointment slots for this date.
                            </p>
                            <button
                              onClick={() => setCurrentStep('select-date')}
                              className="px-4 py-2 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white rounded-lg font-medium transition-colors text-sm"
                            >
                              Choose Different Date
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 'patient-info' && (
                      <motion.div
                        key="patient-info"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="flex items-center mb-4">
                          <button
                            onClick={() => setCurrentStep('select-time')}
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
                              onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <input
                              type="email"
                              value={patientInfo.email}
                              onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                              placeholder="Enter your email"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <input
                              type="tel"
                              value={patientInfo.phone}
                              onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                            <textarea
                              value={patientInfo.reason}
                              onChange={(e) => setPatientInfo({...patientInfo, reason: e.target.value})}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent resize-none"
                              placeholder="Brief description of your concerns..."
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                          <button
                            onClick={() => setCurrentStep('select-time')}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleSubmitAppointment}
                            disabled={!patientInfo.name || !patientInfo.email || !patientInfo.phone}
                            className="flex-1 px-4 py-2 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 'confirmation' && (
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
                          onClick={resetModal}
                          className="w-full bg-[#01a69c] hover:bg-[#01a69c]/90 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Done
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .doctors-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  )
}