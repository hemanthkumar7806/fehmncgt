'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Hero from '@/components/Hero'
import Experts from '@/components/Experts'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Footer'
import UnderstandTopic from '@/components/UnderstandTopic'
import Testimonials from "@/components/Testimonials";
import { getHomePageData, getHomePageById } from '@/lib/sanity'
import Resources from '@/components/Resources'
import Footer from '@/components/Footer'

interface HomePageData {
  seo?: any
  hero?: {
    headline?: string
    subheadline?: string
    ctaButton?: {
      text?: string
      link?: string
    }
  }
  topic?: {
    title?: string;
    subtitle?: string;
    whatIsTopic?: string;
    commonSymptoms?: string;
    doYouHaveSymptoms?: {
      link?: string;
      symptomsExist?: string;
    };
  };
  about?: {
    title?: string
    description?: string
    stats?: Array<{
      number?: string
      label?: string
    }>
  }
  services?: {
    title?: string
    subtitle?: string
    servicesList?: Array<{
      title?: string
      description?: string
      icon?: string
    }>
  }
  resources?: {
    title?: string
    subtitle?: string
    resourcesList?: Array<{
      title?: string
      description?: string
      icon?: string
    }>
  }
  doctors?: {
    title?: string
    subtitle?: string
    featuredDoctors?: Array<{
      _id?: string
      name?: string
      title?: string
      credentials?: string
      photo?: any
      slug?: any
    }>
    ctaButton?: {
      text?: string
      link?: string
    }
  }
  testimonials?: {
    title?: string
    subtitle?: string
    testimonialsList?: Array<{
      name?: string
      role?: string
      content?: string
      rating?: number
      photo?: any
    }>
  }
  contact?: {
    title?: string
    subtitle?: string
    phone?: string
    email?: string
    address?: string
    hours?: any
  }
  footer?: {
    logo?: any
    description?: string
    links?: any
    socialMedia?: any
  }
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true // Prevent setting state if component unmounts
    
    const fetchHomePageData = async () => {
      try {
        console.log('🔍 Starting to fetch homepage data...')
        
        // Try to fetch from Sanity CMS first
        console.log('🔄 Attempting to fetch from Sanity CMS...')
        let data = await getHomePageData()
        console.log('📊 Data from getHomePageData():', data)
        
        // If no data from Sanity, try with the specific document ID from your URL
        if (!data) {
          console.log('⚠️ No data from general query, trying specific document ID...')
          const documentId = '5e8dcfb7-4ff2-44bd-9a84-d0b76b2a4e39'
          data = await getHomePageById(documentId)
          console.log('📊 Data from getHomePageById():', data)
        }
        
                // If still no data, use fallback mock data
        if (!data) {
          console.log('❌ No data from Sanity CMS, using fallback data')
          data = {
            hero: {
              headline: 'Your Health, Our Priority',
              subheadline: 'Providing exceptional healthcare services with compassion and expertise. Your wellness journey starts here.',
              ctaButton: {
                text: 'Book Appointment',
                link: '/appointments'
              }
            },
            services: {
              title: 'Our Services',
              subtitle: 'Comprehensive healthcare services for you and your family',
              servicesList: [
                {
                  title: 'Primary Care',
                  description: 'Comprehensive health care for individuals and families of all ages.',
                  icon: 'stethoscope'
                },
                {
                  title: 'Cardiology',
                  description: 'Expert care for heart and cardiovascular conditions.',
                  icon: 'heart'
                },
                {
                  title: 'Neurology',
                  description: 'Specialized treatment for neurological disorders and conditions.',
                  icon: 'brain'
                },
                {
                  title: 'Pediatrics',
                  description: 'Compassionate care for children from birth through adolescence.',
                  icon: 'baby'
                },
                {
                  title: 'Ophthalmology',
                  description: 'Complete eye care and vision services.',
                  icon: 'eye'
                },
                {
                  title: 'Dental Care',
                  description: 'Comprehensive dental health and hygiene services.',
                  icon: 'activity'
                }
              ]
            },
            contact: {
              title: 'Contact Us',
              subtitle: 'Get in touch with us for appointments and inquiries',
              phone: '+1 (555) 123-4567',
              email: 'info@hnmc.com',
              address: '123 Medical Center Drive, Healthcare City, HC 12345'
            }
          }
        }
        
        if (isMounted) {
          setHomePageData(data)
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        // Use fallback data on error
        if (isMounted) {
          setHomePageData({
            hero: {
              headline: 'Your Health, Our Priority',
              subheadline: 'Providing exceptional healthcare services with compassion and expertise.'
            },
            services: {
              title: 'Our Services',
              servicesList: []
            },
            contact: {
              title: 'Contact Us',
              phone: '+1 (555) 123-4567',
              email: 'info@hnmc.com',
              address: '123 Medical Center Drive'
            }
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchHomePageData()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array to run only once

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className="pt-16">
        <Hero hero={homePageData?.hero} />
        
        {/* <Experts doctors={homePageData?.doctors?.featuredDoctors} /> */}
        <Experts />

        <UnderstandTopic topic={homePageData?.topic} />
        
        <Services services={homePageData?.services} />

        <Resources resources={homePageData?.resources} />
        
        <About about={homePageData?.about} />

        <Testimonials title={homePageData?.testimonials?.title} subtitle={homePageData?.testimonials?.subtitle} testimonialsList={homePageData?.testimonials?.testimonialsList}/>
      
        <Footer footer={homePageData?.footer} />
      </main>
    </div>
  )
}
