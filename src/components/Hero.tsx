'use client'

import { ArrowRight, Calendar, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import RichTextRenderer from '@/components/ui/RichTextRenderer'

interface HeroProps {
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
    backgroundImage?: {
      asset?: any
    }
  }
}

export default function Hero({ hero }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  
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
  
  useEffect(() => {
    // Add 0.4 second delay before hero animations start
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Fallback data
  const headline = hero?.headline || 'Comprehensive Fibroid Care at Holy Name'
  const subheadline = hero?.subheadline || []
  const badge = hero?.badge
  const ctaButton = hero?.ctaButton
  const secondaryButton = hero?.secondaryButton
  const backgroundImage = hero?.backgroundImage

  return (
    <section 
      id="home" 
      className="relative bg-primary py-10 flex items-center"
    >
      {/* Background Image */}
      {backgroundImage?.asset && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(backgroundImage.asset).url()}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/90" />
        </div>
      )}

      {/* Main Content - Centered Layout */}
      <div className="relative z-1 container mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge?.showBadge && (
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Shield size={16} className="mr-2" />
              {badge.text}
            </motion.div>
          )}

          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {headline}
          </motion.h1>

          {/* Subheading */}
          <motion.div 
            className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {subheadline.length > 0 && <RichTextRenderer 
              content={subheadline} 
              className="[&_p]:text-xl md:[&_p]:text-2xl [&_p]:text-white/90 [&_p]:leading-relaxed [&_p]:mb-0"
            />}
          </motion.div>
          
          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            {ctaButton && (
              <a 
                href={ctaButton.link}
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg"
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
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-xl transition-all duration-300 text-lg"
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