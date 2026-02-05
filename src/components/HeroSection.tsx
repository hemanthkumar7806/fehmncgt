'use client';

import Image from 'next/image';
import { Calendar, UserPlus } from 'lucide-react';
import { useState } from 'react';
import AppointmentModal from './ui/AppointmentModal';
import RichTextRenderer from './ui/RichTextRenderer';
import { useDoctorContext } from '@/contexts/DoctorContext';
import type { HeroData } from '@/types/cms';

const DEFAULT_BADGE = "New Jersey's first designated Hysteroscopic Center of Excellence";
const DEFAULT_BADGE_MOBILE = "NJ's first designated Hysteroscopic Center of Excellence";
const DEFAULT_HEADLINE = 'Expert Fibroid Care in Bergen County';
const DEFAULT_SUBHEADLINE = 'Minimally invasive treatments • Fertility preservation • Same-day consultations available';
const DEFAULT_PRIMARY_CTA = 'Schedule Your Appointment';
const DEFAULT_SECONDARY_CTA = 'Join Care Compass Portal';
const DEFAULT_SECONDARY_URL = 'https://patientportal.holyname.org/login/register/ZEtTdlB...........NRRlk%3D';
const DEFAULT_STATS = [
  { value: '1000+', label: 'Procedures' },
  { value: '98%', label: 'Satisfaction' },
];

export default function HeroSection({ data }: { data?: HeroData | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { doctors, isApiResolved } = useDoctorContext();
  const firstDoctor = doctors[0] || null;

  const handleScheduleAppointment = () => {
    if (isApiResolved && firstDoctor) setIsModalOpen(true);
  };

  if (data?.showSection === false) return null;

  const badgeDesk = data?.badgeText ?? DEFAULT_BADGE;
  const badgeMobile = (data?.badgeTextMobile || data?.badgeText) ?? DEFAULT_BADGE_MOBILE;
  const headline = data?.headline ?? DEFAULT_HEADLINE;
  const subheadline = data?.subheadline;
  const primaryCta = data?.primaryCtaText ?? DEFAULT_PRIMARY_CTA;
  const secondaryCta = data?.secondaryCtaText ?? DEFAULT_SECONDARY_CTA;
  const secondaryUrl = data?.secondaryCtaUrl ?? DEFAULT_SECONDARY_URL;
  const image = data?.image?.asset?.url;
  const imageAlt = data?.image?.alt ?? 'Healthcare professional';
  const stats = (data?.stats && data.stats.length > 0) ? data.stats : DEFAULT_STATS;

  return (
    <>
      <section className="bg-hnmc-gray">
        <div className="px-6 lg:px-8 py-8 sm:py-16">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              {(badgeDesk || badgeMobile) && (
                <div className="inline-block mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-primary to-[#00D98C] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium uppercase tracking-wide block text-center">
                    <span className="hidden sm:inline">{badgeDesk}</span>
                    <span className="sm:hidden">{badgeMobile}</span>
                  </span>
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-primary mb-4 sm:mb-6 leading-tight">
                {headline}
              </h1>
              {subheadline && Array.isArray(subheadline) && subheadline.length > 0 ? (
                <div className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed [&_.prose]:mb-0">
                  <RichTextRenderer content={subheadline} />
                </div>
              ) : (
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {DEFAULT_SUBHEADLINE}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 items-stretch sm:items-center">
                <button
                  onClick={handleScheduleAppointment}
                  disabled={!isApiResolved}
                  className={`px-4 py-2.5 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded transition font-medium flex items-center justify-center text-sm whitespace-nowrap shrink-0 ${
                    isApiResolved
                      ? 'bg-secondary text-white hover:bg-opacity-90 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                  <span className="hidden sm:inline">{primaryCta}</span>
                  <span className="sm:hidden">Book Now</span>
                </button>
                <a
                  href={secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-secondary border-2 border-secondary px-4 py-2.5 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded hover:bg-secondary hover:text-white transition font-medium flex items-center justify-center text-sm whitespace-nowrap shrink-0"
                >
                  <UserPlus className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" />
                  <span className="hidden sm:inline">{secondaryCta}</span>
                  <span className="sm:hidden">Patient Portal</span>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-80 sm:h-96 rounded-lg overflow-hidden shadow-xl">
                {image ? (
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <Image
                    src="/right-side-image-women-doctor-hnmc-fibroid.jpg"
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                {stats.length > 0 && (
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 sm:gap-8">
                      {stats.slice(0, 4).map((s, i) => (
                        <div key={i} className="text-center">
                          <div className="text-3xl sm:text-4xl font-heading font-bold text-secondary">{s.value ?? ''}</div>
                          <div className="text-xs sm:text-sm text-gray-600 mt-1">{s.label ?? ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDoctor={firstDoctor}
      />
    </>
  );
}
