'use client'

import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface HeroProps {
  hero?: {
    backgroundImage?: {
      asset?: any
    }
  }
}

export default function Hero({ hero }: HeroProps) {
  const backgroundImage = hero?.backgroundImage

  return (
    <section 
      id="home" 
      className="relative bg-primary flex items-center min-h-[400px] md:min-h-[500px] lg:min-h-[700px]"
    >
      {/* Background Image - No overlay, no text, no CTAs */}
      {backgroundImage?.asset && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(backgroundImage.asset).url()}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </section>
  )
}