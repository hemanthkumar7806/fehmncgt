import { ArrowRight, Calendar, Shield, Award } from 'lucide-react'

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
  const headline = hero?.headline || 'Expert Medical Care at Holy Name Medical Center'
  const subheadline = hero?.subheadline || 'Experience compassionate, comprehensive healthcare with our team of specialists. From routine care to complex treatments, we\'re here for your health journey.'
  const ctaText = hero?.ctaButton?.text || 'Schedule Appointment'
  const ctaLink = hero?.ctaButton?.link || '#appointment'
  
  return (
    <section id="home" className="relative bg-[#093b60]">
      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <Shield size={16} className="mr-2" />
              Trusted Healthcare Since 1925
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {headline}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                {subheadline}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={ctaLink}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Calendar size={20} className="mr-2" />
                <span>{ctaText}</span>
              </a>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#093b60] font-semibold rounded-xl transition-all duration-300">
                <span>Learn More</span>
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">25+</div>
                <div className="text-sm text-white/70">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-white/70">Medical Specialists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/70">Emergency Care</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
              {/* Medical Icons Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-8 gap-4 h-full">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full opacity-20" />
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#093b60] rounded-2xl mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900">
                  Award-Winning Healthcare
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Recognized for excellence in patient care, safety, and medical innovation. 
                  Our commitment to quality healthcare has earned us multiple accreditations 
                  and awards.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#01a69c] rounded-full"></div>
                    <span className="text-sm text-gray-700">Joint Commission Accredited</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#01a69c] rounded-full"></div>
                    <span className="text-sm text-gray-700">Magnet® Recognition for Nursing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#01a69c] rounded-full"></div>
                    <span className="text-sm text-gray-700">Top 100 Hospital Award</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Online Now</div>
                  <div className="text-xs text-gray-600">Book appointments 24/7</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Next Available</div>
                  <div className="text-xs text-gray-600">Today at 2:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
