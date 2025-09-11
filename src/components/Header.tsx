import { Menu, X, Phone, Calendar, Clock } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import fallbackDataNavbar from '@/constants/fallbackData.navbar.json'

interface NavbarData {
  logoAlt?: string
  logo?: {
    asset?: any
  }
  mobileLogo?: {
    asset?: any
  }
  tagline?: string
  contactInfo?: {
    phone?: string
    emergencyText?: string
    showContactInfo?: boolean
  }
  ctaButton?: {
    text?: string
    mobileText?: string
    showButton?: boolean
  }
}

interface HeaderProps {
  isOpen: boolean
  onToggle: () => void
  navbarData?: NavbarData | null
}

export default function Header({ isOpen, onToggle, navbarData }: HeaderProps) {
  const data = navbarData || fallbackDataNavbar
  
  const desktopLogo = data?.logo?.asset ? urlFor(data.logo.asset).url() : '/holy_name_logo.jpg'
  const mobileLogo = data?.mobileLogo?.asset ? urlFor(data.mobileLogo.asset).url() : (data?.logo?.asset ? urlFor(data.logo.asset).url() : '/holy_name_logo.jpg')
  const logoAlt = data?.logoAlt || 'Holy Name Medical Center Logo'
  const tagline = data?.tagline || 'Fibroid Care Specialists'
  const phone = data?.contactInfo?.phone || ''
  const emergencyText = data?.contactInfo?.emergencyText || '24/7 Emergency'
  const showContactInfo = data?.contactInfo?.showContactInfo !== false
  const ctaText = data?.ctaButton?.text || 'Book Appointment'
  const ctaMobileText = data?.ctaButton?.mobileText || 'Book'
  const showCtaButton = data?.ctaButton?.showButton !== false

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Hamburger + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Hamburger Button */}
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={20} className="text-primary sm:w-6 sm:h-6" /> : <Menu size={20} className="text-primary sm:w-6 sm:h-6" />}
            </button>
            
            {/* Logo - Desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              <Image 
                src={desktopLogo} 
                alt={logoAlt} 
                width={200} 
                height={100}
                className="object-contain"
                priority
              />
              <p className="text-lg text-hnmc-gray-600 mt-1">{tagline}</p>
            </div>

            <div className="flex sm:hidden items-center space-x-2 flex-1 min-w-0">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image 
                  src={mobileLogo} 
                  alt={logoAlt} 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xs text-hnmc-gray-600 font-medium truncate">{tagline}</p>
            </div>
          </div>

          {/* Right Section - Contact Info + CTA */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Contact Info (hidden on mobile) */}
            {showContactInfo && (
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={16} className="text-secondary" />
                  <span className="text-hnmc-gray-700">{phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock size={16} className="text-secondary" />
                  <span className="text-hnmc-gray-700">{emergencyText}</span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            {showCtaButton && (
              <a
                href="https://www.zocdoc.com/wl/holyname/search?address=Teaneck%2C+NJ&after_5pm=false&before_10am=false&day_filter=AnyDay&dr_specialty=153&filters=%7B%7D&gender=-1&insurance_carrier=-1&insurance_plan=-1&language=-1&offset=0&parentSearchRequestId=2f0a8c4b-44d6-42f0-85cb-e05a0f442f80&reason_visit=2551&searchOriginator=SearchBar&searchQueryGuid=89fc74b0-ec9d-4dde-b352-3f1d0218fb5a&searchType=procedure&sees_children=false&sort_type=Default&visitType=inPersonAndVirtualVisits'"
                target="_blank"
                className="inline-flex items-center space-x-1 sm:space-x-2 bg-secondary hover:bg-secondary-light text-white px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm"
              >
                <Calendar size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{ctaText}</span>
                <span className="sm:hidden">{ctaMobileText}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
