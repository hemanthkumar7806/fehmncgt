'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';
import { useDoctors } from '@/hooks/useDoctors';
import DoctorCard from './ui/DoctorCard'
import AppointmentModal from './ui/AppointmentModal'
import RichTextRenderer from './ui/RichTextRenderer'

import "swiper/css";
import "swiper/css/navigation";


interface Doctor {
  _id?: string
  name?: string
  title?: string
  credentials?: string
  specialties?: string[]
  experience?: string
  photo?: any
  profileLink?: string | null
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
  title?: string
  subtitle?: any[]
  specialityCode?: string
}

export default function Experts({ title, subtitle, specialityCode }: ExpertsProps) {
  const { doctors, isLoading, error, refetch } = useDoctors(specialityCode)
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  // Check if navigation controls should be shown
  // Only show navigation for Swiper (5+ cards)
  const shouldShowNavigation = doctors.length > 4
  
  // If no doctors available and not loading, don't render the section
  if (!isLoading && doctors.length === 0 && !error) {
    return null
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowAppointmentModal(true)
  }

  const handleCloseModal = () => {
    setShowAppointmentModal(false)
    setSelectedDoctor(null)
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
            {title && <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">{title}</h2>}
            {isLoading && (
              <RefreshCw className="w-8 h-8 text-[#01a69c] animate-spin" />
            )}
          </div>
          {subtitle && subtitle.length > 0 && (
            <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-body">
              <RichTextRenderer 
                content={subtitle} 
                className="[&_p]:text-xl [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-0"
              />
            </div>
          )}
        </motion.div>


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
          ) : doctors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Our Specialists Are Currently Unavailable</h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                We&apos;re unable to display our medical specialists at the moment. Please try again later or contact us directly.
              </p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : (
            <>
              {doctors.length <= 4 ? (
                // Static grid for 1-4 cards (centered)
                <div className={`grid gap-6 ${
                  doctors.length === 1 
                    ? 'grid-cols-1 max-w-sm mx-auto' 
                    : doctors.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' 
                    : doctors.length === 3 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {doctors.map((doctor, index) => (
                    <DoctorCard 
                      key={doctor._id}
                      doctor={doctor}
                      index={index}
                      onBookAppointment={handleBookAppointment}
                    />
                  ))}
                </div>
              ) : (
                // Swiper for 5+ cards
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
                      <DoctorCard 
                        doctor={doctor}
                        index={index}
                        onBookAppointment={handleBookAppointment}
                      />
                </SwiperSlide>
              ))}
            </Swiper>
              )}
              
              {/* Navigation Controls - Show only for Swiper (5+ cards) */}
              {shouldShowNavigation && (
                <div className="flex justify-center mt-8">
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
              )}
            </>
          )}
                        </div>

        {/* Appointment Modal */}
        <AppointmentModal
          isOpen={showAppointmentModal}
          selectedDoctor={selectedDoctor}
          onClose={handleCloseModal}
        />
      </div>

      <style jsx global>{`
        .doctors-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  )
}