'use client'

import { useState } from 'react'
import { Calendar, Star, Clock, ChevronLeft, ChevronRight, Check, X} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';

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
  bio?: string
  languages?: string[]
  availability?: string[]
  contactInfo?: {
    phone?: string
    email?: string
    office?: string
  }
  rating?: number
  appointmentLink?: string
  timeSlots?: { [date: string]: TimeSlot[] }
}

interface ExpertsProps {
  doctors?: Doctor[]
  title?: string
  subtitle?: string
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const times = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ]
  
  times.forEach(time => {
    slots.push({
      time,
      available: Math.random() > 0.3, // Random availability for demo
      type: Math.random() > 0.7 ? 'follow-up' : 'consultation'
    })
  })
  
  return slots
}

const getNextDates = (count: number) => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= count; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  return dates
}

const defaultDoctors: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Eric Liberman',
    title: 'Obstetrics and Gynecology',
    credentials: 'MD, FACOG',
    specialties: ['Fibroid Treatment', 'Minimally Invasive Surgery', 'Women\'s Health'],
    experience: '25+ years',
    bio: 'Board-certified obstetrician-gynecologist specializing in minimally invasive fibroid treatments and comprehensive women\'s health care.',
    languages: ['English', 'Spanish'],
    availability: ['Monday-Friday', '9:00 AM - 5:00 PM'],
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'dr.liberman@holyname.com',
      office: 'Suite 200, Main Building'
    },
    rating: 4.9,
    timeSlots: getNextDates(14).reduce((acc, date) => {
      const dateStr = date.toISOString().split('T')[0]
      acc[dateStr] = generateTimeSlots()
      return acc
    }, {} as { [date: string]: TimeSlot[] })
  },
  {
    _id: '2',
    name: 'Dr. Sarah Chen',
    title: 'Gynecologic Oncology',
    credentials: 'MD, PhD',
    specialties: ['Complex Fibroid Cases', 'Cancer Screening', 'Surgical Oncology'],
    experience: '15+ years',
    bio: 'Gynecologic oncologist with expertise in complex fibroid cases and advanced surgical techniques for optimal patient outcomes.',
    languages: ['English', 'Mandarin'],
    availability: ['Tuesday-Thursday', '10:00 AM - 6:00 PM'],
    contactInfo: {
      phone: '+1 (555) 123-4568',
      email: 'dr.chen@holyname.com',
      office: 'Suite 201, Main Building'
    },
    rating: 4.8,
    timeSlots: getNextDates(14).reduce((acc, date) => {
      const dateStr = date.toISOString().split('T')[0]
      acc[dateStr] = generateTimeSlots()
      return acc
    }, {} as { [date: string]: TimeSlot[] })
  },
  {
    _id: '3',
    name: 'Dr. Michael Rodriguez',
    title: 'Interventional Radiology',
    credentials: 'MD, FSIR',
    specialties: ['UFE (Uterine Fibroid Embolization)', 'Image-Guided Procedures', 'Vascular Interventions'],
    experience: '18+ years',
    bio: 'Interventional radiologist specializing in non-surgical fibroid treatments including uterine fibroid embolization and other minimally invasive procedures.',
    languages: ['English', 'Spanish', 'Portuguese'],
    availability: ['Monday-Wednesday-Friday', '8:00 AM - 4:00 PM'],
    contactInfo: {
      phone: '+1 (555) 123-4569',
      email: 'dr.rodriguez@holyname.com',
      office: 'Suite 150, Radiology Wing'
    },
    rating: 4.7,
    timeSlots: getNextDates(14).reduce((acc, date) => {
      const dateStr = date.toISOString().split('T')[0]
      acc[dateStr] = generateTimeSlots()
      return acc
    }, {} as { [date: string]: TimeSlot[] })
  },
  {
    _id: '4',
    name: 'Dr. Jennifer Thompson',
    title: 'Reproductive Endocrinology',
    credentials: 'MD, FACOG, REI',
    specialties: ['Fertility Preservation', 'Fibroid Impact on Fertility', 'Reproductive Surgery'],
    experience: '12+ years',
    bio: 'Reproductive endocrinologist focused on helping women with fibroids achieve their fertility goals through advanced reproductive techniques and surgical interventions.',
    languages: ['English', 'French'],
    availability: ['Tuesday-Thursday-Saturday', '10:00 AM - 6:00 PM'],
    contactInfo: {
      phone: '+1 (555) 123-4570',
      email: 'dr.thompson@holyname.com',
      office: 'Suite 300, Fertility Center'
    },
    rating: 4.9,
    timeSlots: getNextDates(14).reduce((acc, date) => {
      const dateStr = date.toISOString().split('T')[0]
      acc[dateStr] = generateTimeSlots()
      return acc
    }, {} as { [date: string]: TimeSlot[] })
  }
]

export default function Experts({ doctors = defaultDoctors, title = 'Meet Our Experts', subtitle = 'Our team of specialized physicians is dedicated to providing the highest quality fibroid care' }: ExpertsProps) {
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
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowAppointmentModal(true)
    setCurrentStep('select-date')
    setSelectedDate('')
    setSelectedSlot(null)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setCurrentStep('select-time')
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

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const resetModal = () => {
    setShowAppointmentModal(false)
    setCurrentStep('select-date')
    setSelectedDate('')
    setSelectedSlot(null)
    setPatientInfo({ name: '', email: '', phone: '', reason: '' })
  }

  const getAvailableDates = () => {
    if (!selectedDoctor?.timeSlots) {
      console.log('No timeSlots for selected doctor:', selectedDoctor)
      return []
    }
    
    const dates = Object.keys(selectedDoctor.timeSlots)
      .sort()
      .slice(0, 7) // Show next 7 days
    
    console.log('Available dates:', dates)
    return dates
  }

  return (
    <section id="experts" className="py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
           
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
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
                    {/* Compact Doctor Header */}
                    <div className="relative bg-[#093b60] p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 mx-auto mb-3">
                          <span className="text-xl font-bold text-white">
                            {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{doctor.name || 'Doctor'}</h3>
                        <p className="text-white/90 text-sm mb-1">{doctor.title || 'Specialist'}</p>
                        <p className="text-white/80 text-xs">{doctor.credentials || 'MD'}</p>
                        <div className="flex items-center justify-center mt-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < Math.floor(doctor.rating || 0) ? 'text-yellow-300 fill-current' : 'text-white/30'} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-white/90">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Doctor Content */}
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
                          <Clock size={12} className="mr-2 text-[#093b60]" />
                          <span>{doctor.experience}</span>
                        </div>
                      </div>

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
        </div>

        {/* Professional Appointment Modal - Based on xmfsmixi.manus.space */}
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
                          {getAvailableDates().map(date => {
                            const availableSlots = selectedDoctor.timeSlots?.[date]?.filter(slot => slot.available).length || 0
                            
                            return (
                              <button
                                key={date}
                                onClick={() => handleDateSelect(date)}
                                className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#01a69c] hover:bg-[#01a69c]/5 transition-all text-left group"
                                disabled={availableSlots === 0}
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
                                      {availableSlots > 0 ? `${availableSlots} slots available` : 'No slots available'}
                                    </div>
                                  </div>
                                  <ChevronRight size={18} className="text-gray-400 group-hover:text-[#01a69c]" />
                                </div>
                              </button>
                            )
                          })}
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
                        
                        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                          {selectedDoctor.timeSlots?.[selectedDate]?.map(slot => (
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
