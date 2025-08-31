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

// Query to fetch homepage data based on your Sanity schema
export const homepageQuery = `
  *[_type == "homePage"][0] {
    seo,
    hero {
      headline,
      subheadline,
      ctaButton {
        text,
        link
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
      platform,
      socialLinks
    }
  }
`

// Simple cache to prevent multiple identical calls
let homepageDataCache: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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
