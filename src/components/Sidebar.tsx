import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { X, Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import fallbackData from '@/constants/fallbackData.sidebar.json'

interface SidebarData {
  logo?: {
    asset?: any
  }
  menuItems?: Array<{
    icon?: string
    label?: string
    linkType?: string
    internalSection?: string
    externalUrl?: string | null
    openInNewTab?: boolean
  }>
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
    showContactInfo?: boolean
  }
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  sidebarData?: SidebarData | null
}

export default function Sidebar({ isOpen, onToggle, sidebarData }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  // Function to get Lucide icon by name
  const getIcon = (iconName: string) => {
    // Convert kebab-case to PascalCase (e.g., 'credit-card' -> 'CreditCard')
    const pascalCaseName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
    
    // Get the icon component from LucideIcons
    const IconComponent = (LucideIcons as any)[pascalCaseName]
    
    // Return the icon component or a default fallback
    return IconComponent || LucideIcons.Home
  }

  const data = sidebarData || fallbackData

  const menuItems = data?.menuItems
  const logo = data?.logo?.asset ? urlFor(data.logo.asset).url() : '/holy_name_logo.jpg'
  const contactInfo = data?.contactInfo

  const handleLinkClick = (item: any, index: number) => {
    setActiveIndex(index)
    if (item.linkType === 'internal' && item.internalSection) {
      const element = document.getElementById(item.internalSection)
      if (element) {
        // Get header height and add some padding
        const headerHeight = 100 // Approximate fixed header height
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    } else if (item.linkType === 'external' && item.externalUrl) {
      if (item.openInNewTab) {
        window.open(item.externalUrl, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = item.externalUrl
      }
    }
    // Only close sidebar on mobile
    if (window.innerWidth < 1024) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[45] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button - Inside sidebar, aligned with top */}
        {isOpen && (
          <button
            onClick={onToggle}
            className="absolute right-4 top-2 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} className="text-primary" />
          </button>
        )}
        
        <div className="px-6  pt-14">
          {/* Logo */}
          <div className="mb-2 text-center">
            <Image 
              src={logo} 
              alt="Holy Name Medical Center Logo" 
              width={200} 
              height={100}
              className="object-contain mx-auto"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems?.map((item, index) => {
              const IconComponent = getIcon(item.icon || 'home')
              const isActive = activeIndex === index
              return (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => handleLinkClick(item, index)}
                  className={`w-full text-left block p-3 rounded-lg transition-colors duration-200 font-medium ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Contact Info */}
          {contactInfo?.showContactInfo && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-primary mb-3">Contact Info</h3>
              <div className="space-y-2 text-sm text-hnmc-gray-600">
                {contactInfo.phone && (
                  <a href={`tel:${contactInfo.phone}`} className="flex items-center space-x-2 hover:text-secondary transition-colors cursor-pointer">
                    <Phone size={16} className="text-secondary flex-shrink-0" />
                    <span>{contactInfo.phone}</span>
                  </a>
                )}
                {contactInfo.email && (
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center space-x-2 hover:text-secondary transition-colors cursor-pointer">
                    <Mail size={16} className="text-secondary flex-shrink-0" />
                    <span>{contactInfo.email}</span>
                  </a>
                )}
                {contactInfo.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-secondary flex-shrink-0" />
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
