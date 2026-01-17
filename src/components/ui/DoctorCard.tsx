'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Stethoscope, Award, ExternalLink, User, X, GraduationCap } from 'lucide-react'
import Image from 'next/image'

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
  description?: string
  about?: string
  education?: {
    medicalSchool?: string
    internship?: string
    residency?: string
    fellowship?: string
  }
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

interface DoctorCardProps {
  doctor: Doctor
  index: number
  onBookAppointment: (doctor: Doctor) => void
}

export default function DoctorCard({ doctor, index, onBookAppointment }: DoctorCardProps) {
  const [showBioModal, setShowBioModal] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 h-full flex flex-col">
        {/* Doctor Header - Horizontal Layout */}
        <div className="relative bg-primary p-4">
          <div className="flex items-center gap-5">
            {/* Large Square Doctor Image - Left Side */}
            <div className="w-28 h-28 bg-primary rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
              {doctor.photo ? (
                <Image
                  src={typeof doctor.photo === 'string' ? doctor.photo : doctor.photo.asset?.url || ''}
                  alt={doctor.name || 'Doctor'}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                </span>
              )}
            </div>
            
            {/* Doctor Details - Right Side */}
            <div className="flex-1 text-left">
              {doctor.profileLink ? (
                <a 
                  href={doctor.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white mb-1 hover:text-white/90 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>{doctor.name || ''}</span>
                  <ExternalLink size={16} className="flex-shrink-0" />
                </a>
              ) : (
                <button
                  onClick={() => setShowBioModal(true)}
                  className="text-lg font-bold text-white mb-1 hover:text-white/90 transition-colors cursor-pointer text-left"
                >
                  {doctor.name || ''}
                </button>
              )}
              {doctor.title && <p className="text-white/90 text-sm mb-1">{doctor.title}</p>}
              {doctor.credentials && <p className="text-white/80 text-xs">{doctor.credentials}</p>}
            </div>
          </div>
        </div>

        {/* Doctor Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Description */}
          {doctor.description && (
            <div className="mb-4"> 
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {doctor.description}
              </p>
              <button
                onClick={() => setShowBioModal(true)}
                className="text-secondary hover:text-secondary/80 text-sm font-medium mt-2 transition-colors"
              >
                Read more
              </button>
            </div>
          )}

          {/* Specialties */}
          {doctor.specialties && doctor.specialties.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <Stethoscope size={16} className="text-secondary" />
                Specialties
              </h4>
              <div className="flex flex-wrap gap-1">
                {doctor.specialties.slice(0, 2).map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium border border-secondary/20">
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
          {doctor.experience && (
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 gap-2">
                <Award size={16} className="text-secondary flex-shrink-0" />
                <span>Experience: {doctor.experience}</span>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {doctor.contactInfo && (
            <div className="mb-4">
              <div className="text-xs text-gray-600 space-y-2">
                {/* Phone number hidden per client request */}
                {doctor.contactInfo.addressLine1 && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-secondary flex-shrink-0 mt-0.5" />
                    <span>{doctor.contactInfo.addressLine1}, {doctor.contactInfo.city}, {doctor.contactInfo.state}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Book Appointment Button */}
          <div className="mt-auto">
            <button
              onClick={() => onBookAppointment(doctor)}
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bio Modal */}
      <AnimatePresence>
        {showBioModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBioModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content - Responsive Layout */}
              <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                {/* Left Side - Doctor Image & Key Info */}
                <div className="w-full md:w-96 bg-gradient-to-br from-primary to-primary/80 flex flex-col relative">
                  {/* Close Button - Top Right */}
                  <button
                    onClick={() => setShowBioModal(false)}
                    className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white z-10"
                  >
                    <X size={20} className="text-white" />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6">
                    {/* Doctor Image - Moved below close button area */}
                    <div className="text-center mb-6 mt-4 md:mt-0">
                      {doctor.photo ? (
                        <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl mx-auto">
                          <Image
                            src={typeof doctor.photo === 'string' ? doctor.photo : doctor.photo.asset?.url || ''}
                            alt={doctor.name || 'Doctor'}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-white/20 rounded-3xl flex items-center justify-center border-4 border-white/30 mx-auto">
                          <span className="text-6xl font-bold text-white">
                            {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Doctor Basic Info */}
                    <div className="text-white mb-6 text-center">
                      <h2 className="text-xl font-bold mb-2">{doctor.name}</h2>
                      <p className="text-white/90 mb-1">{doctor.title}</p>
                      <p className="text-white/80 text-sm">{doctor.credentials}</p>
                      {doctor.experience && (
                        <div className="mt-3 flex items-center justify-center text-white/90 gap-2">
                          <Award size={16} className="flex-shrink-0" />
                          <span className="text-sm">{doctor.experience}</span>
                        </div>
                      )}
                    </div>

                    {/* Specialties Section - Left Side */}
                    {doctor.specialties && doctor.specialties.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <Stethoscope size={16} className="text-white/80" />
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium border border-white/30">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education Section - Left Side */}
                    {doctor.education && (
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <GraduationCap size={16} className="text-white/80" />
                          Education & Training
                        </h3>
                        <div className="space-y-2 text-white/90 text-xs">
                          {doctor.education.medicalSchool && (
                            <div>
                              <span className="font-medium text-white text-xs">Medical School:</span>
                              <div className="text-white/80 text-xs">{doctor.education.medicalSchool}</div>
                            </div>
                          )}
                          {doctor.education.internship && (
                            <div>
                              <span className="font-medium text-white text-xs">Internship:</span>
                              <div className="text-white/80 text-xs">{doctor.education.internship}</div>
                            </div>
                          )}
                          {doctor.education.residency && (
                            <div>
                              <span className="font-medium text-white text-xs">Residency:</span>
                              <div className="text-white/80 text-xs">{doctor.education.residency}</div>
                            </div>
                          )}
                          {doctor.education.fellowship && (
                            <div>
                              <span className="font-medium text-white text-xs">Fellowship:</span>
                              <div className="text-white/80 text-xs">{doctor.education.fellowship}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Content Area */}
                  <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                {/* About Section */}
                {doctor.about && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User size={18} className="text-secondary" />
                      About Dr. {doctor.name?.split(' ').pop()}
                    </h3>
                    <div className="text-gray-600 leading-relaxed space-y-3">
                      {doctor.about.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 md:p-8 bg-gray-50 border-t flex-shrink-0">
                    <button
                      onClick={() => {
                        setShowBioModal(false)
                        onBookAppointment(doctor)
                      }}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 text-base md:text-lg"
                    >
                      <Calendar size={20} />
                      <span>Book Appointment with {doctor.name?.split(' ')[1]}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
