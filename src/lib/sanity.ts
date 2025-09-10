import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Only log environment variables once in development
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('🔧 Environment variables check:', {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    hasToken: !!process.env.SANITY_TOKEN
  })
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rl2j4kml',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-08-30', // Updated to match your working URL
  useCdn: false, // Set to false for development to avoid caching issues
  token: process.env.SANITY_TOKEN, // Optional: for private content
})

// Only log client config once in development
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('🔧 Sanity client created with config:', {
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    useCdn: client.config().useCdn
  })
}

// Test function to check if Sanity connection works
export async function testSanityConnection() {
  try {
    console.log('🧪 Testing Sanity connection...')
    // Try the most basic query possible - just get any document
    const result = await client.fetch('*[0]')
    console.log('✅ Sanity connection test result:', result)
    return true
  } catch (error) {
    console.error('❌ Sanity connection test failed:', error)
    console.error('❌ Connection error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      statusCode: (error as any)?.statusCode
    })
    
    // Check if it's a CORS issue
    if (error instanceof Error && error.message.includes('CORS')) {
      console.error('🚨 CORS issue detected! You need to add localhost to your Sanity CORS origins.')
    }
    
    return false
  }
}

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Function to check what document types exist
export async function getDocumentTypes() {
  try {
    console.log('🔍 Checking available document types...')
    const result = await client.fetch('*[_type in ["homePage", "doctor", "service", "testimonial"]] | order(_type)')
    console.log('📋 Available documents:', result)
    return result
  } catch (error) {
    console.error('❌ Error checking document types:', error)
    return []
  }
}

// Query to fetch navbar data
export const navbarQuery = `
  *[_type == "navbar"][0] {
    logoAlt,
    logo {
      asset->
    },
    mobileLogo {
      asset->
    },
    tagline,
    contactInfo {
      phone,
      emergencyText,
      showContactInfo
    },
    ctaButton {
      text,
      mobileText,
      showButton
    }
  }
`

// Query to fetch sidebar data
export const sidebarQuery = `
  *[_type == "sidebar"][0] {
    logo {
      asset->
    },
    menuItems[] {
      icon,
      label,
      linkType,
      internalSection,
      externalUrl,
      openInNewTab
    },
    contactInfo {
      phone,
      email,
      address,
      showContactInfo
    },
  }
`

// Query to fetch homepage data based on your Sanity schema
export const homepageQuery = `
  *[_type == "homePage"][0] {
    seo,
    hero {
      headline,
      subheadline,
      badge {
        text,
        showBadge
      },
      ctaButton {
        text,
        link
      },
      secondaryButton {
        text,
        link,
        showButton
      },
      stats[] {
        number,
        label
      },
      rightContent {
        title,
        description,
        achievements[] {
          text
        }
      },
      floatingCards[] {
        title,
        subtitle,
        position,
        showCard
      },
      backgroundImage {
        asset-> {
          _id,
          url
        }
      }
    },
    topic {
      title,
      subtitle,
      whatIsTopic,
      commonSymptoms,
      doYouHaveSymptoms {
        link,
        symptomsExist
      }
    },
    about {
      title,
      content,
      stats[] {
        number,
        label
      }
    },
    services {
      title,
      subtitle,
      servicesList[] {
        title,
        description,
        icon
      }
    },
    doctors {
      title,
      subtitle,
      featuredDoctors[]-> {
        _id,
        name,
        title,
        credentials,
        photo,
        slug
      },
      ctaButton {
        text,
        link
      }
    },
    testimonials {
      title,
      subtitle,
      testimonialsList[] {
        quote,
        author,
        authorTitle,
        rating,
      }
    },
    resources {
      title,
      subtitle,
      resourcesList[] {
        title,
        icon,
        description,
        link
      }
    },
    registerForPatientPortal {
      title,
      subtitle,
      contactInfo{
        phone,
        email,
        address
      },
      signUpButton{
        text,
        link
      }
    },
    footer {
      logo,
      description,
      platform,
      socialLinks
    }
  }
`

