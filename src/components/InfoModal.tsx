'use client';
/* eslint-disable react/no-unescaped-entities */

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Stethoscope, Award, GraduationCap, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Doctor {
  _id?: string;
  name?: string;
  title?: string;
  credentials?: string;
  specialties?: string[];
  experience?: string;
  photo?: any;
  profileLink?: string | null;
  npi?: string;
  description?: string;
  about?: string;
  education?: {
    medicalSchool?: string;
    internship?: string;
    residency?: string;
    fellowship?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
  };
  organization?: {
    organizationId?: string;
    organizationName?: string;
  };
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

export default function InfoModal({ isOpen, onClose, doctor, onBookAppointment }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
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
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] relative">
              {/* Close Button - Mobile only on left side, Desktop on right side */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 md:right-4 md:top-4 p-2 bg-white/20 md:bg-gray-200 hover:bg-white/30 md:hover:bg-gray-300 rounded-lg transition-colors text-white md:text-gray-600 z-20"
              >
                <X size={18} />
              </button>

              {/* Left Side - Doctor Image & Key Info */}
              <div className="w-full md:w-96 bg-gradient-to-br from-primary to-primary/80 flex flex-col relative">
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-12">
                  {/* Doctor Image - Compact on mobile */}
                  <div className="text-center mb-4 md:mb-6">
                    {doctor.photo ? (
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl mx-auto">
                        <Image
                          src={typeof doctor.photo === 'string' ? doctor.photo : doctor.photo.asset?.url || ''}
                          alt={doctor.name || 'Doctor'}
                          width={192}
                          height={192}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 md:w-48 md:h-48 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center border-4 border-white/30 mx-auto">
                        <span className="text-4xl md:text-6xl font-bold text-white">
                          {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Doctor Basic Info */}
                  <div className="text-white mb-4 md:mb-6 text-center">
                    <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{doctor.name}</h2>
                    <p className="text-white/90 text-sm md:text-base mb-1">{doctor.title}</p>
                    <p className="text-white/80 text-xs md:text-sm">{doctor.credentials}</p>
                    {doctor.experience && (
                      <div className="mt-2 md:mt-3 flex items-center justify-center text-white/90 gap-2">
                        <Award size={14} className="flex-shrink-0 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">{doctor.experience}</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties Section */}
                  {doctor.specialties && doctor.specialties.length > 0 && (
                    <div className="mb-4 md:mb-6">
                      <h3 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3 flex items-center gap-2">
                        <Stethoscope size={14} className="text-white/80 md:w-4 md:h-4" />
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {doctor.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium border border-white/30">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {doctor.education && (
                    <div className="mb-4">
                      <h3 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3 flex items-center gap-2">
                        <GraduationCap size={14} className="text-white/80 md:w-4 md:h-4" />
                        Education & Training
                      </h3>
                      <div className="space-y-1.5 md:space-y-2 text-white/90 text-xs">
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

                  {/* Book Appointment Button - Mobile Only */}
                  <div className="md:hidden mt-auto pt-4">
                    <button
                      onClick={() => {
                        onClose();
                        onBookAppointment(doctor);
                      }}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Calendar size={18} />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Content (Desktop Only) */}
              <div className="hidden md:flex flex-1 flex-col min-h-0">
                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                  {/* About Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User size={18} className="text-secondary" />
                      About Dr. {doctor.name?.split(' ').pop()}
                    </h3>
                    <div className="text-gray-600 leading-relaxed space-y-3">
                      <p>Dr. Eric Liberman is board-certified in Obstetrics and Gynecology and fellowship-trained in Minimally Invasive Gynecologic Surgery (MIGS). He obtained a Focused Practice Designation in MIGS and is the Director of Minimally Invasive Gynecologic Surgery at Holy Name.</p>
                      
                      <p>Dr. Liberman provides patient-centered care tailored to each person and values a teams-based approach to treatment. He's proud to be at Holy Name, where the commitment to compassionate, comprehensive care reflects his own philosophy of a patient-centered approach. The most rewarding part of his work, he says, is hearing how his patients' quality of life has improved after treatment.</p>
                      
                      <p>Dr. Liberman's special interests include abnormal uterine bleeding, fibroids, endometrial polyps, adenomyosis, ovarian cysts, endometriosis, and pelvic pain. His expertise includes Da Vinci robotic-assisted surgery, laparoscopic surgery, and hysteroscopy.</p>
                      
                      <p>Dr. Liberman attended medical school at the New York College of Osteopathic Medicine and completed his internship and residency at Saint Barnabas Medical Center in Livingston, NJ. He then further subspecialized by completing a fellowship in Minimally Invasive Gynecologic Surgery at Montefiore Medical Center, Albert Einstein College of Medicine in Bronx, NY, where he also held academic appointments. Over the past six years Dr. Liberman has served as the Director of Minimally Invasive Gynecologic Surgery at other institutions in New Jersey, including Morristown Medical Center and Cooperman Barnabas Medical Center.</p>
                      
                      <p>Dr. Liberman has published research on topics such as post-operative pain management and robotic-assisted surgery. His work has been published in esteemed medical journals.</p>
                    </div>
                  </div>
                </div>

          
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}