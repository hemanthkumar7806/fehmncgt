'use client';

import Image from 'next/image';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppointmentModal from './ui/AppointmentModal';
import { useDoctorContext } from '@/contexts/DoctorContext';
import type { NavbarData, NavLinkItem } from '@/types/cms';

const DEFAULT_LOGO = '/Holy-Name-100-Anniversary.png';
const DEFAULT_ALT = 'Holy Name Medical Center';
const DEFAULT_TAGLINE = 'Fibroid Center';
const DEFAULT_PHONE = '201-833-7212';
const DEFAULT_CTA = 'Book Appointment';
const DEFAULT_CTA_MOBILE = 'Book';

/** Map Sanity internalSection to page section ids (#...) */
const SECTION_TO_HASH: Record<string, string> = {
  home: 'home',
  'about-fibroids': 'symptoms',
  'dr-liberman': 'doctor',
  services: 'services',
  testimonials: 'services',
  insurance: 'insurance',
  appointment: 'doctor',
  resources: 'symptoms',
  about: 'symptoms',
  cta: 'home',
};

const DEFAULT_NAV_LINKS: { href: string; label: string; active?: boolean }[] = [
  { href: '#home', label: 'Home', active: true },
  { href: '#symptoms', label: 'About Fibroids' },
  { href: '#doctor', label: 'Dr. Liberman' },
  { href: '#services', label: 'Services' },
  { href: '#insurance', label: 'Insurance' },
];

export default function Header({ data, navLinks }: { data?: NavbarData | null; navLinks?: NavLinkItem[] | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { doctors, isApiResolved } = useDoctorContext();
  const firstDoctor = doctors[0] || null;

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'symptoms', 'doctor', 'services', 'insurance'];
      const scrollPosition = window.scrollY + 150; // Offset for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    // Set initial active section based on hash or scroll position
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
    }

    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section when clicking on nav links
  const handleNavClick = (href: string) => {
    const hash = href.replace('#', '');
    setActiveSection(hash);
  };

  const handleBookAppointment = () => {
    if (isApiResolved && firstDoctor) setIsModalOpen(true);
  };

  const logoUrl = data?.logo?.asset?.url ?? DEFAULT_LOGO;
  const mobileLogoUrl = data?.mobileLogo?.asset?.url ?? logoUrl;
  const alt = data?.logoAlt ?? DEFAULT_ALT;
  const tagline = data?.tagline ?? DEFAULT_TAGLINE;
  const showContact = data?.contactInfo?.showContactInfo !== false;
  const phone = data?.contactInfo?.phone ?? DEFAULT_PHONE;
  const showCta = data?.ctaButton?.showButton !== false;
  const ctaText = data?.ctaButton?.text ?? DEFAULT_CTA;
  const ctaMobile = data?.ctaButton?.mobileText ?? DEFAULT_CTA_MOBILE;

  const links =
    navLinks && navLinks.length > 0
      ? navLinks
          .filter((item) => item.label)
          .map((item) => {
            if (item.linkType === 'external' && item.externalUrl)
              return { href: item.externalUrl, label: item.label!, external: true, openInNewTab: item.openInNewTab };
            const section = item.internalSection ?? 'home';
            const hash = SECTION_TO_HASH[section] ?? section;
            return { href: `#${hash}`, label: item.label!, external: false };
          })
      : DEFAULT_NAV_LINKS.map((l) => ({ href: l.href, label: l.label, external: false }));

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-2 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-14 sm:h-20 gap-1 sm:gap-0">
            <div className="flex items-center min-w-0 flex-shrink">
              <div className="relative w-[110px] h-[20px] sm:w-[200px] sm:h-[35px] lg:w-[300px] lg:h-[50px] flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt={alt}
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 110px, (max-width: 1024px) 200px, 300px"
                  unoptimized={logoUrl.startsWith('http')}
                />
              </div>
              {tagline && (
                <span className="ml-1 sm:ml-3 text-xs sm:text-base lg:text-lg font-heading font-bold text-primary whitespace-nowrap">
                  {tagline}
                </span>
              )}
            </div>
            <nav className="hidden 2xl:flex space-x-8">
              {links.map((link, i) =>
                'external' in link && link.external ? (
                  <a
                    key={i}
                    href={link.href}
                    target={'openInNewTab' in link && link.openInNewTab ? '_blank' : undefined}
                    rel={'openInNewTab' in link && link.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="text-gray-700 hover:text-primary transition"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={i}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={
                      activeSection === link.href.replace('#', '')
                        ? 'text-secondary font-medium border-b-2 border-secondary pb-1'
                        : 'text-gray-700 hover:text-primary transition'
                    }
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>
            <div className="flex items-center space-x-1.5 sm:space-x-3 lg:space-x-4 flex-shrink-0">
              {showContact && phone && (
                <a href={`tel:${phone}`} className="flex items-center text-primary font-medium">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden lg:inline ml-2">{phone}</span>
                </a>
              )}
              {showCta && (
                <button
                  onClick={handleBookAppointment}
                  disabled={!isApiResolved}
                  className={`px-2 py-1.5 sm:px-4 sm:py-2.5 lg:px-6 rounded transition font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap flex items-center gap-2 ${
                    isApiResolved
                      ? 'bg-secondary text-white hover:bg-opacity-90 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span className="hidden sm:inline">{ctaText}</span>
                  <span className="sm:hidden">{ctaMobile}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDoctor={firstDoctor} />
    </>
  );
}
