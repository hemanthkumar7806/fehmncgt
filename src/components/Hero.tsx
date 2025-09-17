'use client'

import { ArrowRight, Calendar, Shield, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface HeroProps {
  hero?: {
    headline?: string
    subheadline?: string
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
    stats?: Array<{
      number?: string
      label?: string
    }>
    rightContent?: {
      title?: string
      description?: string
      achievements?: Array<{
        text?: string
      }>
    }
    floatingCards?: Array<{
      title?: string
      subtitle?: string
      position?: string
      showCard?: boolean
    }>
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
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
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
  const subheadline = hero?.subheadline || 'Experience personalized, multidisciplinary care with cutting-edge treatments and digital health solutions. Your journey to better health starts here.'
  const badge = hero?.badge
  const ctaButton = hero?.ctaButton
  const secondaryButton = hero?.secondaryButton
  const stats = hero?.stats || []
  const rightContent = hero?.rightContent
  const floatingCards = hero?.floatingCards || []
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
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {headline}
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {subheadline}
          </motion.p>
          
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

          {/* Stats - Hidden in simple layout but kept for schema compatibility */}
          {stats.length > 0 && (
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-12 border-t border-white/20 mt-12"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ display: 'none' }} // Hidden but kept for schema
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Right Content - Hidden in simple layout but kept for schema compatibility */}
          {rightContent && (
            <motion.div 
              className="relative mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'none' }} // Hidden but kept for schema
            >
              <div className="relative bg-white rounded-3xl p-8 pb-16 lg:p-12 lg:pb-16 shadow-xl z-5">
                <div className="relative z-1 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-hnmc-gray-800">
                    {rightContent?.title || 'Award-Winning Healthcare'}
                  </h3>
                  
                  <p className="text-hnmc-gray-600 leading-relaxed">
                    {rightContent?.description}
                  </p>
                  
                  <div className="space-y-4">
                    {(rightContent?.achievements || [
                      { text: 'Joint Commission Accredited' },
                      { text: 'Magnet® Recognition for Nursing' },
                      { text: 'Top 100 Hospital Award' }
                    ]).map((achievement, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-sm text-hnmc-gray-700">{achievement.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards - Hidden in simple layout but kept for schema compatibility */}
              {floatingCards.map((card, index) => {
                if (!card.showCard) return null
                
                const positionClasses = card.position === 'top-right' 
                  ? '-top-6 -right-6' 
                  : '-bottom-6 -left-6'
                
                return (
                  <motion.div 
                    key={index}
                    className={`absolute ${positionClasses} bg-white rounded-2xl shadow-lg p-4 border border-gray-100`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${card.position === 'top-right' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                        {card.position === 'top-right' ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        ) : (
                          <Calendar className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-hnmc-gray-800">{card.title}</div>
                        <div className="text-xs text-hnmc-gray-600">{card.subtitle}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>

    </section>
  )
}