'use client';

import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { useState } from 'react';
import AppointmentModal from './ui/AppointmentModal';
import InfoModal from './InfoModal';
import { useDoctorContext } from '@/contexts/DoctorContext';
import { mockDoctors } from '@/data/mockDoctors';

export default function DoctorSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const { doctors, isApiResolved, error } = useDoctorContext();
  
  const apiDoctor = doctors[0];
  const isFallback = Boolean(error || !apiDoctor);
  
  // Use mock doctor data as fallback
  const doctor = isFallback ? mockDoctors[0] : apiDoctor;

  // Remove the loading state since we always show mock data immediately
  const photoUrl = typeof doctor.photo === 'string' ? doctor.photo : doctor.photo?.asset?.url;

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
        {/* Doctor Image - Full Width */}
        <div className="relative h-96 w-full">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={doctor.name || 'Doctor'}
              fill
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
              </span>
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          {/* Main Content */}
          <div>
            {/* Doctor Name */}
            <h2 className="text-2xl font-bold text-primary mb-2">
              {doctor.name}
            </h2>
            
            {/* Doctor Title */}
            <p className="text-lg text-secondary font-medium mb-4">
              {doctor.title}
            </p>
            
            {/* Doctor Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {doctor.description || "Board-certified specialist in advanced hysteroscopic fibroid resection, helping women preserve fertility while achieving symptom relief."}
            </p>
            
            {/* Specialties */}
            {doctor.specialties && doctor.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {doctor.specialties.slice(0, 2).map((specialty, index) => (
                  <span key={index} className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons - Book Appointment disabled when API hasn't resolved, View Profile always enabled */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
              disabled={!isApiResolved}
              onClick={() => isApiResolved && setIsModalOpen(true)}
              className={!isApiResolved
                ? 'bg-gray-300 text-gray-500 py-3 px-4 rounded font-medium flex items-center justify-center cursor-not-allowed'
                : 'bg-secondary text-white py-3 px-4 rounded hover:bg-opacity-90 transition font-medium flex items-center justify-center'
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </button>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="text-secondary hover:text-primary transition font-medium py-3 px-4 border border-secondary/20 rounded hover:bg-secondary/5 flex items-center justify-center"
            >
              <User className="w-4 h-4 mr-2" />
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Always render InfoModal for View Profile, only render AppointmentModal when API resolved */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        doctor={doctor}
        onBookAppointment={() => {
          if (isApiResolved) {
            setIsInfoModalOpen(false);
            setIsModalOpen(true);
          }
        }}
      />
      {isApiResolved && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDoctor={doctor || null}
        />
      )}
    </>
  );
}
