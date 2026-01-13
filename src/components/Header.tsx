import { Menu, Phone, Calendar, Clock } from 'lucide-react'
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
    <header className={`fixed top-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300 ${isOpen ? 'lg:left-64' : 'lg:left-0'} left-0`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Hamburger + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Hamburger Button - Only show menu icon (close button is in sidebar) */}
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {!isOpen && <Menu size={20} className="text-primary sm:w-6 sm:h-6" />}
            </button>
            
            {/* Logo - Desktop (hide both logo and tagline when sidebar is open) */}
            <div className={`hidden sm:flex items-center space-x-3 transition-all duration-300 ${isOpen ? 'lg:opacity-0 lg:pointer-events-none' : 'lg:opacity-100'}`}>
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
                <a href={`tel:${phone}`} className="flex items-center space-x-2 text-sm hover:text-secondary transition-colors cursor-pointer">
                  <Phone size={16} className="text-secondary" />
                  <span className="text-hnmc-gray-700">{phone}</span>
                </a>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock size={16} className="text-secondary" />
                  <span className="text-hnmc-gray-700">{emergencyText}</span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            {showCtaButton && (
              <a
                href="#experts"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById('experts')
                  if (element) {
                    const headerHeight = 100
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                    const offsetPosition = elementPosition - headerHeight
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    })
                  }
                }}
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