// Simple cache to prevent multiple identical calls
let homepageDataCache: any = null
let navbarDataCache: any = null
let sidebarDataCache: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Function to fetch navbar data
export async function getNavbarData() {
  // Check cache first
  const now = Date.now()
  if (navbarDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Returning cached navbar data')
    return navbarDataCache
  }

  try {
    console.log('🔧 Fetching navbar data...')
    console.log('📝 Executing query:', navbarQuery)
    
    const data = await client.fetch(navbarQuery)
    console.log('✅ Navbar query successful, data:', data)
    
    // Cache the result
    navbarDataCache = data
    cacheTimestamp = now
    
    return data
  } catch (error) {
    console.error('❌ Error fetching navbar data:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      statusCode: (error as any)?.statusCode
    })
    
    // Return fallback data from JSON file
    try {
      const fallbackData = await import('@/constants/fallbackData.navbar.json')
      return fallbackData.default || fallbackData
    } catch (error) {
      console.error('❌ Error loading fallback data:', error)
      return null
    }
  }
}

// Function to fetch sidebar data
export async function getSidebarData() {
  // Check cache first
  const now = Date.now()
  if (sidebarDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return sidebarDataCache
  }

  try {
    const data = await client.fetch(sidebarQuery)
    sidebarDataCache = data
    cacheTimestamp = now
    return data
  } catch (error) {
    try {
      console.log(error);
      const fallbackData = await import('@/constants/fallbackData.sidebar.json')
      return fallbackData
    } catch (error) {
      console.log(error);
      return null
    }
  }
}

// Function to fetch homepage data
export async function getHomePageData() {
  // Check cache first
  const now = Date.now()
  if (homepageDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Returning cached homepage data')
    return homepageDataCache
  }

  try {
    console.log('🔧 Sanity client config:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      useCdn: client.config().useCdn
    })
    console.log('📝 Executing query:', homepageQuery)
    
    const data = await client.fetch(homepageQuery)
    console.log('✅ Query successful, data:', data)
    
    // Cache the result
    homepageDataCache = data
    cacheTimestamp = now
    
    return data
  } catch (error) {
    console.error('❌ Error fetching homepage data:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      statusCode: (error as any)?.statusCode
    })
    
    // Fallback: Try using our server-side API route
    try {
      console.log('🔄 Trying server-side API route as fallback...')
      const response = await fetch('/api/sanity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: homepageQuery }),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Server-side API route successful:', result.data)
        return result.data
      }
    } catch (fallbackError) {
      console.error('❌ Server-side API route also failed:', fallbackError)
    }
    
    return null
  }
}

// Function to fetch data by document ID (for your specific URL)
export async function getHomePageById(id: string) {
  try {
    console.log('🔧 Fetching by document ID:', id)
    const query = `*[_id == $id][0] {
      seo,
      hero {
        headline,
        subheadline,
        ctaButton {
          text,
          link
        }
      },
      about {
        title,
        description,
        stats[] {
          number,
          label
        }
      },
      services {
        title,
        subtitle,
        servicesList[] {
          title,
          description,
          icon
        }
      },
      doctors {
        title,
        subtitle,
        featuredDoctors[]-> {
          _id,
          name,
          title,
          credentials,
          photo,
          slug
        },
        ctaButton {
          text,
          link
        }
      },
      testimonials {
        title,
        subtitle,
        testimonialsList[] {
          name,
          role,
          content,
          rating,
          photo
        }
      },
      contact {
        title,
        subtitle,
        phone,
        email,
        address,
        hours
      },
      footer {
        logo,
        description,
        links,
        socialMedia
      }
    }`
    
    console.log('📝 Executing ID query:', query)
    const data = await client.fetch(query, { id })
    console.log('✅ ID query successful, data:', data)
    return data
  } catch (error) {
    console.error('❌ Error fetching homepage data by ID:', error)
    return null
  }
}
