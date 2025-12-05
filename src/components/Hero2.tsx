'use client'

import { ArrowRight, Calendar, Shield, Award } from 'lucide-react'
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

export default function Hero2({ hero }: HeroProps) {
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
  const headline = hero?.headline || 'Expert Medical Care at Holy Name Medical Center'
  const subheadline = hero?.subheadline || []
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
      className="relative bg-primary xl:h-[calc(100vh-64px)] xl:max-h-[1000px] flex items-center"
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

      {/* Main Content */}
      <div className="relative z-1 container mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
          {/* Left Content */}
          <motion.div 
            className="space-y-6 xl:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            {badge?.showBadge && (
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Shield size={16} className="mr-2" />
                {badge.text}
              </motion.div>
            )}

            <motion.div 
              className="space-y-4 xl:space-y-6"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {headline}
              </h1>
              {subheadline.length > 0 && <div className="text-xl text-white/90 leading-relaxed max-w-xl">
                <RichTextRenderer 
                  content={subheadline} 
                  className="[&_p]:text-xl [&_p]:text-white/90 [&_p]:leading-relaxed [&_p]:mb-0"
                />
              </div>}
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {ctaButton && (
                <a 
                  href={ctaButton.link}
                  className="inline-flex items-center justify-center px-4 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-xl transition-all duration-300"
                  {...(secondaryButton.link?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={(e) => handleSmoothScroll(secondaryButton.link || '', e)}
                >
                  <span>{secondaryButton.text}</span>
                  <ArrowRight size={20} className="ml-2" />
                </a>
              )}
            </motion.div>

            {/* Stats */}
            {stats.length > 0 && (
              <motion.div 
                className="grid grid-cols-3 gap-8 pt-4 xl:pt-6 border-t border-white/20"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Content - Image/Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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

            {/* Floating Cards */}
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
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
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
        </div>
      </div>

    </section>
  )
}