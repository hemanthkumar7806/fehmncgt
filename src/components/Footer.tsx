'use client'

import { useState } from 'react'
import { Facebook, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react'
import type { FooterData } from '@/types/cms'
import PrivacyPolicyModal from './ui/PrivacyPolicyModal'

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
}

const DEFAULT_COPYRIGHT = '© 2025 HNMC Healthcare. All rights reserved.'

export default function Footer({ data }: { data?: FooterData | null }) {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  
  const copyright = data?.copyright ?? DEFAULT_COPYRIGHT
  const socialLinks = (data?.socialLinks ?? []).filter((s) => s.showLink !== false && s.url)
  const footerLinks = (data?.footerLinks ?? []).filter((f) => f.showLink !== false && f.url)

  const handleLinkClick = (link: { title?: string; url?: string; openInNewTab?: boolean }) => {
    // Check if it's a privacy policy link
    if (link.title?.toLowerCase().includes('privacy')) {
      setIsPrivacyModalOpen(true)
    } else if (link.url) {
      // For other links, open normally
      if (link.openInNewTab) {
        window.open(link.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = link.url
      }
    }
  }

  return (
    <>
      <footer className="bg-white border-t border-gray-200">
        <div className="px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {socialLinks.length > 0 && (
              <div className="flex space-x-6 mb-6 md:mb-0">
                {socialLinks.map((s, i) => {
                  const Icon = (s.platform && SOCIAL_ICONS[s.platform.toLowerCase()]) ? SOCIAL_ICONS[s.platform.toLowerCase()] : null
                  if (!Icon || !s.url) return null
                  return (
                    <a key={i} href={s.url} className="text-gray-600 hover:text-secondary transition" aria-label={s.platform ?? 'Social'} target="_blank" rel="noopener noreferrer">
                   <Icon className="w-5 h-5  2xl:w-6 2xl:h-6" />
                    </a>
                  )
                })}
              </div>
            )}
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                {copyright}
                {footerLinks.length > 0 && footerLinks.map((f, i) => (
                  <span key={i}>
                    {' | '}
                    <button
                      onClick={() => handleLinkClick(f)}
                      className="text-secondary hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      {f.title}
                    </button>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  )
}
