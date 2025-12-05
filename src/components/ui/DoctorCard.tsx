'use client'

import { motion } from 'framer-motion'
import { Calendar, Phone, Mail, MapPin, Stethoscope, Award, ExternalLink } from 'lucide-react'
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
  return (
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
              {doctor.photo ? (
                <Image
                  src={doctor.photo}
                  alt={doctor.name || 'Doctor'}
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
            {doctor.profileLink ? (
              <a 
                href={doctor.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-white mb-1 hover:text-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{doctor.name || ''}</span>
                <ExternalLink size={16} className="flex-shrink-0" />
              </a>
            ) : (
              <h3 className="text-lg font-bold text-white mb-1">{doctor.name || ''}</h3>
            )}
            {doctor.title && <p className="text-white/90 text-sm mb-1">{doctor.title}</p>}
            {doctor.credentials && <p className="text-white/80 text-xs">{doctor.credentials}</p>}
          </div>
        </div>

        {/* Doctor Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Specialties */}
          {doctor.specialties && doctor.specialties.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <Stethoscope size={16} className="text-[#01a69c]" />
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
          {doctor.experience && (
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 gap-2">
                <Award size={16} className="text-[#01a69c] flex-shrink-0" />
                <span>Experience: {doctor.experience}</span>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {doctor.contactInfo && (
            <div className="mb-4">
              <div className="text-xs text-gray-600 space-y-2">
                {doctor.contactInfo.phone && (
                  <a href={`tel:${doctor.contactInfo.phone}`} className="flex items-center gap-2 hover:text-[#01a69c] transition-colors cursor-pointer">
                    <Phone size={14} className="text-[#01a69c] flex-shrink-0" />
                    <span>{doctor.contactInfo.phone}</span>
                  </a>
                )}
                {doctor.contactInfo.email && (
                  <a href={`mailto:${doctor.contactInfo.email}`} className="flex items-center gap-2 hover:text-[#01a69c] transition-colors cursor-pointer">
                    <Mail size={14} className="text-[#01a69c] flex-shrink-0" />
                    <span className="truncate">{doctor.contactInfo.email}</span>
                  </a>
                )}
                {doctor.contactInfo.addressLine1 && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#01a69c] flex-shrink-0 mt-0.5" />
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
              className="w-full bg-[#01a69c] hover:bg-[#01a69c]/90 text-white py-2.5 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
