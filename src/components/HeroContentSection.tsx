'use client'

import { ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import RichTextRenderer from '@/components/ui/RichTextRenderer'

interface HeroContentSectionProps {
  hero?: {
    headline?: string
    subheadline?: any[]
    badge?: {
      text?: string
      showBadge?: boolean
    }
    ctaButton?: {
      text?: string
      link?: string
    }
    secondaryButton?: {
      text?: string
      link?: string
      showButton?: boolean
    }
  }
}

export default function HeroContentSection({ hero }: HeroContentSectionProps) {
  const handleSmoothScroll = (link: string, e: React.MouseEvent) => {
    if (link && !link.startsWith('http')) {
      e.preventDefault()
      const element = document.getElementById(link.replace('#', ''))
      if (element) {
        const headerHeight = 100
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  // Fallback data
  const headline = hero?.headline || 'Comprehensive Fibroid Care at Holy Name'
  const subheadline = hero?.subheadline || []
  const badge = hero?.badge
  const ctaButton = hero?.ctaButton
  const secondaryButton = hero?.secondaryButton

  return (
    <section className="py-16 px-6 bg-hnmc-gray">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge?.showBadge && (
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-hnmc-teal/10 text-hnmc-teal rounded-full text-sm font-medium mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {badge.text}
            </motion.div>
          )}

          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-hnmc-gray-800 leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {headline}
          </motion.h1>

          {/* Subheading */}
          {subheadline.length > 0 && (
            <motion.div 
              className="text-lg md:text-xl text-hnmc-gray-600 leading-relaxed mb-12 font-body"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <RichTextRenderer 
                content={subheadline} 
                className="[&_p]:text-lg md:[&_p]:text-xl [&_p]:text-hnmc-gray-600 [&_p]:leading-relaxed [&_p]:mb-0"
              />
            </motion.div>
          )}
          
          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {ctaButton && (
              <a 
                href={ctaButton.link}
                className="inline-flex items-center justify-center px-8 py-4 bg-hnmc-teal hover:bg-hnmc-teal/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg font-body"
                {...(ctaButton.link?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={(e) => handleSmoothScroll(ctaButton.link || '', e)}
              >
                <Calendar size={20} className="mr-2" />
                <span>{ctaButton.text}</span>
              </a>
            )}
            {secondaryButton?.showButton && (
              <a 
                href={secondaryButton.link || '#'}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-hnmc-teal text-hnmc-teal hover:bg-hnmc-teal hover:text-white font-semibold rounded-xl transition-all duration-300 text-lg font-body"
                {...(secondaryButton.link?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={(e) => handleSmoothScroll(secondaryButton.link || '', e)}
              >
                <span>{secondaryButton.text}</span>
                <ArrowRight size={20} className="ml-2" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

