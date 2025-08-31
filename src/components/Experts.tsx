'use client'

import { useState } from 'react'
import { Calendar, Star, MapPin, Phone, Mail } from 'lucide-react'

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
}

interface ExpertsProps {
  doctors?: Doctor[]
  title?: string
  subtitle?: string
}

const defaultDoctors: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Eric Liberman',
    title: 'Obstetrics and Gynecology',
    credentials: 'MD, FACOG',
    specialties: ['Fibroid Treatment', 'Minimally Invasive Surgery', 'Women\'s Health'],
    experience: '25+ years',
    bio: 'Dr. Liberman is a board-certified obstetrician-gynecologist with over 25 years of experience in treating fibroids and women\'s health issues. He specializes in minimally invasive surgical techniques.',
    languages: ['English', 'Spanish'],
    availability: ['Monday-Friday', '9:00 AM - 5:00 PM'],
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'dr.liberman@holyname.com',
      office: 'Suite 200, Main Building'
    },
    rating: 4.9
  },
  {
    _id: '2',
    name: 'Dr. Sarah Chen',
    title: 'Gynecologic Oncology',
    credentials: 'MD, PhD',
    specialties: ['Complex Fibroid Cases', 'Cancer Screening', 'Surgical Oncology'],
    experience: '15+ years',
    bio: 'Dr. Chen is a gynecologic oncologist who specializes in complex fibroid cases and cancer screening. She brings advanced surgical expertise to our team.',
    languages: ['English', 'Mandarin'],
    availability: ['Tuesday-Thursday', '10:00 AM - 6:00 PM'],
    contactInfo: {
      phone: '+1 (555) 123-4568',
      email: 'dr.chen@holyname.com',
      office: 'Suite 201, Main Building'
    },
    rating: 4.8
  }
]

export default function Experts({ doctors = defaultDoctors, title = 'Meet Our Experts', subtitle = 'Our team of specialized physicians is dedicated to providing the highest quality fibroid care' }: ExpertsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const handleBookAppointment = async (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowAppointmentModal(true)
    
    // Here you would integrate with your appointment booking API
    try {
      // Example API call
      // const response = await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ doctorId: doctor._id })
      // })
      console.log('Booking appointment for:', doctor.name)
    } catch (error) {
      console.error('Error booking appointment:', error)
    }
  }

  return (
    <section id="dr-liberman" className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#093b60] mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Doctor Header */}
              <div className="bg-gradient-to-r from-[#093b60] to-[#01a69c] p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{doctor.name || 'Doctor'}</h3>
                    <p className="text-white/90">{doctor.title || 'Specialist'}</p>
                    <p className="text-white/80 text-sm">{doctor.credentials || 'MD'}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Content */}
              <div className="p-6">
                {doctor.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(doctor.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{doctor.rating} rating</span>
                  </div>
                )}

                {doctor.bio && (
                  <p className="text-gray-700 mb-4">{doctor.bio}</p>
                )}

                {/* Specialties */}
                {doctor.specialties && doctor.specialties.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#093b60] mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-[#01a69c]/10 text-[#01a69c] rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {doctor.contactInfo && (
                  <div className="space-y-2 mb-6">
                    {doctor.contactInfo.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{doctor.contactInfo.phone}</span>
                      </div>
                    )}
                    {doctor.contactInfo.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{doctor.contactInfo.email}</span>
                      </div>
                    )}
                    {doctor.contactInfo.office && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span>{doctor.contactInfo.office}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Book Appointment Button */}
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <Calendar size={18} />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Appointment Modal */}
        {showAppointmentModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-[#093b60] mb-4">
                Book Appointment with {selectedDoctor.name}
              </h3>
              <p className="text-gray-600 mb-6">
                We'll contact you to confirm your appointment details.
              </p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                />
                <textarea
                  placeholder="Preferred Date/Time (Optional)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01a69c] focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would submit the appointment request
                    console.log('Appointment request submitted')
                    setShowAppointmentModal(false)
                  }}
                  className="flex-1 btn-primary"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
