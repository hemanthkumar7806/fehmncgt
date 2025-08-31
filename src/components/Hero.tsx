import { ArrowRight, Play, Heart } from 'lucide-react'

interface HeroProps {
  hero?: {
    headline?: string
    subheadline?: string
    ctaButton?: {
      text?: string
      link?: string
    }
  }
}

export default function Hero({ hero }: HeroProps) {
  const headline = hero?.headline || 'Comprehensive Fibroid Care at Holy Name'
  const subheadline = hero?.subheadline || 'Experience personalized, multidisciplinary care with cutting-edge treatments and digital health solutions. Your journey to better health starts here.'
  const ctaText = hero?.ctaButton?.text || 'Book Your Consultation'
  const ctaLink = hero?.ctaButton?.link || '#appointment'
  
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-[#093b60] via-[#0f5a8a] to-[#01a69c]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            <Heart size={16} className="mr-2" />
            Specialized Fibroid Care
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
            {subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a 
              href={ctaLink}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2  border-white text-white hover:bg-white hover:text-[#093b60]">
              <span>{ctaText}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="btn-outline text-lg px-8 py-4 flex items-center justify-center space-x-2 border-white text-white hover:bg-white hover:text-[#093b60]">
              <Play size={20} />
              <span>Watch Our Story</span>
            </button>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80">Successful Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">Patient Satisfaction</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
