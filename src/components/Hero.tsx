'use client'

import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import RichTextRenderer from '@/components/ui/RichTextRenderer'
import { renderTextWithHighlights } from '@/lib/textUtils'

interface HeroProps {
  hero?: {
    backgroundImage?: { asset?: any }
    showImage?: boolean
    heroLayout?: 'separate' | 'overlay'
    headline?: string
    subheadline?: any[]
    highlightedTexts?: string[]
    badge?: { text?: string; showBadge?: boolean }
    ctaButton?: { text?: string; linkType?: 'link' | 'scroll'; sectionId?: string; link?: string }
    secondaryButton?: { text?: string; linkType?: 'link' | 'scroll'; sectionId?: string; link?: string; showButton?: boolean }
  }
}

const handleSmoothScroll = (link: string, e: React.MouseEvent) => {
  if (link && !link.startsWith('http')) {
    e.preventDefault()
    const element = document.getElementById(link.replace('#', ''))
    if (element) {
      const headerHeight = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }
}

const HeroContent = ({ hero, isOverlay = false }: HeroProps & { isOverlay?: boolean }) => {
  const { headline, highlightedTexts = [], subheadline = [], badge, ctaButton, secondaryButton } = hero || {}
  
  return (
    <div className="container mx-auto px-6 lg:px-8">
      <div className={`max-w-4xl ${isOverlay ? 'ml-0 text-left' : 'mx-auto text-center'}`}>
        {badge?.showBadge && (
          <motion.div
            className={`${isOverlay ? 'inline-flex' : 'inline-flex'} items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
              isOverlay 
                ? 'bg-white/20 backdrop-blur-sm text-white' 
                : 'bg-hnmc-teal/10 text-hnmc-teal'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {badge.text}
          </motion.div>
        )}

        {headline && (
          <motion.h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
              isOverlay ? 'text-white' : 'text-primary'
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {renderTextWithHighlights(headline, highlightedTexts)}
          </motion.h1>
        )}

        {subheadline.length > 0 && (
          <motion.div
            className={`text-lg md:text-xl leading-relaxed mb-12 font-body ${
              isOverlay ? 'text-white' : 'text-hnmc-gray-600'
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <RichTextRenderer
              content={subheadline}
              className={`[&_p]:text-lg md:[&_p]:text-xl [&_p]:leading-relaxed [&_p]:mb-0 ${
                isOverlay ? '[&_p]:text-white' : '[&_p]:text-hnmc-gray-600'
              }`}
            />
          </motion.div>
        )}

        {(ctaButton || secondaryButton?.showButton) && (
          <motion.div
            className={`flex flex-col sm:flex-row gap-4 items-center ${isOverlay ? 'justify-start' : 'justify-center'}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {((ctaButton?.linkType === 'scroll' && ctaButton?.sectionId) || 
              (ctaButton?.linkType === 'link' && ctaButton?.link) ||
              (!ctaButton?.linkType && ctaButton?.link)) && (
              <a
                href={
                  ctaButton.linkType === 'scroll' && ctaButton.sectionId
                    ? `#${ctaButton.sectionId}`
                    : ctaButton.link || '#'
                }
                className="inline-flex items-center justify-center px-8 py-4 bg-hnmc-teal hover:bg-hnmc-teal/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-lg font-body"
                {...(ctaButton.linkType === 'link' && 
                     ctaButton.link?.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                onClick={(e) => {
                  if (ctaButton?.linkType === 'scroll' && ctaButton.sectionId) {
                    e.preventDefault();
                    handleSmoothScroll(`#${ctaButton.sectionId}`, e);
                  } else if (ctaButton?.link && !ctaButton.link.startsWith('http')) {
                    handleSmoothScroll(ctaButton.link, e);
                  }
                }}
              >
                <Calendar size={20} className="mr-2" />
                <span>{ctaButton.text}</span>
              </a>
            )}
            {secondaryButton?.showButton && 
             ((secondaryButton.linkType === 'scroll' && secondaryButton.sectionId) || 
              (secondaryButton.linkType === 'link' && secondaryButton.link) ||
              (!secondaryButton.linkType && secondaryButton.link)) && (
              <a
                href={
                  secondaryButton.linkType === 'scroll' && secondaryButton.sectionId
                    ? `#${secondaryButton.sectionId}`
                    : secondaryButton.link || '#'
                }
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-hnmc-teal text-hnmc-teal hover:bg-hnmc-teal hover:text-white font-semibold rounded-xl transition-all duration-300 text-lg font-body"
                {...(secondaryButton.linkType === 'link' && 
                     secondaryButton.link?.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                onClick={(e) => {
                  if (secondaryButton?.linkType === 'scroll' && secondaryButton.sectionId) {
                    e.preventDefault();
                    handleSmoothScroll(`#${secondaryButton.sectionId}`, e);
                  } else if (secondaryButton?.link && !secondaryButton.link.startsWith('http')) {
                    handleSmoothScroll(secondaryButton.link, e);
                  }
                }}
              >
                <span>{secondaryButton.text}</span>
                <ArrowRight size={20} className="ml-2" />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function Hero({ hero }: HeroProps) {
  const layout = hero?.heroLayout || 'separate'
  const backgroundImage = hero?.backgroundImage
  const showImage = hero?.showImage !== false // Default to true if not specified

  if (layout === 'overlay') {
    return (
      <section
        id="home"
        className={`relative ${showImage && backgroundImage?.asset ? 'bg-primary' : ''} flex items-center min-h-[400px] md:min-h-[500px] lg:min-h-[700px] py-16`}
      >
        {showImage && backgroundImage?.asset && (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={urlFor(backgroundImage.asset).url()}
                alt="Hero Background"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/15 z-10" />
          </>
        )}
        <div className="relative z-20 w-full">
          <HeroContent hero={hero} isOverlay={showImage && backgroundImage?.asset} />
        </div>
      </section>
    )
  }

  return (
    <>
      {showImage && backgroundImage?.asset && (
        <section
          id="home"
          className="relative bg-primary flex items-center min-h-[400px] md:min-h-[500px] lg:min-h-[700px]"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(backgroundImage.asset).url()}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}
      <section id="hero-content" className="py-16 px-6 bg-hnmc-gray">
        <HeroContent hero={hero} isOverlay={false} />
      </section>
    </>
  )
}
